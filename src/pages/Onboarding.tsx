import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Building2,
  Briefcase,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { getBusinessModels, BusinessModel } from '@/services/business_models'
import { updateUser } from '@/services/users'
import { instantiateTemplatesForUser } from '@/services/templates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

function maskCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
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
export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [cnpj, setCnpj] = useState('')
  const [models, setModels] = useState<BusinessModel[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user?.cnpj && user?.business_model) navigate('/dashboard')
  }, [user, navigate])

  useEffect(() => {
    getBusinessModels()
      .then(setModels)
      .catch(() => {})
  }, [])

  const cnpjValid = cnpj.replace(/\D/g, '').length === 14

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const cleanCnpj = cnpj.replace(/\D/g, '')
      await updateUser(user.id, {
        cnpj: cleanCnpj,
        business_model: selectedModel,
      } as any)
      await instantiateTemplatesForUser(user.id, selectedModel)

      // Refresh auth store so user has updated cnpj and business_model
      try {
        await pb.collection('users').authRefresh()
      } catch {
        /* if auth refresh fails, local values can persist */
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
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Configuração Inicial</h1>
        <p className="text-sm text-slate-500 mt-1">
          Precisamos de algumas informações para personalizar seu processo de certificação
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              step >= s ? 'bg-[#0055A4] w-12' : 'bg-slate-200 w-8'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Informe o CNPJ da sua empresa
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Usaremos para identificar sua empresa e personalizar os templates.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(maskCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="text-lg tracking-wide"
              />
              {cnpj.length > 0 && !cnpjValid && (
                <p className="text-xs text-amber-600">CNPJ deve conter 14 dígitos.</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!cnpjValid}
                className="bg-[#0055A4] hover:bg-[#1A73E8]"
              >
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Selecione o modelo de negócio
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Escolha a opção que melhor descreve sua empresa.
              </p>
            </div>
            <div className="space-y-3">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === m.id
                      ? 'border-[#0055A4] bg-sky-50/50 ring-1 ring-[#0055A4]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${selectedModel === m.id ? 'bg-[#0055A4] text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {iconMap[m.icon] || <Briefcase className="h-7 w-7" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-sm text-slate-500">{m.description}</p>
                  </div>
                  {selectedModel === m.id && <Check className="h-5 w-5 text-[#0055A4] mt-1" />}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedModel}
                className="bg-[#0055A4] hover:bg-[#1A73E8]"
              >
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && selectedModelObj && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Confirmação e início automático
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Revise os dados antes de confirmar. Templates serão criados automaticamente.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-slate-500">CNPJ</span>
                <span className="text-sm font-medium text-slate-900">{cnpj}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-slate-500">Modelo de Negócio</span>
                <span className="text-sm font-medium text-slate-900">{selectedModelObj.name}</span>
              </div>{' '}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  Serão criados templates de tarefas, documentos e agendamentos para suas
                  certificações ativas. Você poderá editar ou remover os itens a qualquer momento.
                </p>
              </div>
            </div>
            {submitting && (
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-[#0055A4]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando templates...
              </div>
            )}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} disabled={submitting}>
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#00A86B] hover:bg-emerald-600"
              >
                {submitting ? 'Processando...' : 'Confirmar e iniciar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
