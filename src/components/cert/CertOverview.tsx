import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Calendar, FileText, Printer, UserCog } from 'lucide-react'
import { Certification } from '@/services/certifications'
import { updateCertification } from '@/services/certifications'
import { getConsultants, IsoUser } from '@/services/users'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getDocumentsByCertification } from '@/services/documents'
import { getTasksByCertification } from '@/services/tasks'
import { getSchedulesByCertification } from '@/services/schedules'

export function CertOverview({ cert }: { cert: Certification }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [consultants, setConsultants] = useState<IsoUser[]>([])
  const [counts, setCounts] = useState({ docs: 0, tasks: 0, schedules: 0 })

  useEffect(() => {
    getConsultants()
      .then(setConsultants)
      .catch(() => {})
    Promise.all([
      getDocumentsByCertification(cert.id),
      getTasksByCertification(cert.id),
      getSchedulesByCertification(cert.id),
    ]).then(([d, t, s]) => setCounts({ docs: d.length, tasks: t.length, schedules: s.length }))
  }, [cert.id])

  const canAssign = user?.role === 'admin' || user?.role === 'consultor'
  const consultantName = cert.expand?.consultant?.name

  const handleAssign = async (value: string) => {
    await updateCertification(cert.id, { consultant: value || undefined })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-400" />
              <span className="font-bold text-lg text-slate-900">
                {cert.company_name || 'Sua Empresa'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{cert.expand?.iso_type?.name || 'ISO'}</span>
              <Badge className={cert.status === 'concluído' ? 'bg-emerald-600' : 'bg-blue-600'}>
                {cert.status}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/relatorio-onboarding')}>
            <Printer className="h-4 w-4 mr-1.5" /> Relatório
          </Button>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 font-medium">Progresso Geral</span>
            <span className="text-slate-900 font-bold">{cert.progress || 0}%</span>
          </div>
          <Progress value={cert.progress || 0} className="h-2.5" />
        </div>

        {cert.start_date && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            Iniciado em {new Date(cert.start_date).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <FileText className="h-5 w-5 text-[#0055A4] mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900">{counts.docs}</p>
          <p className="text-xs text-slate-500">Documentos</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{counts.tasks}</p>
          <p className="text-xs text-slate-500">Tarefas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Calendar className="h-5 w-5 text-[#00A86B] mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900">{counts.schedules}</p>
          <p className="text-xs text-slate-500">Agendamentos</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <UserCog className="h-5 w-5 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Consultor Responsável</h3>
        </div>
        {canAssign ? (
          <Select defaultValue={cert.consultant || ''} onValueChange={handleAssign}>
            <SelectTrigger>
              <SelectValue placeholder="Atribuir consultor..." />
            </SelectTrigger>
            <SelectContent>
              {consultants.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-slate-600">{consultantName || 'Nenhum consultor atribuído'}</p>
        )}
      </div>
    </div>
  )
}
