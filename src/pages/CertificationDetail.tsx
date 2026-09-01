import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ShieldCheck,
  Leaf,
  HeartPulse,
  FileDown,
  LayoutGrid,
  FileSpreadsheet,
  Printer,
  FileText,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Building2,
  UserCheck,
  CheckSquare,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getCertification, Certification } from '@/services/certifications'
import { getDocumentsByCertification, IsoDocument } from '@/services/documents'
import { getTasksByCertification, IsoTask } from '@/services/tasks'
import { getSchedulesByCertification, IsoSchedule } from '@/services/schedules'
import { exportToCsv } from '@/lib/export'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CertOverview } from '@/components/cert/CertOverview'
import { CertDocuments } from '@/components/cert/CertDocuments'
import { CertTasks } from '@/components/cert/CertTasks'
import { CertSchedules } from '@/components/cert/CertSchedules'
import { CertMessages } from '@/components/cert/CertMessages'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export default function CertificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cert, setCert] = useState<Certification | null>(null)
  const [docs, setDocs] = useState<IsoDocument[]>([])
  const [tasks, setTasks] = useState<IsoTask[]>([])
  const [schedules, setSchedules] = useState<IsoSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!id) return
    try {
      const [c, d, t, s] = await Promise.all([
        getCertification(id),
        getDocumentsByCertification(id).catch(() => [] as IsoDocument[]),
        getTasksByCertification(id).catch(() => [] as IsoTask[]),
        getSchedulesByCertification(id).catch(() => [] as IsoSchedule[]),
      ])
      setCert(c)
      setDocs(d)
      setTasks(t)
      setSchedules(s)
    } catch {
      navigate('/certificacoes')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])

  useRealtime('certifications', () => {
    load()
  })
  useRealtime('documents', () => {
    load()
  })
  useRealtime('tasks', () => {
    load()
  })
  useRealtime('schedules', () => {
    load()
  })

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  if (!cert) return null

  const code = cert.expand?.iso_type?.code
  const Icon = code === '14001' ? Leaf : code === '45001' ? HeartPulse : ShieldCheck
  const iconColor =
    code === '14001' ? 'text-emerald-600' : code === '45001' ? 'text-rose-600' : 'text-sky-700'

  const completedTasksCount = tasks.filter((t) => t.completed).length
  const approvedDocsCount = docs.filter((d) => d.status === 'aprovado').length

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top action bar (hidden on print) */}
      <div className="print:hidden space-y-4">
        <button
          type="button"
          onClick={() => navigate('/certificacoes')}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar para certificações
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-3 rounded-xl bg-slate-100">
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {cert.expand?.iso_type?.name || 'Certificação'}
            </h1>
            <p className="text-sm text-slate-500">{cert.company_name || 'Empresa'}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <Badge className="bg-[#0055A4]">{cert.status}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10)
                exportToCsv(`certificacao-${cert.expand?.iso_type?.code || 'iso'}-${today}.csv`, [
                  {
                    'Código ISO': cert.expand?.iso_type?.code || 'N/A',
                    Norma: cert.expand?.iso_type?.name || 'Certificação ISO',
                    Empresa: cert.company_name || cert.expand?.user?.name || 'N/A',
                    Status: cert.status,
                    'Progresso (%)': `${cert.progress || 0}%`,
                    'Consultor / Auditor': cert.expand?.consultant?.name || 'Não atribuído',
                    Início: cert.start_date
                      ? new Date(cert.start_date).toLocaleDateString('pt-BR')
                      : 'N/A',
                    'Data de Cadastro': cert.created
                      ? new Date(cert.created).toLocaleDateString('pt-BR')
                      : 'N/A',
                    'Órgão Regulador': 'ALC / INMETRO',
                  },
                ])
                toast.success('Dados exportados para CSV com sucesso!')
              }}
            >
              <FileSpreadsheet className="h-4 w-4 mr-1 text-emerald-600" /> CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white font-semibold shadow-xs"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Imprimir / Relatório Completo PDF
            </Button>
            <Link to="/relatorio-onboarding">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-1" /> Relatório Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs interativas da tela */}
      <Tabs defaultValue="pipes" className="print:hidden">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger
            value="pipes"
            className="font-semibold text-blue-700 data-[state=active]:bg-blue-50"
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Pipes & Fluxos
          </TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="schedules">Agenda</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>
        <TabsContent value="pipes" className="mt-4">
          <PipesGrid certId={cert.id} />
        </TabsContent>
        <TabsContent value="overview" className="mt-4">
          <CertOverview cert={cert} />
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <CertDocuments certId={cert.id} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <CertTasks certId={cert.id} />
        </TabsContent>
        <TabsContent value="schedules" className="mt-4">
          <CertSchedules certId={cert.id} />
        </TabsContent>
        <TabsContent value="messages" className="mt-4">
          <CertMessages certId={cert.id} />
        </TabsContent>
      </Tabs>

      {/* RELATÓRIO COMPLETO DE AUDITORIA DA CERTIFICAÇÃO INDIVIDUAL (EXCLUSIVO PARA IMPRESSÃO / PDF) */}
      <div className="hidden print:block space-y-6">
        {/* Cabeçalho Oficial do Relatório */}
        <div className="border-b-2 border-[#003B73] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#003B73] text-white font-black text-2xl tracking-wider">
                ISO
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  Relatório Individual de Auditoria & Conformidade ISO
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dossiê Completo de Certificação • Órgãos Reguladores: ALC Certificadora / INMETRO
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-0.5 bg-slate-50 p-2.5 rounded border border-slate-200">
              <p>
                <strong>Emissão:</strong> {new Date().toLocaleString('pt-BR')}
              </p>
              <p>
                <strong>Emitido por:</strong> {user?.name || user?.email || 'Auditor Técnico'}
              </p>
              <p>
                <strong>Ref. Certificação:</strong> {cert.expand?.iso_type?.code || cert.id}
              </p>
            </div>
          </div>
        </div>

        {/* Informações Gerais da Certificação */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">
                Empresa / Razão Social
              </span>
              <strong className="text-slate-900 text-sm">
                {cert.company_name || cert.expand?.user?.name || 'Sua Empresa'}
              </strong>
              {cert.expand?.user?.cnpj && (
                <span className="text-[10px] text-slate-500 block">
                  CNPJ: {cert.expand.user.cnpj}
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Norma Aplicada</span>
              <strong className="text-slate-900 text-sm">
                {cert.expand?.iso_type?.name || `ISO ${cert.expand?.iso_type?.code || ''}`}
              </strong>
              <span className="text-[10px] text-slate-500 block">
                Código: ISO {cert.expand?.iso_type?.code || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">
                Status da Auditoria
              </span>
              <span className="font-bold text-slate-900 capitalize text-sm">{cert.status}</span>
              <span className="text-[10px] text-slate-500 block">
                Progresso: <strong>{cert.progress || 0}%</strong>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">
                Auditor / Consultor Responsável
              </span>
              <strong className="text-slate-900 text-sm">
                {cert.expand?.consultant?.name || 'Não atribuído'}
              </strong>
              <span className="text-[10px] text-slate-500 block">ALC Certificadora / INMETRO</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              <strong>Data de Início dos Trabalhos:</strong>{' '}
              {cert.start_date
                ? new Date(cert.start_date).toLocaleDateString('pt-BR')
                : new Date(cert.created).toLocaleDateString('pt-BR')}
            </span>
            <span>
              <strong>Resumo de Conformidade:</strong> {approvedDocsCount}/{docs.length} Docs
              Aprovados • {completedTasksCount}/{tasks.length} Tarefas Concluídas •{' '}
              {schedules.length} Agendamentos
            </span>
          </div>
        </div>

        {/* Seção 1: Documentos & Evidências da Certificação */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#0055A4]" />
              1. Documentação Técnica e Evidências ({docs.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Aprovados: {approvedDocsCount} | Pendentes/Em Análise:{' '}
              {docs.filter((d) => d.status !== 'aprovado').length}
            </span>
          </div>

          {docs.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              Nenhum documento registrado para esta certificação.
            </p>
          ) : (
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold text-[11px]">
                  <th className="p-2 border-r border-slate-300">Documento / Evidência</th>
                  <th className="p-2 border-r border-slate-300">Categoria</th>
                  <th className="p-2 border-r border-slate-300">Obrigatório</th>
                  <th className="p-2 border-r border-slate-300">Status</th>
                  <th className="p-2 border-r border-slate-300">Data de Envio</th>
                  <th className="p-2">Parecer / Observação do Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {docs.map((doc) => (
                  <tr key={doc.id} className="text-slate-800">
                    <td className="p-2 font-medium border-r border-slate-200">{doc.name}</td>
                    <td className="p-2 capitalize border-r border-slate-200 text-slate-600">
                      {doc.category || 'Geral'}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-semibold">
                      {doc.required ? 'Sim' : 'Não'}
                    </td>
                    <td className="p-2 capitalize font-semibold border-r border-slate-200">
                      <span
                        className={
                          doc.status === 'aprovado'
                            ? 'text-emerald-700'
                            : doc.status === 'rejeitado'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                        }
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-slate-600">
                      {new Date(doc.created).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-2 text-slate-600 italic">{doc.comment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Seção 2: Tarefas e Ações Corretivas / Preventivas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-[#00A86B]" />
              2. Plano de Ação, Tarefas e Requisitos ({tasks.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Concluídas: {completedTasksCount} | Pendentes: {tasks.length - completedTasksCount}
            </span>
          </div>

          {tasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              Nenhuma tarefa cadastrada para esta certificação.
            </p>
          ) : (
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold text-[11px]">
                  <th className="p-2 border-r border-slate-300">Tarefa / Requisito</th>
                  <th className="p-2 border-r border-slate-300">Descrição / Escopo</th>
                  <th className="p-2 border-r border-slate-300 text-center">Status</th>
                  <th className="p-2">Prazo de Conclusão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="text-slate-800">
                    <td className="p-2 font-medium border-r border-slate-200">{task.title}</td>
                    <td className="p-2 text-slate-600 border-r border-slate-200">
                      {task.description || '-'}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-semibold">
                      {task.completed ? (
                        <span className="text-emerald-700 font-bold">Concluída</span>
                      ) : (
                        <span className="text-amber-700">Em Aberto</span>
                      )}
                    </td>
                    <td className="p-2 text-slate-600">
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString('pt-BR')
                        : 'Não estipulado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Seção 3: Cronograma de Auditorias e Reuniões */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-purple-600" />
              3. Cronograma de Auditorias e Alinhamentos ({schedules.length})
            </h2>
          </div>

          {schedules.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              Nenhum agendamento registrado para esta certificação.
            </p>
          ) : (
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold text-[11px]">
                  <th className="p-2 border-r border-slate-300">Tipo de Compromisso</th>
                  <th className="p-2 border-r border-slate-300">Data & Hora</th>
                  <th className="p-2 border-r border-slate-300">Status</th>
                  <th className="p-2">Pauta / Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schedules.map((sched) => (
                  <tr key={sched.id} className="text-slate-800">
                    <td className="p-2 font-medium capitalize border-r border-slate-200">
                      {sched.type === 'auditoria' ? 'Auditoria de Conformidade' : 'Reunião Técnica'}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      {new Date(sched.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(sched.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-2 capitalize font-semibold border-r border-slate-200">
                      {sched.status}
                    </td>
                    <td className="p-2 text-slate-600">{sched.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bloco de Assinaturas Formais para Auditoria */}
        <div className="pt-8 mt-10 border-t border-slate-300 grid grid-cols-2 gap-12 text-center text-xs">
          <div>
            <div className="border-t border-slate-700 w-64 mx-auto mb-2"></div>
            <p className="font-bold text-slate-900 text-sm">Responsável da Empresa / RD</p>
            <p className="text-slate-600 text-xs">Representante da Direção (RD)</p>
            <p className="text-slate-400 text-[10px] mt-1">Carimbo e Assinatura</p>
          </div>
          <div>
            <div className="border-t border-slate-700 w-64 mx-auto mb-2"></div>
            <p className="font-bold text-slate-900 text-sm">
              Auditor Líder / ALC Acreditação INMETRO
            </p>
            <p className="text-slate-600 text-xs">Acreditação Técnica INMETRO</p>
            <p className="text-slate-400 text-[10px] mt-1">Reg. Auditor / Assinatura Digital</p>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center pt-6 border-t border-slate-100 flex items-center justify-between">
          <span>Portal de Certificação ISO • Sistema de Gestão e Conformidade</span>
          <span>Dossiê individual emitido para comprovação técnica e auditoria externa</span>
        </div>
      </div>
    </div>
  )
}
