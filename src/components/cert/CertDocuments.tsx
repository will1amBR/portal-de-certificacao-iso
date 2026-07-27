import { useState, useEffect } from 'react'
import { FileText, CheckCircle2, XCircle, Download, FileSpreadsheet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getDocumentsByCertification,
  bulkDocumentAction,
  getDocumentUrl,
  IsoDocument,
} from '@/services/documents'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { exportToCsv } from '@/lib/export'
import { toast } from 'sonner'
import { UploadDocumentDialog } from '@/components/UploadDocumentDialog'

export function CertDocuments({ certId }: { certId: string }) {
  const { user } = useAuth()
  const [docs, setDocs] = useState<IsoDocument[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectComment, setRejectComment] = useState('')

  const load = async () => {
    setDocs(await getDocumentsByCertification(certId))
  }
  useEffect(() => {
    load()
  }, [certId])
  useRealtime('documents', () => {
    load()
  })

  const canManage = user?.role === 'admin' || user?.role === 'consultor'
  const toggle = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }
  const toggleAll = () =>
    setSelected(selected.size === docs.length ? new Set() : new Set(docs.map((d) => d.id)))

  const handleBulk = async (action: 'approve' | 'reject') => {
    const ids = Array.from(selected)
    const comment = action === 'reject' ? rejectComment : ''
    try {
      await bulkDocumentAction(ids, action, comment)
      toast.success(
        `${ids.length} documento(s) ${action === 'approve' ? 'aprovado(s)' : 'rejeitado(s)'}`,
      )
      setSelected(new Set())
      setRejectOpen(false)
      setRejectComment('')
      load()
    } catch {
      toast.error('Erro ao processar ação')
    }
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      aprovado: 'bg-emerald-600',
      rejeitado: 'bg-red-500',
      enviado: 'bg-blue-600',
      pendente: 'bg-slate-400',
    }
    return <Badge className={map[s] || 'bg-slate-400'}>{s}</Badge>
  }

  const handleCsv = () => {
    exportToCsv(
      `documentos-${certId}.csv`,
      docs.map((d) => ({
        Nome: d.name,
        Status: d.status,
        Categoria: d.category,
        Obrigatório: d.required ? 'Sim' : 'Não',
        Comentário: d.comment || '',
      })),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <UploadDocumentDialog certificationId={certId} onUploaded={load} />
        <Button variant="outline" size="sm" onClick={handleCsv}>
          <FileSpreadsheet className="h-4 w-4 mr-1.5" />
          CSV
        </Button>
      </div>

      {docs.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nenhum documento enviado.</p>
      ) : (
        <div className="space-y-2">
          {canManage && (
            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                checked={selected.size === docs.length && docs.length > 0}
                onCheckedChange={toggleAll}
              />
              <span className="text-xs text-slate-500">Selecionar todos</span>
            </div>
          )}
          {docs.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
            >
              {canManage && (
                <Checkbox checked={selected.has(d.id)} onCheckedChange={() => toggle(d.id)} />
              )}
              <FileText className="h-5 w-5 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{d.name}</p>
                <p className="text-xs text-slate-400 capitalize">{d.category}</p>
                {d.comment && <p className="text-xs text-slate-500 mt-0.5">{d.comment}</p>}
              </div>
              {d.file && (
                <a
                  href={getDocumentUrl(d)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0055A4] hover:text-blue-700"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
              {statusBadge(d.status)}
            </div>
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-slate-200 rounded-xl shadow-lg px-5 py-3">
          <span className="text-sm font-medium text-slate-700">{selected.size} selecionado(s)</span>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleBulk('approve')}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" /> Aprovar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setRejectOpen(true)}>
            <XCircle className="h-4 w-4 mr-1" /> Rejeitar
          </Button>
        </div>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Rejeitar Documentos</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Motivo da rejeição (opcional)..."
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleBulk('reject')}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
