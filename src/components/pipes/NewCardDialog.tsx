import { useState, useEffect } from 'react'
import { Plus, Tag, Building, UserCheck, Phone, Mail } from 'lucide-react'
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
import { getAllUsers, CompanyDepartment } from '@/services/users'
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

  // Sector & Responsible linking from onboarding
  const [departments, setDepartments] = useState<CompanyDepartment[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState<string>('')
  const [deptName, setDeptName] = useState('')
  const [deptManager, setDeptManager] = useState('')
  const [deptPhone, setDeptPhone] = useState('')
  const [deptEmail, setDeptEmail] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      getAllUsers()
        .then((users) => {
          // Find client with departments
          const clientWithDepts = users.find(
            (u) => u.departments && Array.isArray(u.departments) && u.departments.length > 0,
          )
          if (clientWithDepts?.departments) {
            setDepartments(clientWithDepts.departments)
          }
        })
        .catch(() => {})
    }
  }, [open])

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (val) {
      if (!title) {
        setTitle(Math.floor(100000000 + Math.random() * 900000000).toString())
      }
      setStage(defaultStage || stages[0] || '')
    }
  }

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDeptId(deptId)
    const found = departments.find((d) => d.id === deptId)
    if (found) {
      setDeptName(found.name)
      setDeptManager(found.manager || '')
      setDeptPhone(found.phone || '')
      setDeptEmail(found.email || '')
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
      const cardData: Record<string, any> = {}
      if (deptName) {
        cardData.department_name = deptName
        cardData.department_manager = deptManager
        cardData.department_phone = deptPhone
        cardData.department_email = deptEmail
        cardData.assigned_sector = deptName
      }

      await createCard({
        pipe: pipeId,
        certification: certId || undefined,
        title,
        origin: origin || 'Portal ISO',
        description,
        stage: stage || defaultStage || stages[0],
        priority,
        due_date: dueDate || undefined,
        data: cardData,
      })
      toast.success('Card criado com sucesso!')
      setOpen(false)
      setTitle('')
      setDescription('')
      setDueDate('')
      setDeptName('')
      setDeptManager('')
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Criar Novo Card
          </DialogTitle>
          <DialogDescription>
            Insira os dados do item e atribua ao setor responsável do cliente.
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

          {/* SOLICITAÇÃO 3: Seleção de setor do Onboarding */}
          {departments.length > 0 && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
              <Label className="text-xs font-semibold text-blue-900 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-[#0055A4]" />
                Atribuir a Setor da Empresa (Onboarding)
              </Label>
              <Select value={selectedDeptId} onValueChange={handleDepartmentSelect}>
                <SelectTrigger className="bg-white text-xs h-8">
                  <SelectValue placeholder="Selecione o setor responsável..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-xs">
                      {d.name} {d.manager ? `(${d.manager})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {deptManager && (
                <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-1">
                  <UserCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>
                    Responsável: <strong>{deptManager}</strong> {deptEmail ? `(${deptEmail})` : ''}
                  </span>
                </div>
              )}
            </div>
          )}

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
