import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, Certification } from '@/services/certifications'
import { CertificationCard } from '@/components/CertificationCard'
import { NewCertificationDialog } from '@/components/NewCertificationDialog'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LayoutGrid, ShieldCheck, Sparkles, FolderGit2 } from 'lucide-react'

export default function Certifications() {
  const { user } = useAuth()
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const load = async () => {
    try {
      const all = await getCertifications()
      setCerts(user?.role === 'cliente' ? all.filter((c) => c.user === user?.id) : all)
    } catch {
      /* noop */
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('certifications', () => {
    load()
  })

  const filtered = statusFilter === 'all' ? certs : certs.filter((c) => c.status === statusFilter)

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulos & Pipes ISO</h1>
          <p className="text-sm text-slate-500">
            Gerencie os fluxos operacionais, não-conformidades, riscos e processos no estilo Pipefy
          </p>
        </div>
        <NewCertificationDialog onCreated={load} />
      </div>

      <Tabs defaultValue="pipes" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 border border-slate-200">
          <TabsTrigger value="pipes" className="gap-2 text-xs md:text-sm font-semibold">
            <LayoutGrid className="h-4 w-4 text-blue-600" />
            Pipes e Processos ISO
          </TabsTrigger>
          <TabsTrigger value="certifications" className="gap-2 text-xs md:text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-sky-700" />
            Visão Geral por Norma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipes" className="space-y-6">
          <PipesGrid />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <div className="flex items-center gap-3">
            <Label className="text-sm text-slate-600">Filtrar por status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="não iniciado">Não iniciado</SelectItem>
                <SelectItem value="em andamento">Em andamento</SelectItem>
                <SelectItem value="pendente de documentos">Pendente de documentos</SelectItem>
                <SelectItem value="aguardando auditoria">Aguardando auditoria</SelectItem>
                <SelectItem value="concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Nenhuma certificação encontrada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((c) => (
                <CertificationCard key={c.id} cert={c} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
