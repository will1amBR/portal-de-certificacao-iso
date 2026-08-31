import { useState, useEffect } from 'react'
import { Template, createTemplate, updateTemplate } from '@/services/templates'
import { BusinessModel, getBusinessModels } from '@/services/business_models'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import { CheckCircle2, FileText, Calendar, Layers, Clock, Sparkles } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
  businessModelId?: string
  businessModels?: BusinessModel[]
  onSaved: () => void
}

export const CATEGORIES_CONFIG: { value: string; label: string; group: string }[] = [
  { value: 'qualidade', label: 'Qualidade (ISO 9001)', group: 'Normas de Gestão' },
  { value: 'meio ambiente', label: 'Meio Ambiente (ISO 14001)', group: 'Normas de Gestão' },
  {
    value: 'saúde e segurança',
    label: 'Saúde e Segurança (ISO 45001 / NR-1)',
    group: 'Normas de Gestão',
  },
  { value: 'indicadores', label: 'Indicadores & Metas', group: 'Auditoria & Monitoramento' },
  {
    value: 'licenças e documentos',
    label: 'Licenças e Documentos Regulatórios',
    group: 'Auditoria & Monitoramento',
  },
  { value: 'cotação', label: 'Cotação & Suprimentos', group: 'Operações' },
  { value: 'controle de estoque', label: 'Controle de Estoque & Materiais', group: 'Operações' },
  { value: 'renovação', label: 'Renovação Contratual & Alvarás', group: 'Operações' },
  {
    value: 'gestão de funcionários',
    label: 'Gestão de Pessoas & Competências (NR-27)',
    group: 'Operações',
  },
  { value: 'outro', label: 'Outro', group: 'Geral' },
]

export function TemplateDialog({
  open,
  onOpenChange,
  template,
  businessModelId,
  businessModels: propBusinessModels,
  onSaved,
}: Props) {
  const [selectedModelId, setSelectedModelId] = useState('')
  const [modelsList, setModelsList] = useState<BusinessModel[]>([])
  const [type, setType] = useState<'task' | 'document' | 'schedule'>('task')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('qualidade')
  const [required, setRequired] = useState(false)
  const [dueDays, setDueDays] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  // Carrega lista de modelos de negócio caso não tenham sido passados
  useEffect(() => {
    if (propBusinessModels && propBusinessModels.length > 0) {
      setModelsList(propBusinessModels)
    } else if (open) {
      getBusinessModels()
        .then(setModelsList)
        .catch(() => {})
    }
  }, [open, propBusinessModels])

  useEffect(() => {
    if (open) {
      setSelectedModelId(businessModelId || template?.business_model || (modelsList[0]?.id ?? ''))
      setType(template?.type || 'task')
      setTitle(template?.title || '')
      setDescription(template?.description || '')
      setCategory(template?.category || 'qualidade')
      setRequired(template?.required ?? false)
      setDueDays(template?.due_days ? String(template.due_days) : '0')
      setErrors({})
    }
  }, [open, template, businessModelId, modelsList])

  const handleSave = async () => {
    const finalModelId = selectedModelId || businessModelId
    if (!finalModelId) {
      toast.error('Selecione um Modelo de Negócio para o template')
      return
    }

    if (!title.trim()) {
      toast.error('Informe o título do template')
      return
    }

    setSaving(true)
    setErrors({})
    try {
      const data = {
        business_model: finalModelId,
        type,
        title: title.trim(),
        description: description.trim(),
        category,
        required,
        due_days: dueDays ? Number(dueDays) : 0,
      }

      if (template) {
        await updateTemplate(template.id, data)
        toast.success('Template atualizado com sucesso')
      } else {
        await createTemplate(data)
        toast.success('Template criado com sucesso')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Erro ao salvar template. Verifique os campos.')
    }
    setSaving(false)
  }

  // Sugestões rápidas de ISO no título para o auditor
  const quickIsoTags = [
    '(ISO 9001)',
    '(ISO 14001)',
    '(ISO 45001)',
    '(ISO 22000)',
    '(ISO 27001)',
    '(NR-1)',
    '(NR-27)',
  ]

  const addIsoTag = (tag: string) => {
    if (!title.includes(tag)) {
      setTitle((prev) => (prev ? `${prev} ${tag}` : tag))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 text-lg">
            <Sparkles className="h-5 w-5 text-[#0055A4]" />
            {template ? 'Editar Template de Auditoria' : 'Novo Template de Auditoria'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Modelo de Negócio */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              Modelo de Negócio (Segmento)
            </Label>
            <Select
              value={selectedModelId}
              onValueChange={setSelectedModelId}
              disabled={!!businessModelId && !template}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o Modelo de Negócio..." />
              </SelectTrigger>
              <SelectContent>
                {modelsList.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.business_model && (
              <p className="text-xs text-rose-500">{errors.business_model}</p>
            )}
          </div>

          {/* Tipo de Template */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Tipo de Atividade</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('task')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  type === 'task'
                    ? 'border-[#0055A4] bg-blue-50 text-[#0055A4] shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Tarefa
              </button>
              <button
                type="button"
                onClick={() => setType('document')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  type === 'document'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileText className="h-4 w-4 text-amber-600" />
                Documento
              </button>
              <button
                type="button"
                onClick={() => setType('schedule')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  type === 'schedule'
                    ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Calendar className="h-4 w-4 text-purple-600" />
                Agendamento
              </button>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="tpl-title" className="text-xs font-semibold text-slate-700">
                Título do Item <span className="text-rose-500">*</span>
              </Label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">Atalhos de norma:</span>
                {quickIsoTags.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addIsoTag(t)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-[#0055A4] transition-colors"
                  >
                    {t.replace(/[()]/g, '')}
                  </button>
                ))}
              </div>
            </div>
            <Input
              id="tpl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mapeamento de Riscos e Oportunidades (ISO 9001)"
              className="text-sm"
            />
            {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* Categoria e Prazo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Categoria & Norma</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CATEGORIES_CONFIG.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="tpl-due"
                className="text-xs font-semibold text-slate-700 flex items-center gap-1"
              >
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Prazo Sugerido (dias após início)
              </Label>
              <Input
                id="tpl-due"
                type="number"
                min="0"
                value={dueDays}
                onChange={(e) => setDueDays(e.target.value)}
                placeholder="Ex: 15 (0 para imediato)"
                className="text-sm"
              />
            </div>
          </div>

          {/* Descrição e Orientações para o Cliente */}
          <div className="space-y-1.5">
            <Label htmlFor="tpl-desc" className="text-xs font-semibold text-slate-700">
              Orientações para o Cliente e Requisitos da Auditoria
            </Label>
            <Textarea
              id="tpl-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descreva detalhadamente o que deve ser elaborado, evidenciado ou verificado na auditoria..."
              className="text-sm"
            />
          </div>

          {/* Switch de Obrigatório */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <div className="space-y-0.5">
              <Label
                htmlFor="tpl-req"
                className="text-xs font-semibold text-slate-800 cursor-pointer"
              >
                Item Obrigatório para Certificação
              </Label>
              <p className="text-[11px] text-slate-500">
                O cliente não poderá concluir o processo sem cumprir ou anexar este item.
              </p>
            </div>
            <Switch checked={required} onCheckedChange={setRequired} id="tpl-req" />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="bg-[#0055A4] hover:bg-[#1A73E8] text-white"
          >
            {saving ? 'Salvando...' : template ? 'Atualizar Template' : 'Criar Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
