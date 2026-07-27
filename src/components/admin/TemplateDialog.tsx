import { useState, useEffect } from 'react'
import { Template, createTemplate, updateTemplate } from '@/services/templates'
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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
  businessModelId: string
  onSaved: () => void
}

const CATEGORIES = [
  'cotação',
  'controle de estoque',
  'renovação',
  'gestão de funcionários',
  'outro',
]
const TYPES = ['task', 'document', 'schedule']

export function TemplateDialog({ open, onOpenChange, template, businessModelId, onSaved }: Props) {
  const [type, setType] = useState('task')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('outro')
  const [required, setRequired] = useState(false)
  const [dueDays, setDueDays] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setType(template?.type || 'task')
      setTitle(template?.title || '')
      setDescription(template?.description || '')
      setCategory(template?.category || 'outro')
      setRequired(template?.required ?? false)
      setDueDays(template?.due_days ? String(template.due_days) : '')
      setErrors({})
    }
  }, [open, template])

  const handleSave = async () => {
    setSaving(true)
    setErrors({})
    try {
      const data = {
        business_model: businessModelId,
        type: type as 'task' | 'document' | 'schedule',
        title,
        description,
        category: category as any,
        required,
        due_days: dueDays ? Number(dueDays) : 0,
      }
      if (template) {
        await updateTemplate(template.id, data)
        toast.success('Template atualizado')
      } else {
        await createTemplate(data)
        toast.success('Template criado')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Erro ao salvar template')
    }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{template ? 'Editar Template' : 'Novo Template'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tpl-title">Título</Label>
            <Input
              id="tpl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Checklist de cotação"
            />
            {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tpl-desc">Descrição</Label>
            <Textarea
              id="tpl-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tpl-due">Prazo (dias)</Label>
              <Input
                id="tpl-due"
                type="number"
                value={dueDays}
                onChange={(e) => setDueDays(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={required} onCheckedChange={setRequired} id="tpl-req" />
            <Label htmlFor="tpl-req">Obrigatório</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title}
            className="bg-[#0055A4] hover:bg-[#1A73E8]"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
