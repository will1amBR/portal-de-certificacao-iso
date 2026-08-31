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
import {
  FileCheck,
  Clock,
  TrendingUp,
  Award,
  Plus,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'

export default function Dashboard() {
  const { user } = useAuth()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [tourOpen, setTourOpen] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const all = await getCertifications()
      setCertifications(
        user?.role === 'cliente' && user?.id ? all.filter((c) => c.user === user.id) : all,
      )
    } catch {
      setCertifications([])
    }
    setLoading(false)
  }, [user?.id, user?.role])

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
    {
      icon: FileCheck,
      label: 'Certificações Ativas',
      value: stats.total,
      color: 'text-[#0055A4]',
      bg: 'bg-blue-50',
    },
    {
      icon: Clock,
      label: 'Em Andamento',
      value: stats.inProgress,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: TrendingUp,
      label: 'Pendente Documentos',
      value: stats.pending,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Award,
      label: 'Concluídas / Auditadas',
      value: stats.completed,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ]

  return (
    <div className="space-y-6">
      <OnboardingTour open={tourOpen} onClose={() => setTourOpen(false)} />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Olá, {user?.name || 'Bem-vindo'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe o progresso das certificações, indicadores de conformidade e fluxos
            operacionais
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(user?.role === 'consultor' || user?.role === 'admin') && (
            <Button
              asChild
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white whitespace-nowrap min-h-[40px]"
            >
              <Link to="/consultor">
                <Sparkles className="h-4 w-4 mr-2 shrink-0 text-yellow-300" />
                Pre-sets de Pipes por Norma
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setTourOpen(true)}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 whitespace-nowrap min-h-[40px] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-[#0055A4]" />
            Guia do Portal
          </Button>
          <Button
            asChild
            className="bg-[#00A86B] hover:bg-emerald-600 text-white whitespace-nowrap min-h-[40px]"
          >
            <Link to="/certificacoes">
              <Plus className="h-4 w-4 mr-2 shrink-0" />
              Processos & Pipes
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <Card key={i} className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
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
