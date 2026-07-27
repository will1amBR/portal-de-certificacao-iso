import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
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
import { createDocument } from '@/services/documents'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'

interface UploadDocumentDialogProps {
  certificationId: string
  docName?: string
  onUploaded?: () => void
}

export function UploadDocumentDialog({
  certificationId,
  docName,
  onUploaded,
}: UploadDocumentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(docName || '')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Informe o nome do documento')
      return
    }
    if (!file) {
      toast.error('Selecione um arquivo para envio')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('certification', certificationId)
      formData.append('user', pb.authStore.record?.id || '')
      formData.append('name', name.trim())
      formData.append('required', 'true')
      formData.append('status', 'enviado')
      formData.append('file', file)

      await createDocument(formData)
      toast.success('Documento enviado com sucesso para análise!')
      setOpen(false)
      setName('')
      setFile(null)
      if (onUploaded) onUploaded()
    } catch (err: any) {
      toast.error(
        'Erro ao enviar documento: ' +
          (err?.message || 'Verifique o tamanho ou formato do arquivo.'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#0055A4] hover:bg-[#1A73E8] text-white gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Enviar Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Enviar Documento para Certificação</DialogTitle>
          <DialogDescription>
            Envie arquivos PDF, DOCX ou Imagens (até 10MB) para verificação pela consultoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="docTitle">Nome do Documento / Identificação</Label>
            <Input
              id="docTitle"
              placeholder="Ex: Política da Qualidade Assinada"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileInput">Selecione o Arquivo</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors">
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center gap-1.5"
              >
                <FileText className="h-8 w-8 text-[#0055A4]" />
                <span className="text-sm font-medium text-slate-700">
                  {file ? file.name : 'Clique para selecionar o arquivo'}
                </span>
                <span className="text-xs text-slate-400">PDF, Word ou Imagem até 10MB</span>
              </label>
            </div>
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
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Confirmar Envio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
