import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { createSchedule } from '@/services/schedules'
import { toast } from 'sonner'

interface ScheduleModalProps {
  certificationId: string
  onScheduled?: () => void
}

export function ScheduleModal({ certificationId, onScheduled }: ScheduleModalProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'auditoria' | 'reunião'>('reunião')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      toast.error('Informe a data desejada')
      return
    }

    setLoading(true)
    try {
      await createSchedule({
        certification: certificationId,
        type,
        date: new Date(date).toISOString(),
        notes,
      })
      toast.success('Agendamento solicitado com sucesso!')
      setOpen(false)
      setDate('')
      setNotes('')
      if (onScheduled) onScheduled()
    } catch (err: any) {
      toast.error('Erro ao agendar: ' + (err?.message || 'Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00A86B] hover:bg-emerald-600 text-white gap-2 font-medium">
          <CalendarIcon className="h-4 w-4" />
          Solicitar Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Solicitar Reunião ou Auditoria</DialogTitle>
          <DialogDescription>
            Escolha o tipo de compromisso, data e horário pretendidos com o consultor responsável.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Tipo de Agendamento</Label>
            <Select value={type} onValueChange={(val: 'auditoria' | 'reunião') => setType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reunião">Reunião de Alinhamento / Consultoria</SelectItem>
                <SelectItem value="auditoria">Auditoria Interna / Externa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedDate">Data e Hora Preferenciais</Label>
            <Input
              id="schedDate"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedNotes">Observações ou Pauta</Label>
            <Textarea
              id="schedNotes"
              placeholder="Descreva o objetivo da reunião ou os itens a serem verificados..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#00A86B] hover:bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? 'Solicitando...' : 'Enviar Solicitação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
