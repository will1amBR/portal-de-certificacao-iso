import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutTemplate, ChevronRight, CheckCircle2, Clock, FileText, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, Certification } from '@/services/certifications'
import { getTemplatesByBusinessModel, Template } from '@/services/templates'
import { getBusinessModel } from '@/services/business_models'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Templates() {
  const { user } = useAuth()
  const [certs, setCerts] = useState<Certification[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [modelName, setModelName] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const all = await getCertifications()
      const userCerts = user?.role === 'cliente' ? all.filter((c) => c.user === user?.id) : all
      setCerts(userCerts)

      if (user?.business_model) {
        const [model, tpls] = await Promise.all([
          getBusinessModel(user.business_model),
          getTemplatesByBusinessModel(user.business_model),
        ])
        setModelName(model.name)
        setTemplates(tpls)
      }
    } catch {
      /* noop */
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('tasks', () => load())
  useRealtime('documents', () => load())

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  const taskCount = templates.filter((t) => t.type === 'task').length
  const docCount = templates.filter((t) => t.type === 'document').length
  const schedCount = templates.filter((t) => t.type === 'schedule').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <LayoutTemplate className="h-6 w-6 text-[#0055A4]" />
          Meus Modelos
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Templates aplicados com base no seu modelo de negócio
          {modelName && <span className="font-medium text-slate-700">: {modelName}</span>}
        </p>
      </div>

      {templates.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{taskCount}</p>
                <p className="text-xs text-slate-500">Tarefas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{docCount}</p>
                <p className="text-xs text-slate-500">Documentos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{schedCount}</p>
                <p className="text-xs text-slate-500">Agendamentos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Templates por Certificação</h2>
        {certs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-slate-500">
              Nenhuma certificação encontrada. Crie uma certificação para aplicar os templates.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {certs.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {c.expand?.iso_type?.name || 'Certificação'}
                    </p>
                    <p className="text-xs text-slate-500">{c.company_name || 'Empresa'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={c.template_applied ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {c.template_applied ? 'Templates aplicados' : 'Sem templates'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                  <Link to={`/certificacoes/${c.id}`}>
                    <Button variant="ghost" size="sm">
                      Gerenciar <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {templates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Lista de Templates</h2>
          <div className="space-y-2">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
              >
                {t.type === 'task' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                {t.type === 'document' && <FileText className="h-4 w-4 text-amber-600" />}
                {t.type === 'schedule' && <Calendar className="h-4 w-4 text-purple-600" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{t.title}</p>
                  {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
                </div>
                {t.due_days > 0 && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.due_days}d
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
