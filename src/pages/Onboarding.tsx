import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ShoppingCart,
  Building2,
  Briefcase,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  Users,
  Phone,
  Mail,
  Plus,
  Trash2,
  Building,
  UserCheck,
  HelpCircle,
  FileCheck2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { getBusinessModels, BusinessModel } from '@/services/business_models'
import { updateUser, CompanyDepartment } from '@/services/users'
import { instantiateTemplatesForUser } from '@/services/templates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import { toast } from 'sonner'

function maskCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const iconMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="h-7 w-7" />,
  Building2: <Building2 className="h-7 w-7" />,
  Briefcase: <Briefcase className="h-7 w-7" />,
  Factory: <Building2 className="h-7 w-7" />,
  Stethoscope: <Briefcase className="h-7 w-7" />,
  Cpu: <Briefcase className="h-7 w-7" />,
  Wheat: <Building2 className="h-7 w-7" />,
  Truck: <Briefcase className="h-7 w-7" />,
  GraduationCap: <Briefcase className="h-7 w-7" />,
}

const DEFAULT_DEPARTMENTS: Array<{ name: string; manager: string; phone: string; email: string }> =
  [
    {
      name: 'Diretoria / Gestão Geral',
      manager: '',
      phone: '',
      email: '',
    },
    {
      name: 'Garantia da Qualidade / SGQ',
      manager: '',
      phone: '',
      email: '',
    },
    {
      name: 'Operações / Produção',
      manager: '',
      phone: '',
      email: '',
    },
    {
      name: 'Recursos Humanos / DHO',
      manager: '',
      phone: '',
      email: '',
    },
    {
      name: 'Almoxarifado / Suprimentos',
      manager: '',
      phone: '',
      email: '',
    },
  ]

