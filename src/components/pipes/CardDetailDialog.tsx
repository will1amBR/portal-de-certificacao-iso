import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  AlertTriangle,
  MoveRight,
  ShieldCheck,
  User,
  Building,
  Phone,
  Mail,
  UserCheck,
  Tag,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PipeCard, updateCard, deleteCard, moveCardStage } from '@/services/cards'
import { getAllUsers, IsoUser, CompanyDepartment } from '@/services/users'
import { toast } from 'sonner'

interface CardDetailDialogProps {
  card: PipeCard | null
  stages: string[]
  pipeTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function CardDetailDialog({
  card,
  stages,
  pipeTitle,
  open,
  onOpenChange,
  onUpdated,
}: CardDetailDialogProps) {
  const [description, setDescription] = useState(card?.description || '')
  const [origin, setOrigin] = useState(card?.origin || '')
  const [priority, setPriority] = useState<string>(card?.priority || 'média')
  const [dueDate, setDueDate] = useState(card?.due_date ? card.due_date.split('T')[0] : '')

  // Department & Responsible assignment fields
  const [departmentName, setDepartmentName] = useState(card?.data?.department_name || '')
  const [departmentManager, setDepartmentManager] = useState(card?.data?.department_manager || '')
  const [departmentPhone, setDepartmentPhone] = useState(card?.data?.department_phone || '')
  const [departmentEmail, setDepartmentEmail] = useState(card?.data?.department_email || '')

  const [availableDepartments, setAvailableDepartments] = useState<CompanyDepartment[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (card) {
      setDescription(card.description || '')
      setOrigin(card.origin || '')
      setPriority(card.priority || 'média')
      setDueDate(card.due_date ? card.due_date.split('T')[0] : '')
      setDepartmentName(card.data?.department_name || card.data?.assigned_sector || '')
      setDepartmentManager(card.data?.department_manager || '')
      setDepartmentPhone(card.data?.department_phone || '')
      setDepartmentEmail(card.data?.department_email || '')

      // Load client departments if user is populated
      if (card.user) {
        getAllUsers()
          .then((users) => {
            const targetUser = users.find((u) => u.id === card.user)
            if (targetUser?.departments && Array.isArray(targetUser.departments)) {
              setAvailableDepartments(targetUser.departments)
            }
          })
          .catch(() => {})
      }
    }
  }, [card])

  if (!card) return null

  const handleStageChange = async (newStage: string) => {
    try {
      await moveCardStage(card.id, newStage)
      toast.success(`Card movido para "${newStage}"`)
      onUpdated()
    } catch {
      toast.error('Erro ao mover card')
    }
  }

  const handleSelectDepartment = (deptId: string) => {
    const found = availableDepartments.find((d) => d.id === deptId)
    if (found) {
      setDepartmentName(found.name)
      setDepartmentManager(found.manager || '')
      setDepartmentPhone(found.phone || '')
      setDepartmentEmail(found.email || '')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedData = {
        ...(card.data || {}),
        department_name: departmentName,
        department_manager: departmentManager,
        department_phone: departmentPhone,
        department_email: departmentEmail,
        assigned_sector: departmentName,
      }

      await updateCard(card.id, {
        origin,
        description,
        priority: priority as any,
        due_date: dueDate || undefined,
        data: updatedData,
      })
      toast.success('Card atualizado')
      onUpdated()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao atualizar card')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Deseja realmente excluir este card?')) return
    try {
      await deleteCard(card.id)
      toast.success('Card excluído com sucesso')
      onOpenChange(false)
      onUpdated()
    } catch {
      toast.error('Erro ao excluir card')
    }
  }

  const getPriorityBadge = (p?: string) => {
    switch (p) {
      case 'crítica':
        return <Badge className="bg-red-600 text-white">Crítica</Badge>
      case 'alta':
        return <Badge className="bg-orange-500 text-white">Alta</Badge>
      case 'média':
        return <Badge className="bg-blue-600 text-white">Média</Badge>
      case 'baixa':
        return <Badge variant="secondary">Baixa</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {pipeTitle || 'Processo ISO'}
              </span>
              <span className="text-sm text-slate-500 font-mono">#{card.title}</span>
            </div>
            {getPriorityBadge(card.priority)}
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 mt-2">
            Card: {card.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Phase mover bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Fase Atual:</span>
              <Badge className="bg-[#0055A4] text-white text-xs">{card.stage}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Mover para:</span>
              <Select value={card.stage} onValueChange={handleStageChange}>
                <SelectTrigger className="w-44 h-8 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SOLICITAÇÃO 3: Vínculo com Setor & Responsável do Onboarding */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Building className="h-3.5 w-3.5 text-[#0055A4]" />
                Setor e Responsável Atribuído (Onboarding)
              </span>

              {availableDepartments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Selecionar setor:</span>
                  <Select onValueChange={handleSelectDepartment}>
                    <SelectTrigger className="h-7 text-[11px] bg-white border-blue-200 w-48">
                      <SelectValue placeholder="Escolher setor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((d) => (
                        <SelectItem key={d.id} value={d.id} className="text-xs">
                          {d.name} {d.manager ? `(${d.manager})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="c-dept" className="text-[11px] font-medium text-slate-600">
                  Nome do Setor / Área
                </Label>
                <Input
                  id="c-dept"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder="Ex: Garantia da Qualidade, SESMT..."
                  className="h-8 text-xs bg-white font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="c-mgr"
                  className="text-[11px] font-medium text-slate-600 flex items-center gap-1"
                >
                  <UserCheck className="h-3 w-3 text-emerald-600" /> Responsável Direto
                </Label>
                <Input
                  id="c-mgr"
                  value={departmentManager}
                  onChange={(e) => setDepartmentManager(e.target.value)}
                  placeholder="Nome do gestor responsável"
                  className="h-8 text-xs bg-white font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="c-phone"
                  className="text-[11px] font-medium text-slate-600 flex items-center gap-1"
                >
                  <Phone className="h-3 w-3 text-slate-400" /> Telefone / WhatsApp
                </Label>
                <Input
                  id="c-phone"
                  value={departmentPhone}
                  onChange={(e) => setDepartmentPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="h-8 text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="c-email"
                  className="text-[11px] font-medium text-slate-600 flex items-center gap-1"
                >
                  <Mail className="h-3 w-3 text-slate-400" /> E-mail de Notificação
                </Label>
                <Input
                  id="c-email"
                  type="email"
                  value={departmentEmail}
                  onChange={(e) => setDepartmentEmail(e.target.value)}
                  placeholder="responsavel@empresa.com"
                  className="h-8 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-origin">Origem da Demanda / Não-Conformidade</Label>
              <Input
                id="c-origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ex: Auditoria Interna, Fornecedor..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="c-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-due">Data de Vencimento / Prazo</Label>
              <Input
                id="c-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Criado em</Label>
              <div className="text-xs text-slate-500 py-2.5 px-3 bg-slate-100 rounded-md border border-slate-200">
                {new Date(card.created).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Descrição / Análise / Ações Adotadas</Label>
            <Textarea
              id="c-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhamento técnico, causa raiz (5 porquês / Ishikawa) ou evidências..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Excluir Card
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-[#0055A4] hover:bg-[#004080]"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
