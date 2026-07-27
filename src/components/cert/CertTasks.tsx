import { useState, useEffect } from 'react'
import { Plus, Trash2, FileSpreadsheet, Calendar } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  getTasksByCertification,
  toggleTaskCompleted,
  createTask,
  deleteTask,
  IsoTask,
} from '@/services/tasks'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { exportToCsv } from '@/lib/export'
import { toast } from 'sonner'

export function CertTasks({ certId }: { certId: string }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<IsoTask[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setTasks(await getTasksByCertification(certId))
  }
  useEffect(() => {
    load()
  }, [certId])
  useRealtime('tasks', () => {
    load()
  })

  const canManage = user?.role === 'admin' || user?.role === 'consultor'

  const handleToggle = async (t: IsoTask) => {
    try {
      await toggleTaskCompleted(t.id, !t.completed)
      load()
    } catch {
      toast.error('Erro')
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await createTask({
        certification: certId,
        title,
        description: desc,
        due_date: due || undefined,
      })
      setTitle('')
      setDesc('')
      setDue('')
      setShowForm(false)
      load()
      toast.success('Tarefa criada')
    } catch {
      toast.error('Erro ao criar tarefa')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      load()
    } catch {
      toast.error('Erro')
    }
  }

  const handleCsv = () => {
    exportToCsv(
      `tarefas-${certId}.csv`,
      tasks.map((t) => ({
        Título: t.title,
        Descrição: t.description || '',
        Concluída: t.completed ? 'Sim' : 'Não',
        Prazo: t.due_date ? new Date(t.due_date).toLocaleDateString('pt-BR') : '',
      })),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {canManage && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" /> Nova Tarefa
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={handleCsv}>
          <FileSpreadsheet className="h-4 w-4 mr-1" />
          CSV
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
        >
          <Input
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Descrição (opcional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
          />
          <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-[#0055A4]">
              Adicionar
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nenhuma tarefa cadastrada.</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200"
            >
              <Checkbox
                checked={t.completed}
                onCheckedChange={() => handleToggle(t)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}
                >
                  {t.title}
                </p>
                {t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}
                {t.due_date && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{' '}
                    {new Date(t.due_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              {canManage && (
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
