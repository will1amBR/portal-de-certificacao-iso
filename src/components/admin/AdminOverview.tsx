import { useState, useEffect } from 'react'
import { Users, ShieldCheck, FileText, Calendar, Bell } from 'lucide-react'
import { getAllUsers, IsoUser } from '@/services/users'
import { getCertifications, Certification } from '@/services/certifications'
import { getAllDocuments, IsoDocument } from '@/services/documents'
import { getSchedules, IsoSchedule } from '@/services/schedules'
import { getAllNotifications, Notification } from '@/services/notifications'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AdminOverview() {
  const [users, setUsers] = useState<IsoUser[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [docs, setDocs] = useState<IsoDocument[]>([])
  const [scheds, setScheds] = useState<IsoSchedule[]>([])
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [u, c, d, s, n] = await Promise.all([
        getAllUsers(),
        getCertifications(),
        getAllDocuments(),
        getSchedules(),
        getAllNotifications(),
      ])
      setUsers(u)
      setCerts(c)
      setDocs(d)
      setScheds(s)
      setNotifs(n.items)
    } catch {
      /* noop */
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('certifications', () => load())
  useRealtime('documents', () => load())
  useRealtime('schedules', () => load())
  useRealtime('notifications', () => load())

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const clients = users.filter((u) => u.role === 'cliente')
  const activeCerts = certs.filter((c) => c.status !== 'concluído' && c.status !== 'não iniciado')
  const pendingDocs = docs.filter((d) => d.status === 'pendente')
  const upcomingScheds = scheds.filter(
    (s) =>
      new Date(s.date) > new Date() && (s.status === 'solicitado' || s.status === 'confirmado'),
  )

  const statusCounts = certs.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const kpis = [
    { label: 'Total de Clientes', value: clients.length, icon: Users, color: 'text-[#0055A4]' },
    {
      label: 'Certificações Ativas',
      value: activeCerts.length,
      icon: ShieldCheck,
      color: 'text-emerald-600',
    },
    {
      label: 'Documentos Pendentes',
      value: pendingDocs.length,
      icon: FileText,
      color: 'text-amber-600',
    },
    {
      label: 'Agendamentos Próximos',
      value: upcomingScheds.length,
      icon: Calendar,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2.5 rounded-lg bg-slate-100">
                <k.icon className={`h-5 w-5 ${k.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Certificações por Status</h3>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {status}
                  </Badge>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
              ))}
              {Object.keys(statusCounts).length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Nenhuma certificação</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#0055A4]" /> Notificações Recentes
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notifs.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Sem notificações</p>
              ) : (
                notifs.slice(0, 6).map((n) => (
                  <div key={n.id} className="text-sm border-b border-slate-50 pb-1.5">
                    <p className="font-medium text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
