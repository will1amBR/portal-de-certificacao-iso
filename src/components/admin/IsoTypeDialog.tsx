import { useState, useEffect } from 'react'
import { createIsoType, updateIsoType, IsoType } from '@/services/iso_types'
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
  isoType: IsoType | null
  onSaved: () => void
}

export function IsoTypeDialog({ open, onOpenChange, isoType, onSaved }: Props) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(isoType?.name || '')
      setCode(isoType?.code || '')
      setDescription(isoType?.description || '')
      setIcon(isoType?.icon || '')
      setErrors({})
    }
  }, [open, isoType])

  const handleSave = async () => {
    setSaving(true)
    setErrors({})
    try {
      const data = { name, code, description, icon }
      if (isoType) {
        await updateIsoType(isoType.id, data)
        toast.success('Tipo ISO atualizado')
      } else {
        await createIsoType(data)
        toast.success('Tipo ISO criado')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Erro ao salvar tipo ISO')
    }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isoType ? 'Editar Tipo ISO' : 'Novo Tipo ISO'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="iso-name">Nome</Label>
            <Input
              id="iso-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Gestão da Qualidade"
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="iso-code">Código</Label>
            <Input
              id="iso-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: 9001"
            />
            {errors.code && <p className="text-xs text-rose-500">{errors.code}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="iso-desc">Descrição</Label>
            <Textarea
              id="iso-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a norma ISO"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iso-icon">Ícone (emoji ou nome lucide-react)</Label>
            <Input
              id="iso-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ex: 📋 ou ShieldCheck"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name || !code}
            className="bg-[#0055A4] hover:bg-[#1A73E8]"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
