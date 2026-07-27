import { Link } from 'react-router-dom'
import { ShieldCheck, Leaf, HeartPulse, ChevronRight, Calendar } from 'lucide-react'
import { Certification } from '@/services/certifications'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface CertificationCardProps {
  cert: Certification
}

export function CertificationCard({ cert }: CertificationCardProps) {
  const code = cert.expand?.iso_type?.code || '9001'
  const isoName = cert.expand?.iso_type?.name || `ISO ${code}`

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluído':
        return <Badge className="bg-emerald-600 text-white">Concluído</Badge>
      case 'em andamento':
        return <Badge className="bg-blue-600 text-white">Em Andamento</Badge>
      case 'pendente de documentos':
        return <Badge className="bg-amber-600 text-white">Pendente Documentos</Badge>
      case 'aguardando auditoria':
        return <Badge className="bg-purple-600 text-white">Aguardando Auditoria</Badge>
      default:
        return <Badge variant="secondary">Não Iniciado</Badge>
    }
  }

  const renderIcon = () => {
    if (code === '14001') return <Leaf className="h-6 w-6 text-emerald-600" />
    if (code === '45001') return <HeartPulse className="h-6 w-6 text-rose-600" />
    return <ShieldCheck className="h-6 w-6 text-sky-700" />
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-100 flex items-center justify-center">
              {renderIcon()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{isoName}</h3>
              <p className="text-xs text-slate-500">{cert.company_name || 'Sua Empresa'}</p>
            </div>
          </div>
          {getStatusBadge(cert.status)}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Progresso Geral</span>
            <span>{cert.progress || 0}%</span>
          </div>
          <Progress value={cert.progress || 0} className="h-2 bg-slate-100" />
        </div>

        {cert.start_date && (
          <div className="mt-4 flex items-center text-xs text-slate-500 gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Iniciado em: {new Date(cert.start_date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
        <Link
          to={`/certificacoes/${cert.id}`}
          className="inline-flex items-center text-sm font-semibold text-[#0055A4] hover:text-[#1A73E8] gap-1 transition-colors"
        >
          Acessar Detalhes
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
