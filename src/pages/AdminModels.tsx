import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Settings, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getBusinessModels, deleteBusinessModel, BusinessModel } from '@/services/business_models'
import { getTemplatesByBusinessModel, deleteTemplate, Template } from '@/services/templates'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BusinessModelDialog } from '@/components/admin/BusinessModelDialog'
import { TemplateDialog } from '@/components/admin/TemplateDialog'
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
import { toast } from 'sonner'

export default function AdminModels() {
  const { user } = useAuth()
  const [models, setModels] = useState<BusinessModel[]>([])
  const [templatesMap, setTemplatesMap] = useState<Record<string, Template[]>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [bmDialogOpen, setBmDialogOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<BusinessModel | null>(null)
  const [tplDialogOpen, setTplDialogOpen] = useState(false)
  const [editingTpl, setEditingTpl] = useState<Template | null>(null)
  const [tplModelId, setTplModelId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    type: 'model' | 'template'
  } | null>(null)

  const load = async () => {
    try {
      const list = await getBusinessModels()
      setModels(list)
      const tMap: Record<string, Template[]> = {}
      await Promise.all(
        list.map(async (m) => {
          tMap[m.id] = await getTemplatesByBusinessModel(m.id)
        }),
      )
      setTemplatesMap(tMap)
    } catch {
      toast.error('Erro ao carregar dados')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('business_models', () => load())
  useRealtime('templates', () => load())

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      if (deleteTarget.type === 'model') {
        await deleteBusinessModel(deleteTarget.id)
        toast.success('Modelo excluído')
      } else {
        await deleteTemplate(deleteTarget.id)
        toast.success('Template excluído')
      }
    } catch {
      toast.error('Erro ao excluir')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#0055A4]" /> Gerenciar Modelos
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie modelos de negócio e templates</p>
        </div>
        <Button
          className="bg-[#0055A4] hover:bg-[#1A73E8]"
          onClick={() => {
            setEditingModel(null)
            setBmDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" /> Novo Modelo
        </Button>
      </div>

      <div className="space-y-3">
        {models.map((m) => {
          const isExpanded = expanded === m.id
          const tpls = templatesMap[m.id] || []
          return (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={
                      isExpanded ? 'Recolher detalhes do modelo' : 'Expandir detalhes do modelo'
                    }
                    onClick={() => setExpanded(isExpanded ? null : m.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.description}</p>
                  </div>
                  <Badge variant="secondary">{tpls.length} templates</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingModel(m)
                      setBmDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600"
                    onClick={() => setDeleteTarget({ id: m.id, type: 'model' })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-700">Templates</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTplModelId(m.id)
                          setEditingTpl(null)
                          setTplDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4" /> Adicionar Template
                      </Button>
                    </div>
                    {tpls.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">
                        Nenhum template cadastrado.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-slate-400 border-b">
                              <th className="pb-2 pr-3">Tipo</th>
                              <th className="pb-2 pr-3">Título</th>
                              <th className="pb-2 pr-3">Categoria</th>
                              <th className="pb-2 pr-3">Obrigatório</th>
                              <th className="pb-2 pr-3">Prazo (dias)</th>
                              <th className="pb-2">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tpls.map((t) => (
                              <tr key={t.id} className="border-b border-slate-50">
                                <td className="py-2 pr-3">
                                  <Badge variant="outline" className="text-xs">
                                    {t.type}
                                  </Badge>
                                </td>
                                <td className="py-2 pr-3 font-medium text-slate-800">{t.title}</td>
                                <td className="py-2 pr-3 text-slate-500">{t.category || '-'}</td>
                                <td className="py-2 pr-3">{t.required ? 'Sim' : 'Não'}</td>
                                <td className="py-2 pr-3 text-slate-500">{t.due_days || '-'}</td>
                                <td className="py-2">
                                  <button
                                    type="button"
                                    aria-label="Editar template"
                                    className="p-1.5 text-slate-400 hover:text-[#0055A4] mr-1 rounded-md min-w-[28px] min-h-[28px] inline-flex items-center justify-center transition-colors"
                                    onClick={() => {
                                      setTplModelId(m.id)
                                      setEditingTpl(t)
                                      setTplDialogOpen(true)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Excluir template"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md min-w-[28px] min-h-[28px] inline-flex items-center justify-center transition-colors"
                                    onClick={() => setDeleteTarget({ id: t.id, type: 'template' })}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <BusinessModelDialog
        open={bmDialogOpen}
        onOpenChange={setBmDialogOpen}
        model={editingModel}
        onSaved={() => load()}
      />
      <TemplateDialog
        open={tplDialogOpen}
        onOpenChange={setTplDialogOpen}
        template={editingTpl}
        businessModelId={tplModelId}
        onSaved={() => load()}
      />
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O item será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
