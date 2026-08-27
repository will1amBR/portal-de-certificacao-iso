import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Printer, ChevronLeft, FileText, CheckCircle2, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { getBusinessModel, BusinessModel } from '@/services/business_models'
import { getTemplatesByBusinessModel, Template } from '@/services/templates'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OnboardingReport() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userRecord, setUserRecord] = useState<any>(null)
  const [model, setModel] = useState<BusinessModel | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      try {
        const record = await pb.collection('users').getOne(user.id, { expand: 'business_model' })
        setUserRecord(record)
        const bmId = record.business_model || record.expand?.business_model?.id
        if (bmId) {
          const [m, tpls] = await Promise.all([
            getBusinessModel(bmId),
            getTemplatesByBusinessModel(bmId),
          ])
          setModel(m)
          setTemplates(tpls)
        }
      } catch {
        /* noop */
      }
      setLoading(false)
    }
    load()
  }, [user?.id])

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const taskTemplates = templates.filter((t) => t.type === 'task')
  const docTemplates = templates.filter((t) => t.type === 'document')
  const schedTemplates = templates.filter((t) => t.type === 'schedule')
  const onboardingDate = userRecord?.updated || userRecord?.created || new Date().toISOString()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar
        </button>
        <Button onClick={() => window.print()} className="bg-[#0055A4] hover:bg-[#1A73E8]">
          <Printer className="h-4 w-4" /> Imprimir / Salvar como PDF
        </Button>
      </div>

      <Card className="print:border-0 print:shadow-none">
        <CardContent className="p-8">
          <div className="border-b-2 border-[#003B73] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#003B73] text-white font-black">ISO</div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Relatório de Onboarding</h1>
                <p className="text-sm text-slate-500">Portal de Certificação ISO</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-slate-400 font-medium">Cliente</p>
              <p className="text-sm font-semibold text-slate-900">
                {userRecord?.name || user?.name || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">E-mail</p>
              <p className="text-sm font-semibold text-slate-900">
                {userRecord?.email || user?.email || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">CNPJ</p>
              <p className="text-sm font-semibold text-slate-900">{userRecord?.cnpj || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Modelo de Negócio</p>
              <p className="text-sm font-semibold text-slate-900">{model?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Data de Onboarding</p>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(onboardingDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <ReportSection
            icon={CheckCircle2}
            title="Tarefas Configuradas"
            items={taskTemplates}
            color="text-blue-600"
          />
          <ReportSection
            icon={FileText}
            title="Documentos Configurados"
            items={docTemplates}
            color="text-amber-600"
          />
          <ReportSection
            icon={Calendar}
            title="Agendamentos Configurados"
            items={schedTemplates}
            color="text-purple-600"
          />

          <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
            Relatório gerado em {new Date().toLocaleDateString('pt-BR')} • Portal de Certificação
            ISO
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportSection({
  icon: Icon,
  title,
  items,
  color,
}: {
  icon: any
  title: string
  items: Template[]
  color: string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <h2 className="text-sm font-bold text-slate-700">{title}</h2>
        <span className="text-xs text-slate-400">({items.length})</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 pl-6">Nenhum item.</p>
      ) : (
        <ul className="pl-6 space-y-1">
          {items.map((t) => (
            <li key={t.id} className="text-sm text-slate-700">
              <span className="font-medium">{t.title}</span>
              {t.description && <span className="text-slate-400"> - {t.description}</span>}
              {t.due_days ? (
                <span className="text-slate-400"> (prazo: {t.due_days} dias)</span>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
