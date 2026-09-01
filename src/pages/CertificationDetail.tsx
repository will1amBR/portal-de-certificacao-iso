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
  PenTool,
  Lock,
  BadgeCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getCertification, Certification } from '@/services/certifications'
import { getDocumentsByCertification, IsoDocument } from '@/services/documents'
import { getTasksByCertification, IsoTask } from '@/services/tasks'
import { getSchedulesByCertification, IsoSchedule } from '@/services/schedules'
import {
  getSignaturesByCertification,
  ReportSignature,
  SignatureRoleType,
} from '@/services/report_signatures'
import { getBusinessModel, BusinessModel } from '@/services/business_models'
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
import { DigitalSignatureModal } from '@/components/cert/DigitalSignatureModal'
import { toast } from 'sonner'

export default function CertificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cert, setCert] = useState<Certification | null>(null)
  const [docs, setDocs] = useState<IsoDocument[]>([])
  const [tasks, setTasks] = useState<IsoTask[]>([])
  const [schedules, setSchedules] = useState<IsoSchedule[]>([])
  const [signatures, setSignatures] = useState<ReportSignature[]>([])
  const [businessModel, setBusinessModel] = useState<BusinessModel | null>(null)
  const [loading, setLoading] = useState(true)

  // Controle de modal de assinatura digital
  const [sigModalOpen, setSigModalOpen] = useState(false)
  const [sigRoleType, setSigRoleType] = useState<SignatureRoleType>('rd_empresa')

  const load = async () => {
    if (!id) return
    try {
      const [c, d, t, s, sigs] = await Promise.all([
        getCertification(id),
        getDocumentsByCertification(id).catch(() => [] as IsoDocument[]),
        getTasksByCertification(id).catch(() => [] as IsoTask[]),
        getSchedulesByCertification(id).catch(() => [] as IsoSchedule[]),
        getSignaturesByCertification(id).catch(() => [] as ReportSignature[]),
      ])
      setCert(c)
      setDocs(d)
      setTasks(t)
      setSchedules(s)
      setSignatures(sigs)

      // Carregar modelo de negócio se disponível no usuário da certificação
      const bmId = c.expand?.user?.business_model
      if (bmId) {
        getBusinessModel(bmId)
          .then(setBusinessModel)
          .catch(() => {})
      }
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
  useRealtime('report_signatures', () => {
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

  const rdSignature = signatures.find((s) => s.role_type === 'rd_empresa')
  const auditorSignature = signatures.find((s) => s.role_type === 'auditor_lider')

  const isClient = user?.role === 'cliente'
  const isAuditorOrAdmin = user?.role === 'admin' || user?.role === 'consultor'

  const handleOpenSignature = (role: SignatureRoleType) => {
    setSigRoleType(role)
    setSigModalOpen(true)
  }

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
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{cert.company_name || cert.expand?.user?.name || 'Empresa'}</span>
              {businessModel && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {businessModel.name}
                </span>
              )}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <Badge className="bg-[#0055A4]">{cert.status}</Badge>

            {/* Ações de Assinatura Digital na Barra de Ações */}
            {isClient && (
              <Button
                variant={rdSignature ? 'secondary' : 'default'}
                size="sm"
                onClick={() => handleOpenSignature('rd_empresa')}
                className={
                  rdSignature
                    ? 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold'
                    : 'bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs font-semibold'
                }
              >
                <PenTool className="h-3.5 w-3.5 mr-1.5" />
                {rdSignature ? 'Assinatura RD (Registrada)' : 'Assinar Relatório (RD)'}
              </Button>
            )}

            {isAuditorOrAdmin && (
              <Button
                variant={auditorSignature ? 'secondary' : 'default'}
                size="sm"
                onClick={() => handleOpenSignature('auditor_lider')}
                className={
                  auditorSignature
                    ? 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold'
                }
              >
                <PenTool className="h-3.5 w-3.5 mr-1.5" />
                {auditorSignature
                  ? 'Assinatura Auditor (Registrada)'
                  : 'Assinar como Auditor Líder'}
              </Button>
            )}

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
                    CNPJ: cert.expand?.user?.cnpj || 'N/A',
                    'Modelo de Negócio': businessModel?.name || 'Geral',
                    Status: cert.status,
                    'Progresso (%)': `${cert.progress || 0}%`,
                    'Consultor / Auditor': cert.expand?.consultant?.name || 'Não atribuído',
                    Início: cert.start_date
                      ? new Date(cert.start_date).toLocaleDateString('pt-BR')
                      : 'N/A',
                    'Data de Cadastro': cert.created
                      ? new Date(cert.created).toLocaleDateString('pt-BR')
                      : 'N/A',
                    'Assinatura RD': rdSignature
                      ? `${rdSignature.signer_name} (${new Date(rdSignature.signed_at || rdSignature.created).toLocaleDateString('pt-BR')})`
                      : 'Pendente',
                    'Assinatura Auditor': auditorSignature
                      ? `${auditorSignature.signer_name} (${new Date(auditorSignature.signed_at || auditorSignature.created).toLocaleDateString('pt-BR')})`
                      : 'Pendente',
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

        {/* Card de Status das Assinaturas Digitais na Tela */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-[#0055A4]" />
              <span>Assinaturas Digitais e Aceites do Relatório Técnico</span>
            </div>
            <span className="text-xs text-slate-500">
              Homologação para emissão de PDF e envio a órgãos de acreditação (ALC / INMETRO)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bloco 1: RD da Empresa */}
            <div
              className={`p-3.5 rounded-lg border transition-all ${
                rdSignature
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-sky-700" />
                  Responsável pela Empresa (RD)
                </span>
                {rdSignature ? (
                  <Badge className="bg-emerald-600 text-white text-[10px] h-5">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Assinado
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-amber-700 border-amber-300 bg-amber-50 text-[10px] h-5"
                  >
                    Pendente
                  </Badge>
                )}
              </div>

              {rdSignature ? (
                <div className="space-y-1.5 text-xs">
                  <p className="font-semibold text-slate-900">{rdSignature.signer_name}</p>
                  <p className="text-slate-600 text-[11px]">
                    {rdSignature.signer_position || 'Representante da Direção'} • Doc:{' '}
                    {rdSignature.signer_document || cert.expand?.user?.cnpj || 'N/A'}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Aceite digital em:{' '}
                    {new Date(rdSignature.signed_at || rdSignature.created).toLocaleString('pt-BR')}
                  </p>
                  {rdSignature.acceptance_hash && (
                    <p className="text-[10px] font-mono text-emerald-800 truncate">
                      Hash: {rdSignature.acceptance_hash}
                    </p>
                  )}
                  {rdSignature.signature_image && (
                    <div className="mt-1 bg-white p-1 rounded border border-emerald-200 inline-block">
                      <img
                        src={rdSignature.signature_image}
                        alt="Rubrica RD"
                        className="h-8 max-w-full object-contain"
                      />
                    </div>
                  )}
                  {(isClient || isAuditorOrAdmin) && (
                    <div className="pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenSignature('rd_empresa')}
                        className="h-6 text-[11px] text-slate-600 hover:text-slate-900 px-2"
                      >
                        Ver detalhes / gerenciar
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Nenhum aceite registrado pelo Representante da Direção desta certificação.
                  </p>
                  {isClient ? (
                    <Button
                      size="sm"
                      onClick={() => handleOpenSignature('rd_empresa')}
                      className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs h-7"
                    >
                      <PenTool className="h-3 w-3 mr-1" /> Assinar Digitalmente
                    </Button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic block">
                      Aguardando assinatura do cliente (RD da empresa).
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bloco 2: Auditor Líder / ALC INMETRO */}
            <div
              className={`p-3.5 rounded-lg border transition-all ${
                auditorSignature
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  Auditor Líder / ALC INMETRO
                </span>
                {auditorSignature ? (
                  <Badge className="bg-emerald-600 text-white text-[10px] h-5">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Atestado
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-amber-700 border-amber-300 bg-amber-50 text-[10px] h-5"
                  >
                    Pendente
                  </Badge>
                )}
              </div>

              {auditorSignature ? (
                <div className="space-y-1.5 text-xs">
                  <p className="font-semibold text-slate-900">{auditorSignature.signer_name}</p>
                  <p className="text-slate-600 text-[11px]">
                    {auditorSignature.signer_position || 'Auditor Líder'} • Reg:{' '}
                    {auditorSignature.signer_document || 'INMETRO-ALC'}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Parecer técnico em:{' '}
                    {new Date(
                      auditorSignature.signed_at || auditorSignature.created,
                    ).toLocaleString('pt-BR')}
                  </p>
                  {auditorSignature.acceptance_hash && (
                    <p className="text-[10px] font-mono text-emerald-800 truncate">
                      Hash: {auditorSignature.acceptance_hash}
                    </p>
                  )}
                  {auditorSignature.signature_image && (
                    <div className="mt-1 bg-white p-1 rounded border border-emerald-200 inline-block">
                      <img
                        src={auditorSignature.signature_image}
                        alt="Rubrica Auditor"
                        className="h-8 max-w-full object-contain"
                      />
                    </div>
                  )}
                  {isAuditorOrAdmin && (
                    <div className="pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenSignature('auditor_lider')}
                        className="h-6 text-[11px] text-slate-600 hover:text-slate-900 px-2"
                      >
                        Ver detalhes / gerenciar
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Atestado técnico do Auditor Líder ainda não emitido.
                  </p>
                  {isAuditorOrAdmin ? (
                    <Button
                      size="sm"
                      onClick={() => handleOpenSignature('auditor_lider')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-7"
                    >
                      <PenTool className="h-3 w-3 mr-1" /> Atestar como Auditor
                    </Button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic block">
                      Aguardando homologação e assinatura do auditor técnico.
                    </span>
                  )}
                </div>
              )}
            </div>
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

      {/* Modal de Assinatura Digital / Aceite Eletrônico */}
      {user && (
        <DigitalSignatureModal
          open={sigModalOpen}
          onOpenChange={setSigModalOpen}
          certification={cert}
          currentUser={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            cnpj: (user as any).cnpj,
          }}
          roleType={sigRoleType}
          existingSignature={sigRoleType === 'rd_empresa' ? rdSignature : auditorSignature}
          onSignatureSaved={load}
        />
      )}

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
              {businessModel && (
                <span className="text-[10px] text-slate-500 block">
                  Modelo: {businessModel.name}
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

        {/* Bloco de Assinaturas Formais / Aceite Digital para Auditoria */}
        <div className="pt-6 mt-8 border-t-2 border-slate-300 space-y-4">
          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Termo de Homologação, Encerramento e Assinaturas Formais
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Validação de conformidade técnica nos termos dos requisitos INMETRO e ABNT
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center text-xs">
            {/* Bloco RD Empresa */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
              <div>
                {rdSignature?.signature_image ? (
                  <div className="mb-2">
                    <img
                      src={rdSignature.signature_image}
                      alt="Assinatura RD"
                      className="h-12 mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="border-t border-slate-700 w-56 mx-auto my-6"></div>
                )}
                <p className="font-bold text-slate-900 text-sm">
                  {rdSignature?.signer_name || 'Responsável da Empresa / RD'}
                </p>
                <p className="text-slate-600 text-xs">
                  {rdSignature?.signer_position || 'Representante da Direção (RD)'}
                </p>
                {rdSignature?.signer_document && (
                  <p className="text-[10px] text-slate-500">Doc: {rdSignature.signer_document}</p>
                )}
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px]">
                {rdSignature ? (
                  <div className="text-emerald-700 font-medium space-y-0.5">
                    <p>
                      ✓ Assinado digitalmente em{' '}
                      {new Date(rdSignature.signed_at || rdSignature.created).toLocaleString(
                        'pt-BR',
                      )}
                    </p>
                    {rdSignature.acceptance_hash && (
                      <p className="font-mono text-[9px] text-slate-500">
                        Hash: {rdSignature.acceptance_hash}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">Carimbo e Assinatura Física / Digital</p>
                )}
              </div>
            </div>

            {/* Bloco Auditor Líder */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
              <div>
                {auditorSignature?.signature_image ? (
                  <div className="mb-2">
                    <img
                      src={auditorSignature.signature_image}
                      alt="Assinatura Auditor Líder"
                      className="h-12 mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="border-t border-slate-700 w-56 mx-auto my-6"></div>
                )}
                <p className="font-bold text-slate-900 text-sm">
                  {auditorSignature?.signer_name || 'Auditor Líder / ALC INMETRO'}
                </p>
                <p className="text-slate-600 text-xs">
                  {auditorSignature?.signer_position || 'Acreditação Técnica INMETRO'}
                </p>
                {auditorSignature?.signer_document && (
                  <p className="text-[10px] text-slate-500">
                    Reg: {auditorSignature.signer_document}
                  </p>
                )}
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px]">
                {auditorSignature ? (
                  <div className="text-emerald-700 font-medium space-y-0.5">
                    <p>
                      ✓ Atestado e assinado digitalmente em{' '}
                      {new Date(
                        auditorSignature.signed_at || auditorSignature.created,
                      ).toLocaleString('pt-BR')}
                    </p>
                    {auditorSignature.acceptance_hash && (
                      <p className="font-mono text-[9px] text-slate-500">
                        Hash: {auditorSignature.acceptance_hash}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">Reg. Auditor / Assinatura Digital</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center pt-4 border-t border-slate-100 flex items-center justify-between">
          <span>Portal de Certificação ISO • Sistema de Gestão e Conformidade</span>
          <span>Dossiê individual emitido para comprovação técnica e auditoria externa</span>
        </div>
      </div>
    </div>
  )
}
