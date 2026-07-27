import { useState, useEffect } from 'react'
import { BusinessModel, createBusinessModel, updateBusinessModel } from '@/services/business_models'
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
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  model: BusinessModel | null
  onSaved: () => void
}

export function BusinessModelDialog({ open, onOpenChange, model, onSaved }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(model?.name || '')
      setDescription(model?.description || '')
      setIcon(model?.icon || '')
      setErrors({})
    }
  }, [open, model])

  const handleSave = async () => {
    setSaving(true)
    setErrors({})
    try {
      const data = { name, description, icon }
      if (model) {
        await updateBusinessModel(model.id, data)
        toast.success('Modelo atualizado')
      } else {
        await createBusinessModel(data)
        toast.success('Modelo criado')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Erro ao salvar modelo')
    }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{model ? 'Editar Modelo' : 'Novo Modelo de Negócio'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="bm-name">Nome</Label>
            <Input
              id="bm-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Indústria"
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bm-desc">Descrição</Label>
            <Textarea
              id="bm-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o modelo de negócio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bm-icon">Ícone (emoji ou nome lucide-react)</Label>
            <Input
              id="bm-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ex: 🏭 ou Factory"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name}
            className="bg-[#0055A4] hover:bg-[#1A73E8]"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
