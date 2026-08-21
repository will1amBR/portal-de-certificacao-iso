import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, type Certification } from '@/services/certifications'
import { KpiSection } from '@/components/KpiSection'
import { CertificationCard } from '@/components/CertificationCard'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRealtime } from '@/hooks/use-realtime'
import { FileCheck, Clock, TrendingUp, Award, Plus } from 'lucide-react'

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

      <div>
        <h2 className="text-lg font-semibold mb-3">Minhas Certificações</h2>
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
      </div>
    </div>
  )
}
