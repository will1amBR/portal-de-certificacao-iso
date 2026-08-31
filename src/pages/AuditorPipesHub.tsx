import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Zap,
  ArrowRight,
  Layers,
  Search,
  Building,
  HelpCircle,
  Clock,
  Send,
  UserCheck,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  Compass,
  FileCheck2,
  HeartPulse,
  Leaf,
  Lock,
  ShieldAlert,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getAllUsers, IsoUser, CompanyDepartment } from '@/services/users'
import { getCertifications, Certification } from '@/services/certifications'
import { getPipes, Pipe } from '@/services/pipes'
import { STANDARD_PRESETS, StandardPreset, applyStandardPresetToClient } from '@/services/presets'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PRESET_ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Leaf,
  Lock,
  HeartPulse,
  ShieldAlert,
  FileCheck2,
}

export default function AuditorPipesHub() {
  const { user } = useAuth()
  const [clients, setClients] = useState<IsoUser[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [existingPipes, setExistingPipes] = useState<Pipe[]>([])
  const [loading, setLoading] = useState(true)

  // Selected client to configure
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [searchClientQuery, setSearchClientQuery] = useState('')

  // Modal for Applying Preset in 1-Click
  const [activePresetToApply, setActivePresetToApply] = useState<StandardPreset | null>(null)
  const [applying, setApplying] = useState(false)
  const [selectedCertForPreset, setSelectedCertForPreset] = useState<string>('auto')

  // Preview Dialog for exploring preset details
  const [presetToPreview, setPresetToPreview] = useState<StandardPreset | null>(null)

  const loadData = async () => {
    try {
      const [usersData, certsData, pipesData] = await Promise.all([
        getAllUsers(),
        getCertifications(),
        getPipes(),
      ])

      // Only client accounts (or all non-admins if desired)
      const clientUsers = usersData.filter((u) => u.role === 'cliente' || (!u.role && u.cnpj))
      setClients(clientUsers)
      setCertifications(certsData)
      setExistingPipes(pipesData)

      // Auto-select demo.cliente or first client if none selected
      if (!selectedClientId && clientUsers.length > 0) {
        const demoCli = clientUsers.find((c) => c.email === 'demo.cliente@alc.com.br')
        setSelectedClientId(demoCli ? demoCli.id : clientUsers[0].id)
      }
    } catch {
      toast.error('Erro ao carregar dados do auditor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('users', () => loadData())
  useRealtime('certifications', () => loadData())
  useRealtime('pipes', () => loadData())

  // Current selected client object
  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null
  }, [clients, selectedClientId])

  // Certifications for the selected client
  const clientCerts = useMemo(() => {
    if (!selectedClientId) return []
    return certifications.filter((c) => c.user === selectedClientId)
  }, [certifications, selectedClientId])

  // Departments for the selected client (with sample fallback if empty)
  const clientDepartments: CompanyDepartment[] = useMemo(() => {
    if (
      selectedClient?.departments &&
      Array.isArray(selectedClient.departments) &&
      selectedClient.departments.length > 0
    ) {
      return selectedClient.departments
    }
    return []
  }, [selectedClient])

  // Client search filter
  const filteredClients = useMemo(() => {
    if (!searchClientQuery.trim()) return clients
    const q = searchClientQuery.toLowerCase()
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.cnpj?.includes(q),
    )
  }, [clients, searchClientQuery])

  // Handle 1-Click Preset Application
  const handleConfirmApplyPreset = async () => {
    if (!activePresetToApply || !selectedClientId) return
    setApplying(true)
    try {
      const targetCertId =
        selectedCertForPreset !== 'auto'
          ? selectedCertForPreset
          : clientCerts.length > 0
            ? clientCerts[0].id
            : undefined

      const result = await applyStandardPresetToClient({
        presetId: activePresetToApply.id,
        clientId: selectedClientId,
        certificationId: targetCertId,
      })

      toast.success(
        `Pre-set ${activePresetToApply.name} aplicado com sucesso! ${result.createdPipesCount} fluxos e ${result.createdCardsCount} cards gerados para ${selectedClient?.name || 'o cliente'}.`,
      )

      setActivePresetToApply(null)
      loadData()
    } catch (err: any) {
      toast.error('Erro ao aplicar pre-set: ' + (err?.message || 'Tente novamente'))
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003B73] via-[#0055A4] to-[#007ACC] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-2 text-xs font-semibold text-blue-100">
              <Zap className="h-3.5 w-3.5 text-amber-300" /> Área Técnica do Auditor & Consultor
            </div>
            <h1 className="text-2xl font-bold">Catálogo de Fluxos & Pre-sets de Pipes por Norma</h1>
            <p className="text-sm text-blue-100 mt-1 max-w-3xl leading-relaxed">
              Aplique em 1 clique o conjunto completo de Pipes de qualquer norma (ISO 9001, 14001,
              27001, 45001, NR-1 e NR-27) diretamente no cliente. Consulte os setores e contatos
              preenchidos no onboarding para personalizar os fluxos.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 self-start lg:self-auto bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shrink-0">
            <div className="text-center px-2">
              <span className="text-2xl font-black text-amber-300">{STANDARD_PRESETS.length}</span>
              <p className="text-[11px] text-blue-100">Normas & NRs</p>
            </div>
            <div className="h-8 w-px bg-white/20 self-center" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-emerald-300">
                {STANDARD_PRESETS.reduce((acc, p) => acc + p.pipesCount, 0)}
              </span>
              <p className="text-[11px] text-blue-100">Pipes Prontos</p>
            </div>
            <div className="h-8 w-px bg-white/20 self-center" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-white">{clients.length}</span>
              <p className="text-[11px] text-blue-100">Clientes Ativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Client Selector & Departments, Right Presets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Client Selector & Onboarding Departments Info (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-200 shadow-sm sticky top-20">
            <CardHeader className="p-4 pb-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#0055A4]" />
                  Cliente em Atendimento
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-white">
                  {clients.length} cadastrados
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Selecione o cliente para visualizar os setores e aplicar pre-sets
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Select Client Dropdown */}
              <div className="space-y-1.5">
                <Label htmlFor="clientSelect" className="text-xs font-semibold text-slate-700">
                  Selecione a Empresa
                </Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger id="clientSelect" className="h-10 text-xs bg-white font-medium">
                    <SelectValue placeholder="Escolha um cliente..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        <div className="flex flex-col text-left py-0.5">
                          <span className="font-bold text-slate-900">
                            {c.name || 'Empresa sem nome'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {c.cnpj
                              ? c.cnpj.replace(
                                  /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                  '$1.$2.$3/$4-$5',
                                )
                              : c.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Client Summary Card */}
              {selectedClient ? (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {selectedClient.name || 'Empresa'}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {selectedClient.email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0055A4] text-[10px] font-bold">
                      {selectedClient.expand?.business_model?.name || 'Cliente'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">CNPJ</span>
                      <span className="font-medium text-slate-800">
                        {selectedClient.cnpj
                          ? selectedClient.cnpj.replace(
                              /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                              '$1.$2.$3/$4-$5',
                            )
                          : 'Não informado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Certificações</span>
                      <span className="font-medium text-slate-800">
                        {clientCerts.length > 0
                          ? `${clientCerts.length} ativa(s)`
                          : 'Nenhuma iniciada'}
                      </span>
                    </div>
                  </div>

                  {/* Certifications badges */}
                  {clientCerts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {clientCerts.map((c) => (
                        <Badge
                          key={c.id}
                          variant="secondary"
                          className="text-[10px] py-0 px-2 bg-white text-slate-700 border border-slate-200"
                        >
                          {c.expand?.iso_type?.name || 'Cert'} ({c.progress || 0}%)
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Nenhum cliente selecionado
                </div>
              )}

              {/* SOLICITAÇÃO 2: Setores & Responsáveis coletados no Onboarding */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#0055A4]" />
                    Setores & Contatos da Empresa
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-[#0055A4]">
                    {clientDepartments.length} setores
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dados coletados no onboarding para orientar a adaptação dos fluxos e
                  direcionamento de não-conformidades.
                </p>

                {clientDepartments.length === 0 ? (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      Setores ainda não preenchidos
                    </p>
                    <p className="text-amber-700">
                      O cliente ainda não informou os departamentos no onboarding. Você pode
                      solicitar o preenchimento ou aplicar os pre-sets padrão.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {clientDepartments.map((dept, idx) => (
                      <div
                        key={dept.id || idx}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-all text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-bold text-slate-900 truncate flex items-center gap-1">
                            <Building className="h-3 w-3 text-[#0055A4] shrink-0" />
                            {dept.name}
                          </span>
                        </div>

                        {dept.manager && (
                          <p className="text-slate-700 font-medium text-[11px] flex items-center gap-1">
                            <UserCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>{dept.manager}</span>
                          </p>
                        )}

                        <div className="text-[11px] text-slate-500 space-y-0.5 pt-0.5">
                          {dept.phone && (
                            <p className="flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                              <span>{dept.phone}</span>
                            </p>
                          )}
                          {dept.email && (
                            <p className="flex items-center gap-1">
                              <Mail className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                              <span className="truncate">{dept.email}</span>
                            </p>
                          )}
                          {dept.notes && (
                            <p className="text-[10px] text-slate-400 italic bg-slate-50 p-1 rounded mt-1">
                              {dept.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Standard Presets Catalog (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#0055A4]" />
                Pre-sets de Pipes por Norma
              </h2>
              <p className="text-xs text-slate-500">
                Selecione uma norma para aplicar o pacote completo de pipes no cliente selecionado
              </p>
            </div>
            <Link to="/certificacoes">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 whitespace-nowrap cursor-pointer"
              >
                Ver Pipes Ativos <ExternalLink className="h-3 w-3 ml-1 shrink-0" />
              </Button>
            </Link>
          </div>

          {/* Grid of 6 Standards Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STANDARD_PRESETS.map((preset) => {
              const Icon = PRESET_ICON_MAP[preset.icon] || ShieldCheck

              return (
                <Card
                  key={preset.id}
                  className="hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border-slate-200"
                >
                  <div>
                    {/* Card Top Strip with Gradient */}
                    <div className={cn('p-4 text-white bg-gradient-to-r', preset.color)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white hover:bg-white/30 border-0 text-[10px] font-bold uppercase tracking-wider"
                        >
                          {preset.pipesCount} Pipes Prontos
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold mt-2.5 leading-tight">{preset.name}</h3>
                      <p className="text-xs text-white/85 mt-0.5">{preset.subtitle}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">{preset.summary}</p>

                      {/* Mini list of pipes included */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                          Fluxos inclusos no pre-set:
                        </span>
                        <div className="grid grid-cols-1 gap-1">
                          {preset.pipes.slice(0, 4).map((p) => (
                            <div
                              key={p.code}
                              className="text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center justify-between"
                            >
                              <span className="font-semibold truncate pr-1">
                                {p.code}: {p.title.replace(p.code, '').replace(/^[- ]+/, '')}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {p.stages.length} etapas
                              </span>
                            </div>
                          ))}
                          {preset.pipes.length > 4 && (
                            <span className="text-[11px] text-[#0055A4] font-semibold pl-1">
                              + {preset.pipes.length - 4} outros fluxos complementares
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-100 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPresetToPreview(preset)}
                      className="text-xs flex-1 border-slate-200 hover:bg-slate-50 min-h-[38px] whitespace-nowrap cursor-pointer"
                    >
                      Ver Detalhes
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActivePresetToApply(preset)}
                      disabled={!selectedClientId}
                      className="text-xs flex-1 bg-[#0055A4] hover:bg-[#1A73E8] text-white min-h-[38px] font-semibold shadow-xs whitespace-nowrap cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5 mr-1 shrink-0 text-yellow-300" />
                      Aplicar no Cliente
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* DIALOG 1: Confirm 1-Click Application */}
      <Dialog
        open={!!activePresetToApply}
        onOpenChange={(open) => !open && setActivePresetToApply(null)}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Zap className="h-5 w-5 text-[#0055A4]" />
              Aplicar Pre-set de Pipes no Cliente
            </DialogTitle>
            <DialogDescription>
              Insere instantaneamente o conjunto estruturado de fluxos (Kanban) para a certificação
              do cliente.
            </DialogDescription>
          </DialogHeader>

          {activePresetToApply && (
            <div className="space-y-4 py-2">
              {/* Target info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Norma / Pre-set:</span>
                  <span className="font-bold text-slate-900">{activePresetToApply.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cliente Destino:</span>
                  <span className="font-bold text-slate-900">
                    {selectedClient?.name || 'Cliente selecionado'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total de Pipes a Criar:</span>
                  <Badge
                    variant="secondary"
                    className="font-bold text-xs bg-blue-100 text-[#0055A4]"
                  >
                    {activePresetToApply.pipesCount} fluxos operacionais
                  </Badge>
                </div>
              </div>

              {/* Sector mapping hint for auditor */}
              {clientDepartments.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1.5 text-emerald-900">
                  <p className="font-bold flex items-center gap-1 text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Setores e Responsáveis disponíveis para adaptação:
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    O cliente possui {clientDepartments.length} setores mapeados (ex:{' '}
                    {clientDepartments
                      .map((d) => d.name)
                      .slice(0, 3)
                      .join(', ')}
                    ). Após a aplicação automática, você poderá atribuir os responsáveis a cada card
                    específico.
                  </p>
                </div>
              )}

              {/* Optional certification link */}
              {clientCerts.length > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="certSelect" className="text-xs font-semibold text-slate-700">
                    Vincular à Certificação do Cliente
                  </Label>
                  <Select value={selectedCertForPreset} onValueChange={setSelectedCertForPreset}>
                    <SelectTrigger id="certSelect" className="h-9 text-xs bg-white">
                      <SelectValue placeholder="Selecione a certificação..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        Vincular automaticamente à certificação compatível
                      </SelectItem>
                      {clientCerts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.expand?.iso_type?.name || 'Certificação'} (Status: {c.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Pipes to be created list preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Fluxos que serão gerados:
                </span>
                <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                  {activePresetToApply.pipes.map((p, i) => (
                    <div
                      key={p.code}
                      className="p-2 rounded-md bg-white border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="h-5 w-5 rounded bg-blue-50 text-[#0055A4] text-[11px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">{p.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {p.stages.length} etapas
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setActivePresetToApply(null)}
              disabled={applying}
              className="min-h-[40px] whitespace-nowrap"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmApplyPreset}
              disabled={applying}
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white min-h-[40px] px-6 font-semibold whitespace-nowrap shadow-xs cursor-pointer"
            >
              {applying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5 shrink-0" />
                  Gerando Pipes...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1.5 shrink-0 text-yellow-300" />
                  Confirmar e Aplicar Pre-set
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Detailed Preset Explorer */}
      <Dialog open={!!presetToPreview} onOpenChange={(open) => !open && setPresetToPreview(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Layers className="h-5 w-5 text-[#0055A4]" />
              {presetToPreview?.name} - {presetToPreview?.subtitle}
            </DialogTitle>
            <DialogDescription>{presetToPreview?.summary}</DialogDescription>
          </DialogHeader>

          {presetToPreview && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
                <div>
                  <span className="font-bold text-[#0055A4] block">
                    {presetToPreview.pipesCount} Fluxos Estruturados (Pipes)
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Cada pipe já inclui estágios de triagem, contenção, tratativas e homologação
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const p = presetToPreview
                    setPresetToPreview(null)
                    setActivePresetToApply(p)
                  }}
                  disabled={!selectedClientId}
                  className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs h-8 whitespace-nowrap cursor-pointer"
                >
                  <Zap className="h-3 w-3 mr-1 text-yellow-300 shrink-0" />
                  Aplicar Este Pre-set
                </Button>
              </div>

              <div className="space-y-3">
                {presetToPreview.pipes.map((p, idx) => (
                  <div
                    key={p.code}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                          {p.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs">{p.description}</p>

                    {/* Stages badges */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Estágios do Kanban ({p.stages.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.stages.map((stg, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            <span className="text-[9px] text-slate-400 font-bold">{sIdx + 1}.</span>
                            {stg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPresetToPreview(null)}
              className="min-h-[40px] whitespace-nowrap"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
