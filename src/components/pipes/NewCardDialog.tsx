import { useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createCard, PipeCard } from '@/services/cards'
import { toast } from 'sonner'

interface NewCardDialogProps {
  pipeId: string
  defaultStage: string
  stages: string[]
  certId?: string
  onCreated?: () => void
  trigger?: React.ReactNode
}

export function NewCardDialog({
  pipeId,
  defaultStage,
  stages,
  certId,
  onCreated,
  trigger,
}: NewCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [origin, setOrigin] = useState('Auditoria Interna')
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState(defaultStage || stages[0] || 'Ação Imediata')
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta' | 'crítica'>('média')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (val) {
      // auto generate an ID-like code if empty
      if (!title) {
        setTitle(Math.floor(100000000 + Math.random() * 900000000).toString())
      }
      setStage(defaultStage || stages[0] || '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Informe o identificador ou título do card')
      return
    }

    setLoading(true)
    try {
      await createCard({
        pipe: pipeId,
        certification: certId || undefined,
        title,
        origin: origin || 'Portal ISO',
        description,
        stage: stage || defaultStage || stages[0],
        priority,
        due_date: dueDate || undefined,
      })
      toast.success('Card criado com sucesso!')
      setOpen(false)
      setTitle('')
      setDescription('')
      setDueDate('')
      if (onCreated) onCreated()
    } catch {
      toast.error('Erro ao criar card')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#0055A4] hover:bg-[#004080] text-white shadow-sm font-semibold text-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Criar novo card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Criar Novo Card
          </DialogTitle>
          <DialogDescription>
            Insira os dados do item para movimentar no fluxo do pipe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="card-title">Código / Número do Card *</Label>
            <Input
              id="card-title"
              placeholder="Ex: 1403952947 ou NC-02"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-origin">Origem</Label>
              <Input
                id="card-origin"
                placeholder="Ex: Auditoria Interna, Obra"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="card-stage">Fase Inicial</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-priority">Prioridade</Label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="card-due">Prazo / Vencimento</Label>
              <Input
                id="card-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="card-desc">Descrição / Detalhes</Label>
            <Textarea
              id="card-desc"
              placeholder="Descreva a não-conformidade, tarefa ou evidência..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0055A4] hover:bg-[#004080]" disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
