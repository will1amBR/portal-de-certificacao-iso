import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ShieldCheck, Leaf, HeartPulse, FileDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getCertification, Certification } from '@/services/certifications'
import { useRealtime } from '@/hooks/use-realtime'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CertOverview } from '@/components/cert/CertOverview'
import { CertDocuments } from '@/components/cert/CertDocuments'
import { CertTasks } from '@/components/cert/CertTasks'
import { CertSchedules } from '@/components/cert/CertSchedules'
import { CertMessages } from '@/components/cert/CertMessages'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { LayoutGrid } from 'lucide-react'

export default function CertificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cert, setCert] = useState<Certification | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!id) return
    try {
      setCert(await getCertification(id))
    } catch {
      navigate('/certificacoes')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [id])
  useRealtime('certifications', () => {
    load()
  })

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  if (!cert) return null

  const code = cert.expand?.iso_type?.code
  const Icon = code === '14001' ? Leaf : code === '45001' ? HeartPulse : ShieldCheck
  const iconColor =
    code === '14001' ? 'text-emerald-600' : code === '45001' ? 'text-rose-600' : 'text-sky-700'

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/certificacoes')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-slate-100">
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {cert.expand?.iso_type?.name || 'Certificação'}
          </h1>
          <p className="text-sm text-slate-500">{cert.company_name || 'Empresa'}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-[#0055A4]">{cert.status}</Badge>
          <Link to="/relatorio-onboarding">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4" /> Relatório
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="pipes">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger
            value="pipes"
            className="font-semibold text-blue-700 data-[state=active]:bg-blue-50"
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Pipes & Fluxos
          </TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="schedules">Agenda</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>
        <TabsContent value="pipes" className="mt-4">
          <PipesGrid certId={cert.id} />
        </TabsContent>
        <TabsContent value="overview" className="mt-4">
          <CertOverview cert={cert} />
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <CertDocuments certId={cert.id} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <CertTasks certId={cert.id} />
        </TabsContent>
        <TabsContent value="schedules" className="mt-4">
          <CertSchedules certId={cert.id} />
        </TabsContent>
        <TabsContent value="messages" className="mt-4">
          <CertMessages certId={cert.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
