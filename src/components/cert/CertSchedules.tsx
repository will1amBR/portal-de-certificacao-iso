import { useState, useEffect } from 'react'
import { Calendar, Clock, Video, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getSchedulesByCertification, IsoSchedule } from '@/services/schedules'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { ScheduleModal } from '@/components/ScheduleModal'

export function CertSchedules({ certId }: { certId: string }) {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<IsoSchedule[]>([])

  const load = async () => {
    setSchedules(await getSchedulesByCertification(certId))
  }
  useEffect(() => {
    load()
  }, [certId])
  useRealtime('schedules', () => {
    load()
  })

  const statusColor: Record<string, string> = {
    confirmado: 'bg-emerald-600',
    solicitado: 'bg-amber-500',
    cancelado: 'bg-red-500',
    realizado: 'bg-slate-600',
  }

  return (
    <div className="space-y-4">
      <ScheduleModal certificationId={certId} onScheduled={load} />

      {schedules.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nenhum agendamento.</p>
      ) : (
        <div className="space-y-2">
          {schedules.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200"
            >
              <div className="p-2 rounded-lg bg-slate-100">
                {s.type === 'auditoria' ? (
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                ) : (
                  <Video className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 capitalize">{s.type}</span>
                  <Badge className={statusColor[s.status] || 'bg-slate-400'}>{s.status}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(s.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{' '}
                    {new Date(s.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {s.notes && <p className="text-xs text-slate-500 mt-2">{s.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
