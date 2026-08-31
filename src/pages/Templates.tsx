import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutTemplate,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Search,
  Filter,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Building2,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Factory,
  Stethoscope,
  Cpu,
  Wheat,
  Truck,
  GraduationCap,
  ShoppingCart,
  Check,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, Certification } from '@/services/certifications'
import {
  getTemplates,
  deleteTemplate,
  duplicateTemplate,
  Template,
  instantiateTemplatesForCertification,
} from '@/services/templates'
import { getBusinessModels, BusinessModel } from '@/services/business_models'
import { getIsoTypes, IsoType } from '@/services/iso_types'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TemplateDialog } from '@/components/admin/TemplateDialog'
import { toast } from 'sonner'

// Mapeamento de ícones por nome
const getBusinessModelIcon = (name?: string) => {
  const n = (name || '').toLowerCase()
  if (n.includes('mercado') || n.includes('varejo')) return ShoppingCart
  if (n.includes('construtora') || n.includes('obras')) return Building2
  if (n.includes('serviço') || n.includes('prestador')) return Briefcase
  if (n.includes('indústria') || n.includes('manufatura')) return Factory
  if (n.includes('saúde') || n.includes('hospital')) return Stethoscope
  if (n.includes('tecnologia') || n.includes('software') || n.includes('ti')) return Cpu
  if (n.includes('agro')) return Wheat
  if (n.includes('logística') || n.includes('transporte')) return Truck
  if (n.includes('educação') || n.includes('ensino')) return GraduationCap
  return Layers
}

