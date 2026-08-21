import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { getSchedules, updateScheduleStatus, IsoSchedule } from '@/services/schedules'
import { getCertifications, Certification } from '@/services/certifications'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScheduleModal } from '@/components/ScheduleModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function SchedulesPage() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<IsoSchedule[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const loadData = async () => {
    try {
      const [allScheds, allCerts] = await Promise.all([getSchedules(), getCertifications()])

      if (user?.role === 'cliente') {
        const userCertIds = new Set(allCerts.filter((c) => c.user === user.id).map((c) => c.id))
        setSchedules(allScheds.filter((s) => userCertIds.has(s.certification)))
        setCerts(allCerts.filter((c) => c.user === user.id))
      } else {
        setSchedules(allScheds)
        setCerts(allCerts)
      }
    } catch {
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  useRealtime('schedules', () => loadData())

  const isConsultantOrAdmin = user?.role === 'admin' || user?.role === 'consultor'

  const handleUpdateStatus = async (id: string, newStatus: IsoSchedule['status']) => {
    try {
      await updateScheduleStatus(id, newStatus)
      toast.success(`Status atualizado para "${newStatus}"`)
      loadData()
    } catch {
      toast.error('Erro ao atualizar status do agendamento')
    }
  }

  const filtered = schedules.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    return true
  })

  const statusMap: Record<string, { label: string; className: string }> = {
    confirmado: { label: 'Confirmado', className: 'bg-emerald-600 text-white' },
    solicitado: { label: 'Aguardando Confirmação', className: 'bg-amber-500 text-white' },
    cancelado: { label: 'Cancelado', className: 'bg-red-500 text-white' },
    realizado: { label: 'Realizado', className: 'bg-slate-700 text-white' },
  }

  const defaultCertId = certs[0]?.id || ''

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-[#0055A4]" /> Agendamentos & Auditorias
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Planejamento de auditorias internas/externas, alinhamentos com consultores e reuniões
            técnicas
          </p>
        </div>

        {defaultCertId && <ScheduleModal certificationId={defaultCertId} onScheduled={loadData} />}
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4 flex items-center gap-3 flex-wrap">
          <div className="w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Tipo de compromisso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="reunião">Reuniões de Alinhamento</SelectItem>
                <SelectItem value="auditoria">Auditorias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-56">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Status do agendamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="solicitado">Aguardando Confirmação</SelectItem>
                <SelectItem value="confirmado">Confirmados</SelectItem>
                <SelectItem value="realizado">Realizados</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-slate-400 ml-auto">
            {filtered.length} agendamento(s) encontrado(s)
          </span>
        </CardContent>
      </Card>

      {/* Schedules List */}
      {filtered.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-12 text-center text-slate-500">
            <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Nenhum agendamento marcado</p>
            <p className="text-xs text-slate-400 mt-1">
              Clique em "Solicitar Agendamento" para marcar uma sessão com o consultor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const certInfo = s.expand?.certification
            const isoName = certInfo?.expand?.iso_type?.name || 'Norma ISO'
            const company = certInfo?.company_name || 'Geral'
            const statusInfo = statusMap[s.status] || {
              label: s.status,
              className: 'bg-slate-500 text-white',
            }

            return (
              <Card
                key={s.id}
                className="border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <CardContent className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${s.type === 'auditoria' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}
                  >
                    {s.type === 'auditoria' ? (
                      <ShieldCheck className="h-6 w-6" />
                    ) : (
                      <Video className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 capitalize">
                        {s.type === 'auditoria'
                          ? 'Auditoria de Conformidade'
                          : 'Reunião de Alinhamento Técnico'}
                      </h3>
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="font-medium text-slate-700">{company}</span>
                      <span>•</span>
                      <span>{isoName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#0055A4]">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {new Date(s.date).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(s.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {s.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                        <strong>Pauta / Notas:</strong> {s.notes}
                      </p>
                    )}
                  </div>

                  {isConsultantOrAdmin && (
                    <div className="flex items-center gap-1.5 shrink-0 self-center">
                      {s.status === 'solicitado' && (
                        <>
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                            onClick={() => handleUpdateStatus(s.id, 'confirmado')}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs gap-1"
                            onClick={() => handleUpdateStatus(s.id, 'cancelado')}
                          >
                            <XCircle className="h-3.5 w-3.5" /> Recusar
                          </Button>
                        </>
                      )}

                      {s.status === 'confirmado' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-slate-700 gap-1 hover:bg-slate-100"
                          onClick={() => handleUpdateStatus(s.id, 'realizado')}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Marcar como
                          Realizado
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
