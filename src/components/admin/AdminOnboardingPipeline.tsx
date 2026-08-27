import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Send,
  Calendar,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Sparkles,
  PhoneCall,
  Mail,
  FileCheck2,
  ExternalLink,
} from 'lucide-react'
import { getAllUsers, getConsultants, updateUser, IsoUser } from '@/services/users'
import { getCertifications, updateCertification, Certification } from '@/services/certifications'
import { getBusinessModels, BusinessModel } from '@/services/business_models'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'

export type OnboardingStage =
  | 'cadastrado' // Registrado, sem CNPJ
  | 'onboarding_iniciado' // Preencheu CNPJ, mas sem modelo
  | 'onboarding_completo' // CNPJ + Modelo preenchidos, sem certificação
  | 'certificacao_iniciada' // Possui pelo menos 1 certificação vinculada

export interface EnrichedClient {
  user: IsoUser
  stage: OnboardingStage
  businessModelName: string
  certifications: Certification[]
  createdAt: Date
  daysInStage: number
  primaryConsultant?: IsoUser
}

export function AdminOnboardingPipeline() {
  const [users, setUsers] = useState<IsoUser[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [models, setModels] = useState<BusinessModel[]>([])
  const [consultants, setConsultants] = useState<IsoUser[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [modelFilter, setModelFilter] = useState<string>('all')

  // Modals for Quick Actions
  const [assignModalUser, setAssignModalUser] = useState<EnrichedClient | null>(null)
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>('')
  const [assigning, setAssigning] = useState(false)

  const [messageModalUser, setMessageModalUser] = useState<EnrichedClient | null>(null)
  const [messageSubject, setMessageSubject] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const loadData = async () => {
    try {
      const [u, c, m, cons] = await Promise.all([
        getAllUsers(),
        getCertifications(),
        getBusinessModels(),
        getConsultants(),
      ])
      setUsers(u)
      setCerts(c)
      setModels(m)
      setConsultants(cons)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('users', () => loadData())
  useRealtime('certifications', () => loadData())

  const clientsData: EnrichedClient[] = useMemo(() => {
    // Only clients (role === 'cliente' or users without special admin/consultor roles)
    const clientUsers = users.filter((u) => u.role === 'cliente')

    const now = new Date().getTime()

    return clientUsers.map((u) => {
      const uCerts = certs.filter((c) => c.user === u.id)
      const bm = models.find((m) => m.id === u.business_model)
      const createdDate = new Date(u.created || Date.now())
      const days = Math.max(0, Math.floor((now - createdDate.getTime()) / (1000 * 60 * 60 * 24)))

      let stage: OnboardingStage = 'cadastrado'
      if (uCerts.length > 0) {
        stage = 'certificacao_iniciada'
      } else if (u.cnpj && u.business_model) {
        stage = 'onboarding_completo'
      } else if (u.cnpj && !u.business_model) {
        stage = 'onboarding_iniciado'
      } else {
        stage = 'cadastrado'
      }

      // Identify primary consultant from certs if available
      let primaryConsultant: IsoUser | undefined
      const certWithConsultant = uCerts.find((c) => c.consultant)
      if (certWithConsultant?.consultant) {
        primaryConsultant = consultants.find((c) => c.id === certWithConsultant.consultant)
      }

      return {
        user: u,
        stage,
        businessModelName: bm?.name || (u.business_model ? 'Personalizado' : 'Não definido'),
        certifications: uCerts,
        createdAt: createdDate,
        daysInStage: days,
        primaryConsultant,
      }
    })
  }, [users, certs, models, consultants])

  // Funnel Counts
  const funnel = useMemo(() => {
    const cadastrados = clientsData.filter((c) => c.stage === 'cadastrado')
    const onboardingIniciado = clientsData.filter((c) => c.stage === 'onboarding_iniciado')
    const onboardingCompleto = clientsData.filter((c) => c.stage === 'onboarding_completo')
    const certificacaoIniciada = clientsData.filter((c) => c.stage === 'certificacao_iniciada')

    const total = clientsData.length
    // Conversion rate from registered to completed onboarding or cert started
    const completedOrBeyond = onboardingCompleto.length + certificacaoIniciada.length
    const conversionRate = total > 0 ? Math.round((completedOrBeyond / total) * 100) : 0

    // Average days in pipeline
    const avgDays =
      total > 0 ? Math.round(clientsData.reduce((acc, c) => acc + c.daysInStage, 0) / total) : 0

    return {
      cadastrados: cadastrados.length,
      onboardingIniciado: onboardingIniciado.length,
      onboardingCompleto: onboardingCompleto.length,
      certificacaoIniciada: certificacaoIniciada.length,
      total,
      conversionRate,
      avgDays,
    }
  }, [clientsData])

  // Filtered List
  const filteredClients = useMemo(() => {
    return clientsData.filter((c) => {
      // Stage filter
      if (stageFilter !== 'all' && c.stage !== stageFilter) return false

      // Model filter
      if (modelFilter !== 'all' && c.user.business_model !== modelFilter) return false

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const nameMatch = c.user.name?.toLowerCase().includes(q)
        const emailMatch = c.user.email?.toLowerCase().includes(q)
        const cnpjMatch = c.user.cnpj?.includes(q)
        const modelMatch = c.businessModelName?.toLowerCase().includes(q)
        if (!nameMatch && !emailMatch && !cnpjMatch && !modelMatch) return false
      }

      return true
    })
  }, [clientsData, stageFilter, modelFilter, search])

  // Handle Assign Consultant
  const handleAssignConsultant = async () => {
    if (!assignModalUser || !selectedConsultantId) return
    setAssigning(true)
    try {
      // Update any existing certifications for this user, or if none, create notification
      const userCerts = certs.filter((c) => c.user === assignModalUser.user.id)
      if (userCerts.length > 0) {
        for (const cert of userCerts) {
          await updateCertification(cert.id, { consultant: selectedConsultantId })
        }
      }

      // Notify the client
      const selectedCons = consultants.find((c) => c.id === selectedConsultantId)
      await pb.collection('notifications').create({
        user: assignModalUser.user.id,
        type: 'task_assigned',
        title: 'Consultor Atribuído',
        message: `O consultor ${selectedCons?.name || 'especialista'} foi vinculado para apoiar sua empresa na certificação ISO.`,
        is_read: false,
      })

      toast.success(
        `Consultor ${selectedCons?.name || ''} atribuído com sucesso para ${assignModalUser.user.name}!`,
      )
      setAssignModalUser(null)
      loadData()
    } catch (err: any) {
      toast.error('Erro ao atribuir consultor: ' + (err?.message || 'Tente novamente'))
    } finally {
      setAssigning(false)
    }
  }

  // Handle Send Welcome / Followup Message
  const handleSendMessage = async () => {
    if (!messageModalUser || !messageBody.trim()) return
    setSendingMessage(true)
    try {
      // Create notification for the user
      await pb.collection('notifications').create({
        user: messageModalUser.user.id,
        type: 'message_received',
        title: messageSubject.trim() || 'Mensagem da Equipe de Certificação',
        message: messageBody.trim(),
        is_read: false,
      })

      // If client has active certification, also add to messages collection
      if (messageModalUser.certifications.length > 0) {
        const certId = messageModalUser.certifications[0].id
        await pb.collection('messages').create({
          certification: certId,
          sender: pb.authStore.record?.id,
          content: `${messageSubject ? `[${messageSubject}] ` : ''}${messageBody}`,
          is_read: false,
        })
      }

      toast.success(`Mensagem enviada com sucesso para ${messageModalUser.user.name}!`)
      setMessageModalUser(null)
      setMessageSubject('')
      setMessageBody('')
    } catch (err: any) {
      toast.error('Erro ao enviar mensagem: ' + (err?.message || 'Tente novamente'))
    } finally {
      setSendingMessage(false)
    }
  }

  const openWelcomeModal = (client: EnrichedClient) => {
    setMessageModalUser(client)
    setMessageSubject(`Boas-vindas ao Portal de Certificação ISO`)
    setMessageBody(
      `Olá ${client.user.name || 'Empresa'},\n\nSeja bem-vindo(a) ao Portal de Certificação ISO! Nossa equipe de especialistas está pronta para orientar sua empresa em cada etapa do processo de adequação e auditoria.\n\nFicamos à disposição para esclarecer qualquer dúvida.`,
    )
  }

  const openFollowupModal = (client: EnrichedClient) => {
    setMessageModalUser(client)
    setMessageSubject(`Apoio no Onboarding da sua Empresa`)
    setMessageBody(
      `Olá ${client.user.name || 'Empresa'},\n\nNotamos que você iniciou o cadastro no Portal ISO. Gostaria de auxílio para finalizar a seleção do modelo de negócio ou iniciar sua primeira certificação?\n\nNossa consultoria especializada está à disposição para acelerar seu processo.`,
    )
  }

  const getStageBadge = (stage: OnboardingStage) => {
    switch (stage) {
      case 'cadastrado':
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-300 gap-1 font-medium"
          >
            <Clock className="h-3 w-3 text-slate-500" />
            1. Cadastrado
          </Badge>
        )
      case 'onboarding_iniciado':
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-300 gap-1 font-medium"
          >
            <AlertCircle className="h-3 w-3 text-amber-500" />
            2. CNPJ Preenchido
          </Badge>
        )
      case 'onboarding_completo':
        return (
          <Badge
            variant="outline"
            className="bg-sky-50 text-sky-700 border-sky-300 gap-1 font-medium"
          >
            <Sparkles className="h-3 w-3 text-sky-600" />
            3. Onboarding Completo
          </Badge>
        )
      case 'certificacao_iniciada':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-300 gap-1 font-medium"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            4. Certificação Ativa
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Funnel Highlights */}
      <div className="bg-gradient-to-r from-[#003B73] via-[#0055A4] to-[#007ACC] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-2 text-xs font-semibold text-blue-100">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300" /> Pipeline de Conversão &
              Aquisição
            </div>
            <h2 className="text-2xl font-bold">Funil de Onboarding de Novos Clientes</h2>
            <p className="text-sm text-blue-100 mt-1">
              Acompanhe a jornada de contratação de cada empresa, desde a criação da conta até a
              certificação ativa.
            </p>
          </div>
          <div className="flex gap-4 self-start md:self-auto bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-center px-2">
              <span className="text-2xl font-black text-emerald-300">{funnel.conversionRate}%</span>
              <p className="text-[11px] text-blue-100">Taxa de Conclusão</p>
            </div>
            <div className="h-8 w-px bg-white/20 self-center" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-white">{funnel.total}</span>
              <p className="text-[11px] text-blue-100">Clientes Totais</p>
            </div>
            <div className="h-8 w-px bg-white/20 self-center" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-amber-200">{funnel.avgDays}d</span>
              <p className="text-[11px] text-blue-100">Tempo Médio</p>
            </div>
          </div>
        </div>

        {/* Funnel Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {/* Step 1 */}
          <div
            onClick={() => setStageFilter(stageFilter === 'cadastrado' ? 'all' : 'cadastrado')}
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              stageFilter === 'cadastrado'
                ? 'bg-white text-slate-900 border-white ring-2 ring-emerald-400 shadow-md'
                : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Etapa 1
              </span>
              <Users
                className={`h-4 w-4 ${stageFilter === 'cadastrado' ? 'text-[#0055A4]' : 'text-blue-200'}`}
              />
            </div>
            <p className="text-2xl font-black mt-2">{funnel.cadastrados}</p>
            <p className="text-xs font-medium mt-1">
              Cadastrados{' '}
              <span className="opacity-75 block text-[11px]">Apenas criaram a conta</span>
            </p>
          </div>

          {/* Step 2 */}
          <div
            onClick={() =>
              setStageFilter(stageFilter === 'onboarding_iniciado' ? 'all' : 'onboarding_iniciado')
            }
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              stageFilter === 'onboarding_iniciado'
                ? 'bg-white text-slate-900 border-white ring-2 ring-emerald-400 shadow-md'
                : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Etapa 2
              </span>
              <AlertCircle
                className={`h-4 w-4 ${stageFilter === 'onboarding_iniciado' ? 'text-amber-600' : 'text-amber-300'}`}
              />
            </div>
            <p className="text-2xl font-black mt-2">{funnel.onboardingIniciado}</p>
            <p className="text-xs font-medium mt-1">
              CNPJ Preenchido{' '}
              <span className="opacity-75 block text-[11px]">Falta escolher modelo</span>
            </p>
          </div>

          {/* Step 3 */}
          <div
            onClick={() =>
              setStageFilter(stageFilter === 'onboarding_completo' ? 'all' : 'onboarding_completo')
            }
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              stageFilter === 'onboarding_completo'
                ? 'bg-white text-slate-900 border-white ring-2 ring-emerald-400 shadow-md'
                : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Etapa 3
              </span>
              <Sparkles
                className={`h-4 w-4 ${stageFilter === 'onboarding_completo' ? 'text-sky-600' : 'text-sky-300'}`}
              />
            </div>
            <p className="text-2xl font-black mt-2">{funnel.onboardingCompleto}</p>
            <p className="text-xs font-medium mt-1">
              Onboarding Completo{' '}
              <span className="opacity-75 block text-[11px]">Templates gerados</span>
            </p>
          </div>

          {/* Step 4 */}
          <div
            onClick={() =>
              setStageFilter(
                stageFilter === 'certificacao_iniciada' ? 'all' : 'certificacao_iniciada',
              )
            }
            className={`cursor-pointer rounded-xl p-4 transition-all border ${
              stageFilter === 'certificacao_iniciada'
                ? 'bg-white text-slate-900 border-white ring-2 ring-emerald-400 shadow-md'
                : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Etapa 4
              </span>
              <CheckCircle2
                className={`h-4 w-4 ${stageFilter === 'certificacao_iniciada' ? 'text-emerald-600' : 'text-emerald-300'}`}
              />
            </div>
            <p className="text-2xl font-black mt-2">{funnel.certificacaoIniciada}</p>
            <p className="text-xs font-medium mt-1">
              Certificação Ativa{' '}
              <span className="opacity-75 block text-[11px]">Processo ISO em curso</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por nome, email ou CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[190px]">
                <Filter className="h-3.5 w-3.5 mr-2 text-slate-500" />
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas ({clientsData.length})</SelectItem>
                <SelectItem value="cadastrado">1. Cadastrados ({funnel.cadastrados})</SelectItem>
                <SelectItem value="onboarding_iniciado">
                  2. CNPJ Preenchido ({funnel.onboardingIniciado})
                </SelectItem>
                <SelectItem value="onboarding_completo">
                  3. Onboarding Completo ({funnel.onboardingCompleto})
                </SelectItem>
                <SelectItem value="certificacao_iniciada">
                  4. Certificação Ativa ({funnel.certificacaoIniciada})
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-[180px]">
                <Building2 className="h-3.5 w-3.5 mr-2 text-slate-500" />
                <SelectValue placeholder="Modelo de Negócio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os modelos</SelectItem>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(stageFilter !== 'all' || modelFilter !== 'all' || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStageFilter('all')
                  setModelFilter('all')
                  setSearch('')
                }}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clients Table / Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Mostrando {filteredClients.length} de {clientsData.length} clientes
          </span>
          <span>Dica: use as ações rápidas para atribuir consultores ou contatar clientes</span>
        </div>

        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              <Users className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-700">
                Nenhum cliente encontrado com os filtros atuais.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Tente ajustar a busca ou limpar os filtros.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => {
            const hasCerts = client.certifications.length > 0
            const cnpjFormatted = client.user.cnpj
              ? client.user.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
              : 'Não informado'

            return (
              <Card
                key={client.user.id}
                className="hover:border-slate-300 transition-all shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 border border-slate-200 text-sm">
                        {client.user.name ? client.user.name.slice(0, 2).toUpperCase() : 'EM'}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-slate-900 truncate">
                            {client.user.name || 'Empresa sem nome'}
                          </h3>
                          {getStageBadge(client.stage)}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {client.user.email}
                          </span>
                          <span>
                            <strong>CNPJ:</strong> {cnpjFormatted}
                          </span>
                          <span>
                            <strong>Modelo:</strong> {client.businessModelName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            Cadastrado em: {client.createdAt.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Certifications & Consultant status */}
                    <div className="flex flex-wrap items-center gap-2 lg:justify-center">
                      {hasCerts ? (
                        client.certifications.map((c) => (
                          <Link key={c.id} to={`/certificacoes/${c.id}`}>
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-sky-50 hover:border-sky-300 text-xs py-1 px-2.5 transition-colors gap-1.5"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-[#0055A4]" />
                              {c.expand?.iso_type?.name || 'Certificação'}
                              <span className="text-[10px] bg-slate-100 rounded px-1 text-slate-600 font-semibold">
                                {c.progress || 0}%
                              </span>
                            </Badge>
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic bg-slate-50 px-2.5 py-1 rounded-md border border-dashed border-slate-200">
                          Nenhuma certificação iniciada
                        </span>
                      )}

                      {client.primaryConsultant && (
                        <Badge
                          variant="secondary"
                          className="text-xs gap-1 bg-emerald-50 text-emerald-800 border-emerald-200"
                        >
                          <UserCheck className="h-3 w-3 text-emerald-600" />
                          Consultor: {client.primaryConsultant.name}
                        </Badge>
                      )}
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAssignModalUser(client)
                          setSelectedConsultantId(
                            client.primaryConsultant?.id || consultants[0]?.id || '',
                          )
                        }}
                        className="text-xs font-medium border-slate-200 hover:bg-slate-50 whitespace-nowrap min-h-[36px]"
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1 text-[#0055A4] shrink-0" />
                        {client.primaryConsultant ? 'Alterar Consultor' : 'Atribuir Consultor'}
                      </Button>

                      {client.stage === 'cadastrado' || client.stage === 'onboarding_iniciado' ? (
                        <Button
                          size="sm"
                          onClick={() => openFollowupModal(client)}
                          className="text-xs font-medium bg-[#0055A4] hover:bg-[#1A73E8] text-white whitespace-nowrap min-h-[36px]"
                        >
                          <Send className="h-3.5 w-3.5 mr-1 shrink-0" />
                          Fazer Follow-up
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => openWelcomeModal(client)}
                          className="text-xs font-medium bg-[#00A86B] hover:bg-emerald-600 text-white whitespace-nowrap min-h-[36px]"
                        >
                          <Mail className="h-3.5 w-3.5 mr-1 shrink-0" />
                          Enviar Boas-vindas
                        </Button>
                      )}

                      {hasCerts && (
                        <Link to={`/certificacoes/${client.certifications[0].id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100"
                            title="Ver certificação"
                          >
                            <ExternalLink className="h-4 w-4 text-slate-500 hover:text-slate-900" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* MODAL: Atribuir Consultor */}
      <Dialog open={!!assignModalUser} onOpenChange={(open) => !open && setAssignModalUser(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#0055A4]" />
              Atribuir Consultor Especialista
            </DialogTitle>
            <DialogDescription>
              Vincule um auditor ou consultor da ALC Certificadora para acompanhar{' '}
              <strong className="text-slate-900">{assignModalUser?.user.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-200">
              <p>
                <strong>Cliente:</strong> {assignModalUser?.user.name} (
                {assignModalUser?.user.email})
              </p>
              <p>
                <strong>Modelo:</strong> {assignModalUser?.businessModelName}
              </p>
              <p>
                <strong>Certificações ativas:</strong> {assignModalUser?.certifications.length || 0}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultantSelect">Selecione o Consultor Responsável</Label>
              <Select value={selectedConsultantId} onValueChange={setSelectedConsultantId}>
                <SelectTrigger id="consultantSelect">
                  <SelectValue placeholder="Escolha um consultor" />
                </SelectTrigger>
                <SelectContent>
                  {consultants.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.email}) {c.role === 'admin' ? '- Administrador' : '- Consultor'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignModalUser(null)} disabled={assigning}>
              Cancelar
            </Button>
            <Button
              onClick={handleAssignConsultant}
              disabled={assigning || !selectedConsultantId}
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white"
            >
              {assigning ? 'Salvando...' : 'Confirmar Atribuição'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Enviar Mensagem / Follow-up */}
      <Dialog open={!!messageModalUser} onOpenChange={(open) => !open && setMessageModalUser(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-[#0055A4]" />
              Enviar Mensagem para o Cliente
            </DialogTitle>
            <DialogDescription>
              A mensagem será enviada como notificação no portal de{' '}
              <strong className="text-slate-900">{messageModalUser?.user.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="msgSubject">Assunto</Label>
              <Input
                id="msgSubject"
                placeholder="Ex: Boas-vindas ou Apoio no Onboarding"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="msgBody">Conteúdo da Mensagem</Label>
              <Textarea
                id="msgBody"
                rows={5}
                placeholder="Escreva a mensagem aqui..."
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMessageModalUser(null)}
              disabled={sendingMessage}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={sendingMessage || !messageBody.trim()}
              className="bg-[#00A86B] hover:bg-emerald-600 text-white"
            >
              {sendingMessage ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