const QUICK_SUGGESTIONS = [
  'Administrativo / Financeiro',
  'Segurança do Trabalho (SESMT)',
  'Tecnologia da Informação (TI)',
  'Comercial / Vendas',
  'Manutenção & Infraestrutura',
  'Jurídico & Compliance',
]

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [cnpj, setCnpj] = useState('')
  const [models, setModels] = useState<BusinessModel[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [departments, setDepartments] = useState<CompanyDepartment[]>([
    {
      id: 'dep-1',
      name: 'Diretoria / Gestão Geral',
      manager: '',
      phone: '',
      email: '',
      notes: '',
    },
    {
      id: 'dep-2',
      name: 'Garantia da Qualidade / SGQ',
      manager: '',
      phone: '',
      email: '',
      notes: '',
    },
    {
      id: 'dep-3',
      name: 'Operações / Produção',
      manager: '',
      phone: '',
      email: '',
      notes: '',
    },
  ])
  const [submitting, setSubmitting] = useState(false)

  // Check if tour was already shown or if user came directly with ?tour=false or forced with ?tour=true
  const tourParam = searchParams.get('tour')
  const [showTour, setShowTour] = useState(() => {
    if (tourParam === 'true') return true
    if (tourParam === 'false') return false
    const seen = localStorage.getItem('iso_onboarding_tour_seen')
    return !seen
  })

  useEffect(() => {
    // If user is already fully onboarded and not explicitly requesting tour or re-configuration
    if (
      user?.cnpj &&
      user?.business_model &&
      user?.onboarding_completed &&
      tourParam !== 'true' &&
      !searchParams.get('edit')
    ) {
      navigate('/dashboard')
    }
  }, [user, navigate, tourParam, searchParams])

  useEffect(() => {
    getBusinessModels()
      .then(setModels)
      .catch(() => {})

    // Prepopulate user data if existing
    if (user?.cnpj) {
      setCnpj(maskCnpj(user.cnpj))
    }
    if (user?.business_model) {
      setSelectedModel(user.business_model)
    }
    if (user?.departments && Array.isArray(user.departments) && user.departments.length > 0) {
      setDepartments(user.departments)
    }
  }, [user])

  const handleTourClose = () => {
    setShowTour(false)
    localStorage.setItem('iso_onboarding_tour_seen', 'true')
    if (tourParam) {
      searchParams.delete('tour')
      setSearchParams(searchParams)
    }
  }

  const handleTourComplete = () => {
    setShowTour(false)
    localStorage.setItem('iso_onboarding_tour_seen', 'true')
    if (tourParam) {
      searchParams.delete('tour')
      setSearchParams(searchParams)
    }
    toast.info('Preencha os dados da sua empresa para acelerar a adequação.')
  }

  const cnpjValid = cnpj.replace(/\D/g, '').length === 14

  // Department handling
  const addDepartment = (name = '') => {
    const newId = `dep-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    setDepartments((prev) => [
      ...prev,
      {
        id: newId,
        name: name || 'Novo Setor',
        manager: '',
        phone: '',
        email: '',
        notes: '',
      },
    ])
  }

  const removeDepartment = (id: string) => {
    if (departments.length <= 1) {
      toast.warning('Mantenha pelo menos um setor cadastrado.')
      return
    }
    setDepartments((prev) => prev.filter((d) => d.id !== id))
  }

  const updateDepartment = (id: string, field: keyof CompanyDepartment, val: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d
        return {
          ...d,
          [field]: field === 'phone' ? maskPhone(val) : val,
        }
      }),
    )
  }

  // Validation for step 3: check if at least one department has a manager or name
  const isDepartmentsValid = departments.some((d) => d.name.trim().length > 0)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const cleanCnpj = cnpj.replace(/\D/g, '')

      // Clean empty departments
      const validDepartments = departments.filter((d) => d.name.trim().length > 0)

      await updateUser(user.id, {
        cnpj: cleanCnpj,
        business_model: selectedModel,
        departments: validDepartments,
        onboarding_completed: true,
      } as any)

      await instantiateTemplatesForUser(user.id, selectedModel)

      // Refresh auth store so user has updated cnpj and business_model
      try {
        await pb.collection('users').authRefresh()
      } catch {
        /* if auth refresh fails, local values persist */
      }

      toast.success('Onboarding concluído com sucesso! Bem-vindo ao portal.')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error('Erro ao salvar dados: ' + (err?.message || 'Tente novamente'))
    } finally {
      setSubmitting(false)
    }
  }

  const selectedModelObj = models.find((m) => m.id === selectedModel)

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Onboarding tour full-screen modal */}
      <OnboardingTour open={showTour} onClose={handleTourClose} onComplete={handleTourComplete} />

      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuração Inicial da Empresa</h1>
          <p className="text-sm text-slate-500 mt-1">
            Informações essenciais para personalizar os fluxos, templates e facilitar a atuação do
            auditor
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTour(true)}
          className="text-xs text-[#0055A4] border-blue-200 hover:bg-blue-50 whitespace-nowrap min-h-[40px] cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 shrink-0" />
          Ver Tour Guiado
        </Button>
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              step >= s ? 'bg-[#0055A4] w-12' : 'bg-slate-200 w-8'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: CNPJ */}
      {step === 1 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0055A4] text-xs font-semibold mb-2">
                Etapa 1 de 4
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Informe o CNPJ da sua empresa
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Usaremos o CNPJ para identificar sua empresa perante os órgãos certificadores e
                personalizar seus documentos.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="cnpj" className="text-sm font-semibold text-slate-700">
                CNPJ da Empresa
              </Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(maskCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="text-lg tracking-wide h-12 bg-white"
                autoFocus
              />
              {cnpj.length > 0 && !cnpjValid && (
                <p className="text-xs text-amber-600 font-medium">
                  CNPJ deve conter 14 dígitos válidos.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                onClick={() => setStep(2)}
                disabled={!cnpjValid}
                className="bg-[#0055A4] hover:bg-[#1A73E8] text-white min-h-[42px] px-6"
              >
                Próximo: Modelo de Negócio <ChevronRight className="h-4 w-4 ml-1.5 shrink-0" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: BUSINESS MODEL */}
      {step === 2 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0055A4] text-xs font-semibold mb-2">
                Etapa 2 de 4
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Selecione o segmento e modelo de negócio
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Isso define os templates automáticos de qualidade, segurança e meio ambiente mais
                adequados.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === m.id
                      ? 'border-[#0055A4] bg-sky-50/50 ring-1 ring-[#0055A4]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      selectedModel === m.id
                        ? 'bg-[#0055A4] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {iconMap[m.icon] || <Briefcase className="h-7 w-7" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-sm text-slate-500">{m.description}</p>
                  </div>
                  {selectedModel === m.id && (
                    <Check className="h-5 w-5 text-[#0055A4] mt-1 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="min-h-[42px] whitespace-nowrap"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5 shrink-0" /> Voltar
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedModel}
                className="bg-[#0055A4] hover:bg-[#1A73E8] text-white min-h-[42px] px-6 whitespace-nowrap"
              >
                Próximo: Setores & Responsáveis <ChevronRight className="h-4 w-4 ml-1.5 shrink-0" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: DEPARTMENTS, MANAGERS, PHONE AND EMAILS */}
      {step === 3 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0055A4] text-xs font-semibold mb-2">
                Etapa 3 de 4
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Quais setores existem na sua empresa e quem responde por cada área?
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Informe os departamentos, o responsável direto de cada um, telefone de contato e
                e-mail. O auditor técnico utilizará essas informações para adaptar os fluxos (Pipes)
                e direcionar não-conformidades e evidências.
              </p>
            </div>

            {/* Quick add chips */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Sugestões rápidas de setores para adicionar:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((sug) => {
                  const alreadyHas = departments.some(
                    (d) => d.name.toLowerCase() === sug.toLowerCase(),
                  )
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={alreadyHas}
                      onClick={() => addDepartment(sug)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                        alreadyHas
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-[#0055A4]'
                      }`}
                    >
                      <Plus className="h-3 w-3 shrink-0" />
                      <span>{sug}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* List of department cards */}
            <div className="space-y-4">
              {departments.map((dept, idx) => (
                <div
                  key={dept.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 relative hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="h-6 w-6 rounded-full bg-blue-100 text-[#0055A4] text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        value={dept.name}
                        onChange={(e) => updateDepartment(dept.id, 'name', e.target.value)}
                        placeholder="Nome do Setor (ex: Garantia da Qualidade)"
                        className="font-semibold text-slate-900 text-sm h-9 max-w-sm"
                      />
                    </div>
                    {departments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDepartment(dept.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 h-8 w-8 rounded-lg cursor-pointer"
                        title="Remover setor"
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" /> Responsável (Nome)
                      </Label>
                      <Input
                        value={dept.manager}
                        onChange={(e) => updateDepartment(dept.id, 'manager', e.target.value)}
                        placeholder="Ex: Carlos Mendes"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" /> Telefone / WhatsApp
                      </Label>
                      <Input
                        value={dept.phone}
                        onChange={(e) => updateDepartment(dept.id, 'phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400" /> E-mail de Contato
                      </Label>
                      <Input
                        type="email"
                        value={dept.email}
                        onChange={(e) => updateDepartment(dept.id, 'email', e.target.value)}
                        placeholder="responsavel@empresa.com"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <Input
                      value={dept.notes || ''}
                      onChange={(e) => updateDepartment(dept.id, 'notes', e.target.value)}
                      placeholder="Observações adicionais ou atribuições específicas deste setor (opcional)"
                      className="h-8 text-[11px] text-slate-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addDepartment()}
                className="w-full border-dashed border-slate-300 text-slate-700 hover:border-[#0055A4] hover:text-[#0055A4] hover:bg-blue-50/50 min-h-[42px] cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5 shrink-0" />
                Adicionar Outro Setor / Departamento
              </Button>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="min-h-[42px] whitespace-nowrap"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5 shrink-0" /> Voltar
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!isDepartmentsValid}
                className="bg-[#0055A4] hover:bg-[#1A73E8] text-white min-h-[42px] px-6 whitespace-nowrap"
              >
                Próximo: Revisão & Conclusão <ChevronRight className="h-4 w-4 ml-1.5 shrink-0" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: CONFIRMATION & COMPLETION */}
      {step === 4 && selectedModelObj && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                Etapa 4 de 4 - Revisão
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Confirmação dos Dados da Empresa
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Revise os dados antes de confirmar. Nossos templates e fluxos serão preparados
                automaticamente.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                    CNPJ da Empresa
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{cnpj}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                    Segmento / Modelo
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {selectedModelObj.name}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold mb-2">
                  Setores e Responsáveis Cadastrados ({departments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {departments
                    .filter((d) => d.name.trim().length > 0)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1"
                      >
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-[#0055A4] shrink-0" />
                          {d.name}
                        </p>
                        <p className="text-slate-600">
                          <strong>Responsável:</strong> {d.manager || 'Não informado'}
                        </p>
                        <div className="text-[11px] text-slate-500 flex flex-col gap-0.5">
                          {d.phone && <span>Tel: {d.phone}</span>}
                          {d.email && <span>Email: {d.email}</span>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Ao confirmar, os dados de setores e contatos ficarão acessíveis para a consultoria
                  técnica e você terá acesso completo ao painel de certificações e pipes
                  operacionais.
                </p>
              </div>
            </div>

            {submitting && (
              <div className="flex items-center justify-center gap-2 py-3 text-sm text-[#0055A4] font-medium bg-blue-50 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                Configurando templates, setores e ambiente da sua empresa...
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                disabled={submitting}
                className="min-h-[42px] whitespace-nowrap"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5 shrink-0" /> Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#00A86B] hover:bg-emerald-600 text-white min-h-[42px] px-8 font-semibold shadow-sm whitespace-nowrap"
              >
                {submitting ? 'Processando...' : 'Confirmar e Iniciar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
