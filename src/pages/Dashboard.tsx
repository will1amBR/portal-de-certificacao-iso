import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, type Certification } from '@/services/certifications'
import { KpiSection } from '@/components/KpiSection'
import { CertificationCard } from '@/components/CertificationCard'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRealtime } from '@/hooks/use-realtime'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileCheck, Clock, TrendingUp, Award, Plus, LayoutGrid, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setCertifications(await getCertifications())
    } catch {
      setCertifications([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('certifications', () => {
    loadData()
  })

  const stats = {
    total: certifications.length,
    inProgress: certifications.filter((c) => c.status === 'em andamento').length,
    pending: certifications.filter((c) => c.status === 'pendente de documentos').length,
    completed: certifications.filter((c) => c.status === 'concluído').length,
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const statCards = [
    { icon: FileCheck, label: 'Certificações', value: stats.total, color: 'text-blue-600' },
    { icon: Clock, label: 'Em Andamento', value: stats.inProgress, color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Pendentes', value: stats.pending, color: 'text-orange-600' },
    { icon: Award, label: 'Concluídas', value: stats.completed, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, {user?.name || 'Bem-vindo'}</h1>
          <p className="text-muted-foreground">Acompanhe suas certificações e indicadores.</p>
        </div>
        <Button asChild>
          <Link to="/certificacoes">
            <Plus className="h-4 w-4 mr-2" />
            Nova Certificação
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <KpiSection certifications={certifications} />

      <div className="space-y-4">
        <Tabs defaultValue="pipes" className="w-full">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <TabsList className="bg-slate-100 p-1 border border-slate-200">
              <TabsTrigger value="pipes" className="gap-2 font-semibold">
                <LayoutGrid className="h-4 w-4 text-blue-600" />
                Pipes e Processos ISO (Pipefy)
              </TabsTrigger>
              <TabsTrigger value="certs" className="gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-sky-700" />
                Certificações em Andamento
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pipes" className="space-y-4">
            <PipesGrid />
          </TabsContent>

          <TabsContent value="certs" className="space-y-4">
            {certifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nenhuma certificação encontrada. Clique em "Nova Certificação" para começar.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {certifications.map((cert) => (
                  <CertificationCard key={cert.id} cert={cert} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
