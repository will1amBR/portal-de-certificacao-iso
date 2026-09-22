import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, type Certification } from '@/services/certifications'
import { getAllCards } from '@/services/cards'
import { getAllDocuments } from '@/services/documents'
import { getSchedules } from '@/services/schedules'
import { KpiSection } from '@/components/KpiSection'
import { CertificationCard } from '@/components/CertificationCard'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Building2,
  Calendar,
  FileText,
  Kanban,
  CheckCircle2,
} from 'lucide-react'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'

export default function Dashboard() {
  const { user, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [cardsCount, setCardsCount] = useState<number>(0)
  const [docsCount, setDocsCount] = useState<number>(0)
  const [schedulesCount, setSchedulesCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [tourOpen, setTourOpen] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [allCerts, allCards, allDocs, allScheds] = await Promise.all([
        getCertifications().catch(() => []),
        getAllCards().catch(() => []),
        getAllDocuments().catch(() => []),
        getSchedules().catch(() => []),
      ])

      const filteredCerts =
        user?.role === 'cliente' && user?.id ? allCerts.filter((c) => c.user === user.id) : allCerts

      setCertifications(filteredCerts)
      setCardsCount(allCards.length)
      setDocsCount(allDocs.length)
      setSchedulesCount(allScheds.length)
    } catch {
      setCertifications([])
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?.role])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('certifications', loadData)
  useRealtime('pipe_cards', loadData)
  useRealtime('documents', loadData)
  useRealtime('schedules', loadData)

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

      {/* Top Welcome Card with Dynamic Role Context */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003366] via-[#0055A4] to-[#0070BA] p-6 sm:p-7 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                {user?.role === 'admin'
                  ? 'Painel da Certificadora (ALC)'
                  : user?.role === 'consultor'
                    ? 'Painel do Auditor Técnico (Ana Costa)'
                    : 'Painel da Empresa (Construtora Horizonte)'}
              </span>
              <span className="text-xs text-blue-100 font-medium bg-white/10 px-2 py-0.5 rounded">
                {user?.company_name || 'Construtora Horizonte'}
              </span>
              {isDemoMode && (
                <Badge
                  variant="outline"
                  className="border-amber-300/40 text-amber-200 text-[11px] bg-amber-500/10"
                >
                  Demo Interativa
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, {user?.name || 'Gestor'}!
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              {user?.role === 'admin'
                ? 'Monitore todos os clientes da ALC, acompanhe o funil de onboarding e a conformidade global de normas.'
                : user?.role === 'consultor'
                  ? 'Gerencie processos de auditoria técnica, aplique pre-sets de cláusulas ISO e valide evidências.'
                  : 'Acompanhe suas certificações ISO em andamento, audite cláusulas pelo fluxo Kanban interativo e acesse templates normativos prontos.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTourOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm font-medium cursor-pointer"
            >
              <Sparkles className="h-4 w-4 mr-1.5 text-yellow-300" />
              Tour do Portal
            </Button>
            {user?.role === 'admin' && (
              <Button
                asChild
                size="sm"
                className="bg-white text-[#0055A4] hover:bg-blue-50 font-semibold shadow-md cursor-pointer"
              >
                <Link to="/admin">
                  <Building2 className="h-4 w-4 mr-1.5" />
                  Abrir Funil & Pipeline
                </Link>
              </Button>
            )}
            {user?.role === 'consultor' && (
              <Button
                asChild
                size="sm"
                className="bg-white text-[#0055A4] hover:bg-blue-50 font-semibold shadow-md cursor-pointer"
              >
                <Link to="/consultor">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Hub do Auditor
                </Link>
              </Button>
            )}
            {user?.role === 'cliente' && (
              <Button
                asChild
                size="sm"
                className="bg-white text-[#0055A4] hover:bg-blue-50 font-semibold shadow-md cursor-pointer"
              >
                <Link to="/certificacoes">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Nova Certificação
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="mt-6 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{certifications.length}</div>
            <div className="text-xs text-blue-100">
              {user?.role === 'cliente' ? 'Certificações Ativas' : 'Processos em Auditoria'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-300">{cardsCount}</div>
            <div className="text-xs text-blue-100">Itens / Cláusulas no Kanban</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-300">{docsCount}</div>
            <div className="text-xs text-blue-100">Documentos & Evidências</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-200">{schedulesCount}</div>
            <div className="text-xs text-blue-100">Auditorias & Agendamentos</div>
          </div>
        </div>
      </div>

      {/* Role-specific quick actions banner */}
      {user?.role === 'admin' && (
        <Card className="border-blue-100 bg-gradient-to-r from-blue-50/60 via-slate-50 to-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0055A4]" />
                <CardTitle className="text-base font-bold text-slate-800">
                  Visão de Gestão Geral (ALC Certificadora)
                </CardTitle>
              </div>
              <Badge className="bg-[#0055A4] text-white">Perfil Admin</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-0">
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-3.5 hover:border-[#0055A4] hover:bg-blue-50/50"
            >
              <Link to="/admin" className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-[#0055A4] mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Pipeline de Clientes</div>
                  <div className="text-xs text-muted-foreground">
                    Funil de 5 etapas, status e bloqueios
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-3.5 hover:border-[#0055A4] hover:bg-blue-50/50"
            >
              <Link to="/admin/modelos" className="flex items-start gap-3">
                <Kanban className="h-5 w-5 text-[#0055A4] mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Modelos & Templates</div>
                  <div className="text-xs text-muted-foreground">
                    Configurar modelos por ramo e normas
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-3.5 hover:border-[#0055A4] hover:bg-blue-50/50"
            >
              <Link to="/consultor" className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#0055A4] mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">
                    Hub do Auditor & Pre-sets
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Aplicar pre-sets ISO/NR com 1 clique
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {user?.role === 'consultor' && (
        <Card className="border-amber-200/70 bg-gradient-to-r from-amber-50/50 via-white to-orange-50/30 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-base font-bold text-slate-800">
                  Ações Rápidas de Auditoria (Ana Costa)
                </CardTitle>
              </div>
              <Badge className="bg-amber-600 text-white">Auditor Técnico</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-0">
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-3.5 hover:border-amber-500 hover:bg-amber-50/50"
            >
              <Link to="/consultor" className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">
                    Hub de Pre-sets ISO / NR
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Aplicar pipes prontos para clientes
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-3.5 hover:border-amber-500 hover:bg-amber-50/50"
            >
              <Link to="/certificacoes" className="flex items-start gap-3">
                <Kanban className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Pipes & Cláusulas</div>
                  <div className="text-xs text-muted-foreground">
                    Auditoria direta com Kanban e cards
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="justify-start h-auto p-3.5 hover:border-amber-500 hover:bg-amber-50/50"
            >
              <Link to="/agendamentos" className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Agenda de Auditorias</div>
                  <div className="text-xs text-muted-foreground">
                    Reuniões, visitas in-loco e homologações
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
