import { useState } from 'react'
import { Plus, FolderPlus } from 'lucide-react'
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
import { createPipe, Pipe } from '@/services/pipes'
import { toast } from 'sonner'

interface NewPipeDialogProps {
  onCreated?: () => void
  trigger?: React.ReactNode
}

export function NewPipeDialog({ onCreated, trigger }: NewPipeDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [stagesText, setStagesText] = useState('Triagem, Em Análise, Em Execução, Concluído')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Informe o título do pipe')
      return
    }

    const stages = stagesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (stages.length === 0) {
      toast.error('Informe ao menos um estágio/coluna')
      return
    }

    setLoading(true)
    try {
      await createPipe({
        title,
        code: code || undefined,
        description: description || undefined,
        icon: 'SquarePen',
        color: 'bg-blue-600 text-white',
        stages,
        order: 99,
      })
      toast.success('Pipe criado com sucesso!')
      setOpen(false)
      setTitle('')
      setCode('')
      setDescription('')
      if (onCreated) onCreated()
    } catch {
      toast.error('Erro ao criar pipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#0055A4] hover:bg-[#004080]">
            <Plus className="h-4 w-4 mr-1.5" /> Criar pipe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-blue-600" />
            Criar Novo Pipe
          </DialogTitle>
          <DialogDescription>
            Crie um novo fluxo de processo ISO ou módulo Kanban.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="pipe-title">Nome do Pipe / Cláusula ISO *</Label>
            <Input
              id="pipe-title"
              placeholder="Ex: 8.4 Controle de Fornecedores"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pipe-code">Código da Cláusula (Opcional)</Label>
            <Input
              id="pipe-code"
              placeholder="Ex: 8.4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pipe-desc">Descrição do Processo</Label>
            <Textarea
              id="pipe-desc"
              placeholder="Objetivo e escopo deste fluxo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pipe-stages">Estágios do Kanban (separados por vírgula)</Label>
            <Input
              id="pipe-stages"
              value={stagesText}
              onChange={(e) => setStagesText(e.target.value)}
              placeholder="Fase 1, Fase 2, Fase 3, Concluído"
            />
            <p className="text-xs text-slate-500">
              Esses nomes serão as colunas do seu quadro kanban.
            </p>
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
              {loading ? 'Criando...' : 'Criar Pipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
