import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ShieldCheck, Leaf, HeartPulse } from 'lucide-react'
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
import { getIsoTypes, IsoType } from '@/services/iso_types'
import { createCertification } from '@/services/certifications'
import { toast } from 'sonner'

export function NewCertificationDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [types, setTypes] = useState<IsoType[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      getIsoTypes().then((res) => {
        setTypes(res)
        if (res.length > 0 && !selectedType) setSelectedType(res[0].id)
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) {
      toast.error('Selecione uma norma ISO')
      return
    }

    setLoading(true)
    try {
      const created = await createCertification({
        iso_type: selectedType,
        company_name: companyName || undefined,
      })
      toast.success('Certificação iniciada com sucesso!')
      setOpen(false)
      if (onCreated) onCreated()
      navigate(`/certificacoes/${created.id}`)
    } catch (err: any) {
      toast.error('Erro ao iniciar certificação: ' + (err?.message || 'Tente novamente'))
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (code: string) => {
    if (code === '14001') return <Leaf className="h-5 w-5 text-emerald-600" />
    if (code === '45001') return <HeartPulse className="h-5 w-5 text-rose-600" />
    return <ShieldCheck className="h-5 w-5 text-[#0055A4]" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0055A4] hover:bg-[#1A73E8] text-white gap-2 font-medium">
          <Plus className="h-4 w-4" />
          Nova Certificação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Iniciar Nova Certificação ISO</DialogTitle>
          <DialogDescription>
            Escolha a norma ISO desejada para dar início ao processo de adequação e consultoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa / Organização</Label>
            <Input
              id="companyName"
              placeholder="Ex: Minha Empresa S.A."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Norma ISO Desejada</Label>
            <div className="grid grid-cols-1 gap-2.5">
              {types.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedType === t.id
                      ? 'border-[#0055A4] bg-sky-50/50 ring-1 ring-[#0055A4]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="p-2 rounded bg-slate-100">{getIcon(t.code)}</div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.description}</p>
                  </div>
                </div>
              ))}
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
              {loading ? 'Criando...' : 'Iniciar Processo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
