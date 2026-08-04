import { useState, useEffect } from 'react'
import { getIsoTypes, deleteIsoType, IsoType } from '@/services/iso_types'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { IsoTypeDialog } from '@/components/admin/IsoTypeDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function AdminIsoTypes() {
  const [isoTypes, setIsoTypes] = useState<IsoType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<IsoType | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    try {
      setIsoTypes(await getIsoTypes())
    } catch {
      toast.error('Erro ao carregar tipos ISO')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('iso_types', () => load())

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteIsoType(deleteId)
      toast.success('Tipo ISO excluído')
    } catch {
      toast.error('Erro ao excluir')
    }
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#0055A4]" /> Tipos ISO
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie o catálogo de normas ISO</p>
        </div>
        <Button
          className="bg-[#0055A4] hover:bg-[#1A73E8]"
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" /> Novo Tipo
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {isoTypes.map((iso) => (
          <Card key={iso.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{iso.name}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    ISO {iso.code}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-2">{iso.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(iso)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600"
                    onClick={() => setDeleteId(iso.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <IsoTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isoType={editing}
        onSaved={() => load()}
      />
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O tipo ISO será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