// Cores e rótulos das categorias
const CATEGORY_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  qualidade: {
    label: 'Qualidade (ISO 9001)',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  'meio ambiente': {
    label: 'Meio Ambiente (ISO 14001)',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  'saúde e segurança': {
    label: 'Saúde & Segurança (ISO 45001 / NR-1)',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  indicadores: {
    label: 'Indicadores & Metas',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  'licenças e documentos': {
    label: 'Licenças & Regulatório',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  cotação: {
    label: 'Cotação & Suprimentos',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
  },
  'controle de estoque': {
    label: 'Estoque & Materiais',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  renovação: {
    label: 'Renovação & Alvarás',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  'gestão de funcionários': {
    label: 'Gestão de Pessoas (NR-27)',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
  },
  outro: {
    label: 'Geral',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
}

export default function Templates() {
  const { user } = useAuth()
  const isAuditorOrAdmin = user?.role === 'admin' || user?.role === 'consultor'

  // Estados principais
  const [certs, setCerts] = useState<Certification[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([])
  const [isoTypes, setIsoTypes] = useState<IsoType[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedIsoStandard, setSelectedIsoStandard] = useState<string>('all')
  const [filterRequiredOnly, setFilterRequiredOnly] = useState(false)
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-certs'>('catalog')

  // Modais de Ação do Auditor / Admin
  const [tplDialogOpen, setTplDialogOpen] = useState(false)
  const [editingTpl, setEditingTpl] = useState<Template | null>(null)
  const [targetBmId, setTargetBmId] = useState<string>('')
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [applyingCertId, setApplyingCertId] = useState<string>('')
  const [applying, setApplying] = useState(false)

  const loadData = async () => {
    try {
      const [allCerts, allTemplates, allModels, allIso] = await Promise.all([
        getCertifications(),
        getTemplates(),
        getBusinessModels(),
        getIsoTypes(),
      ])

      const userCerts =
        user?.role === 'cliente' ? allCerts.filter((c) => c.user === user?.id) : allCerts
      setCerts(userCerts)
      setTemplates(allTemplates)
      setBusinessModels(allModels)
      setIsoTypes(allIso)

      // Se for cliente e tiver um modelo de negócio fixo, seleciona por padrão
      if (user?.role === 'cliente' && user?.business_model && selectedModel === 'all') {
        setSelectedModel(user.business_model)
      }
    } catch {
      toast.error('Erro ao carregar dados dos templates')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('templates', () => loadData())
  useRealtime('business_models', () => loadData())
  useRealtime('certifications', () => loadData())

  // Exclusão de template
  const handleDeleteTemplate = async () => {
    if (!deleteTarget) return
    try {
      await deleteTemplate(deleteTarget.id)
      toast.success('Template excluído com sucesso')
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id))
    } catch {
      toast.error('Erro ao excluir template. Verifique permissões.')
    }
    setDeleteTarget(null)
  }

  // Duplicação de template
  const handleDuplicate = async (tpl: Template) => {
    try {
      const copy = await duplicateTemplate(tpl)
      toast.success('Template duplicado com sucesso!')
      loadData()
    } catch {
      toast.error('Erro ao duplicar template')
    }
  }

  // Aplicação de templates em massa numa certificação
  const handleApplyTemplatesToCert = async () => {
    if (!applyingCertId) return
    const cert = certs.find((c) => c.id === applyingCertId)
    if (!cert) return

    const bmId = cert.expand?.user?.business_model || cert.user || user?.business_model
    if (!bmId) {
      toast.error('Esta certificação não possui modelo de negócio vinculado.')
      return
    }

    setApplying(true)
    try {
      await instantiateTemplatesForCertification(cert.id, bmId, cert.user, cert.start_date)
      toast.success('Templates aplicados à certificação com sucesso!')
      setApplyModalOpen(false)
      loadData()
    } catch {
      toast.error('Erro ao aplicar templates à certificação.')
    }
    setApplying(false)
  }

  // Filtragem dos templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Busca de texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = tpl.title.toLowerCase().includes(query)
        const matchDesc = (tpl.description || '').toLowerCase().includes(query)
        const matchCat = (tpl.category || '').toLowerCase().includes(query)
        const matchBm = (tpl.expand?.business_model?.name || '').toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchCat && !matchBm) return false
      }

      // Filtro por modelo de negócio
      if (selectedModel !== 'all' && tpl.business_model !== selectedModel) {
        return false
      }

      // Filtro por tipo (task, document, schedule)
      if (selectedType !== 'all' && tpl.type !== selectedType) {
        return false
      }

      // Filtro por categoria
      if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
        return false
      }

      // Filtro por norma ISO (baseado no título e categoria)
      if (selectedIsoStandard !== 'all') {
        const combined = `${tpl.title} ${tpl.description} ${tpl.category}`.toLowerCase()
        if (
          selectedIsoStandard === '9001' &&
          !combined.includes('9001') &&
          !combined.includes('qualidade')
        )
          return false
        if (
          selectedIsoStandard === '14001' &&
          !combined.includes('14001') &&
          !combined.includes('ambiental') &&
          !combined.includes('meio ambiente')
        )
          return false
        if (
          selectedIsoStandard === '45001' &&
          !combined.includes('45001') &&
          !combined.includes('sst') &&
          !combined.includes('segurança') &&
          !combined.includes('pgr') &&
          !combined.includes('nr-1')
        )
          return false
        if (
          selectedIsoStandard === '22000' &&
          !combined.includes('22000') &&
          !combined.includes('alimento') &&
          !combined.includes('higiene')
        )
          return false
        if (
          selectedIsoStandard === '27001' &&
          !combined.includes('27001') &&
          !combined.includes('segurança da informação') &&
          !combined.includes('lgpd') &&
          !combined.includes('ti')
        )
          return false
      }

      // Filtro apenas obrigatórios
      if (filterRequiredOnly && !tpl.required) {
        return false
      }

      return true
    })
  }, [
    templates,
    searchQuery,
    selectedModel,
    selectedType,
    selectedCategory,
    selectedIsoStandard,
    filterRequiredOnly,
  ])

  // Métricas
  const totalTasks = filteredTemplates.filter((t) => t.type === 'task').length
  const totalDocs = filteredTemplates.filter((t) => t.type === 'document').length
  const totalSchedules = filteredTemplates.filter((t) => t.type === 'schedule').length
  const totalRequired = filteredTemplates.filter((t) => t.required).length

  const userModelObj = businessModels.find((m) => m.id === user?.business_model)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">
          Carregando catálogo de templates ISO...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-[#0055A4]">
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Catálogo de Templates ISO
                {isAuditorOrAdmin && (
                  <Badge className="bg-[#003B73] hover:bg-[#002850] text-white text-xs font-semibold py-0.5 px-2">
                    Painel do Auditor
                  </Badge>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Modelos prontos de tarefas, documentos e agendamentos estruturados por norma e
                segmento de negócio
              </p>
            </div>
          </div>
        </div>

        {/* Ações do Topo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isAuditorOrAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApplyModalOpen(true)}
                className="border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#0055A4]" />
                Aplicar em Empresa
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEditingTpl(null)
                  setTargetBmId(
                    selectedModel !== 'all' ? selectedModel : businessModels[0]?.id || '',
                  )
                  setTplDialogOpen(true)
                }}
                className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Template
              </Button>
            </>
          )}

          {!isAuditorOrAdmin && userModelObj && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500">Seu segmento:</span>
              <span className="font-semibold text-slate-800">{userModelObj.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-200/80 hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalTasks}</p>
              <p className="text-xs text-slate-500 font-medium">Tarefas / Checklists</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalDocs}</p>
              <p className="text-xs text-slate-500 font-medium">Documentos & Evidências</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalSchedules}</p>
              <p className="text-xs text-slate-500 font-medium">Auditorias & Reuniões</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalRequired}</p>
              <p className="text-xs text-slate-500 font-medium">Itens Obrigatórios</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros e Busca Completa */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar template por título, descrição, norma ou palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Filtro de Modelo de Negócio */}
            <div className="w-full lg:w-56">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <SelectValue placeholder="Modelo de Negócio" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">Todos os Segmentos ({businessModels.length})</SelectItem>
                  {businessModels.map((bm) => (
                    <SelectItem key={bm.id} value={bm.id}>
                      {bm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Norma ISO */}
            <div className="w-full lg:w-52">
              <Select value={selectedIsoStandard} onValueChange={setSelectedIsoStandard}>
                <SelectTrigger className="text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <SelectValue placeholder="Norma ISO" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Normas</SelectItem>
                  <SelectItem value="9001">ISO 9001 (Qualidade)</SelectItem>
                  <SelectItem value="14001">ISO 14001 (Ambiental)</SelectItem>
                  <SelectItem value="45001">ISO 45001 (SST / NR-1)</SelectItem>
                  <SelectItem value="22000">ISO 22000 (Alimentos)</SelectItem>
                  <SelectItem value="27001">ISO 27001 (TI / Dados)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segunda linha de filtros rápidos */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Tipo:
              </span>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'task', label: 'Tarefas', icon: CheckCircle2 },
                { id: 'document', label: 'Documentos', icon: FileText },
                { id: 'schedule', label: 'Agendamentos', icon: Calendar },
              ].map((btn) => {
                const active = selectedType === btn.id
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setSelectedType(btn.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                      active
                        ? 'bg-[#0055A4] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {btn.icon && <btn.icon className="h-3 w-3" />}
                    {btn.label}
                  </button>
                )
              })}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* Filtro apenas obrigatórios */}
              <button
                type="button"
                onClick={() => setFilterRequiredOnly(!filterRequiredOnly)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  filterRequiredOnly
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <AlertCircle className="h-3 w-3" />
                Apenas Obrigatórios
              </button>
            </div>

            {/* Categoria Específica */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Categoria:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="text-xs h-8 w-full sm:w-48">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {Object.entries(CATEGORY_MAP).map(([key, item]) => (
                    <SelectItem key={key} value={key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para alternar entre Catálogo Completo e Certificações Ativas */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutTemplate className="h-4 w-4" />
            Catálogo de Itens ({filteredTemplates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-certs')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'my-certs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Certificações & Status ({certs.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Mostrando {filteredTemplates.length} de {templates.length} templates
        </span>
      </div>

      {/* CONTEÚDO DA TAB: CATÁLOGO */}
      {activeTab === 'catalog' && (
        <>
          {filteredTemplates.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-16 space-y-3">
                <div className="p-3 bg-slate-100 text-slate-400 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-base">
                    Nenhum template encontrado
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Não encontramos templates com os filtros selecionados. Experimente limpar a
                    busca ou selecionar outro segmento de negócio.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedModel('all')
                      setSelectedType('all')
                      setSelectedCategory('all')
                      setSelectedIsoStandard('all')
                      setFilterRequiredOnly(false)
                    }}
                  >
                    Resetar Filtros
                  </Button>
                  {isAuditorOrAdmin && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingTpl(null)
                        setTplDialogOpen(true)
                      }}
                      className="bg-[#0055A4] hover:bg-[#1A73E8]"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Criar Novo Template
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTemplates.map((tpl) => {
                const bmName = tpl.expand?.business_model?.name || 'Segmento Geral'
                const BmIcon = getBusinessModelIcon(bmName)
                const catInfo = CATEGORY_MAP[tpl.category] || CATEGORY_MAP.outro

                return (
                  <Card
                    key={tpl.id}
                    className="border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group bg-white"
                  >
                    <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Linha superior: Tipo, Categoria e Segmento */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Tipo */}
                            {tpl.type === 'task' && (
                              <Badge
                                variant="outline"
                                className="text-[11px] bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 py-0.5"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Tarefa
                              </Badge>
                            )}
                            {tpl.type === 'document' && (
                              <Badge
                                variant="outline"
                                className="text-[11px] bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1 py-0.5"
                              >
                                <FileText className="h-3 w-3" /> Documento
                              </Badge>
                            )}
                            {tpl.type === 'schedule' && (
                              <Badge
                                variant="outline"
                                className="text-[11px] bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 py-0.5"
                              >
                                <Calendar className="h-3 w-3" /> Agendamento
                              </Badge>
                            )}

                            {/* Categoria */}
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${catInfo.bg} ${catInfo.text} ${catInfo.border}`}
                            >
                              {catInfo.label}
                            </Badge>

                            {/* Obrigatório */}
                            {tpl.required && (
                              <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                                Obrigatório
                              </Badge>
                            )}
                          </div>

                          {/* Prazo */}
                          {tpl.due_days > 0 ? (
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <Clock className="h-3 w-3 text-slate-400" /> {tpl.due_days} dias
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full shrink-0">
                              Imediato
                            </span>
                          )}
                        </div>

                        {/* Título */}
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug mt-2.5 group-hover:text-[#0055A4] transition-colors">
                          {tpl.title}
                        </h3>

                        {/* Descrição / Orientações do auditor */}
                        {tpl.description && (
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                            {tpl.description}
                          </p>
                        )}
                      </div>

                      {/* Rodapé do Card: Segmento e Ações */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <BmIcon className="h-3.5 w-3.5 text-[#0055A4]" />
                          <span className="font-medium text-slate-700 truncate max-w-[150px] sm:max-w-[200px]">
                            {bmName}
                          </span>
                        </div>

                        {/* Ações para Auditor / Admin */}
                        {isAuditorOrAdmin ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-[#0055A4] hover:bg-blue-50"
                              title="Duplicar template"
                              onClick={() => handleDuplicate(tpl)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-[#0055A4] hover:bg-blue-50"
                              title="Editar template"
                              onClick={() => {
                                setEditingTpl(tpl)
                                setTargetBmId(tpl.business_model)
                                setTplDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Excluir template"
                              onClick={() => setDeleteTarget(tpl)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Check className="h-3 w-3 text-emerald-500" /> Padronizado
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* CONTEÚDO DA TAB: CERTIFICAÇÕES & APLICAÇÃO */}
      {activeTab === 'my-certs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Certificações e Aplicação de Templates
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhe as empresas e se os pacotes de templates do seu segmento foram aplicados
              </p>
            </div>
            {isAuditorOrAdmin && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setApplyModalOpen(true)}
                className="text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#0055A4]" />
                Instanciar Templates em Obra/Empresa
              </Button>
            )}
          </div>

          {certs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-slate-500 space-y-3">
                <ShieldCheck className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-sm font-medium">Nenhuma certificação ativa encontrada.</p>
                <p className="text-xs text-slate-400">
                  Crie uma certificação para vincular os pacotes de templates ao cliente.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {certs.map((c) => {
                const bmName = c.expand?.user?.business_model
                  ? businessModels.find((b) => b.id === c.expand?.user?.business_model)?.name
                  : 'Construtora / Geral'

                return (
                  <Card
                    key={c.id}
                    className="border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-base">
                            {c.expand?.iso_type?.name || 'Certificação ISO'}
                          </p>
                          <Badge
                            variant={c.template_applied ? 'default' : 'secondary'}
                            className={`text-xs ${
                              c.template_applied
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {c.template_applied ? 'Templates Aplicados' : 'Sem Templates'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            Empresa: {c.company_name || 'Empresa Cliente'}
                          </span>
                          <span>•</span>
                          <span>Segmento: {bmName}</span>
                          <span>•</span>
                          <span>
                            Status: <strong className="text-slate-700">{c.status}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!c.template_applied && isAuditorOrAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setApplyingCertId(c.id)
                              setApplyModalOpen(true)
                            }}
                            className="text-xs text-[#0055A4] border-blue-200 hover:bg-blue-50"
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            Aplicar Templates
                          </Button>
                        )}
                        <Link to={`/certificacoes/${c.id}`}>
                          <Button
                            size="sm"
                            className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs"
                          >
                            Ver Processo <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Criação / Edição de Template */}
      <TemplateDialog
        open={tplDialogOpen}
        onOpenChange={setTplDialogOpen}
        template={editingTpl}
        businessModelId={targetBmId}
        businessModels={businessModels}
        onSaved={() => loadData()}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">
              Confirmar exclusão de template
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              Tem certeza que deseja excluir o template <strong>"{deleteTarget?.title}"</strong>?
              Esta ação removerá o modelo do catálogo padrão. Tarefas já criadas não serão afetadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Excluir Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Aplicação de Templates em Empresa */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-[#0055A4]" />
              Aplicar Templates à Certificação
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Esta ação gera automaticamente todas as tarefas, solicitações de documentos e
              agendamentos configurados no segmento para a empresa selecionada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Selecione a Certificação / Empresa:
              </label>
              <Select value={applyingCertId} onValueChange={setApplyingCertId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Escolha uma certificação..." />
                </SelectTrigger>
                <SelectContent>
                  {certs.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company_name || 'Empresa'} - {c.expand?.iso_type?.name || 'ISO'}{' '}
                      {c.template_applied ? '(Já aplicado)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApplyModalOpen(false)} disabled={applying}>
              Cancelar
            </Button>
            <Button
              onClick={handleApplyTemplatesToCert}
              disabled={applying || !applyingCertId}
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white"
            >
              {applying ? 'Aplicando...' : 'Aplicar Templates'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
