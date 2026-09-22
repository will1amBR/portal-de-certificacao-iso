import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  ClipboardCheck,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Leaf,
  HeartPulse,
  Sparkles,
  ChevronLeft,
  Copy,
  Check,
  Loader2,
  Kanban,
  FileCheck2,
  Users2,
  CheckCircle2,
  Lock,
  Layers,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { LandingInteractiveDemo } from '@/components/landing/LandingInteractiveDemo'

interface DemoProfile {
  id: string
  name: string
  roleTitle: string
  company: string
  email: string
  password: string
  badge: string
  badgeVariant: 'default' | 'secondary' | 'outline'
  accentColor: string
  borderHover: string
  icon: typeof Building2
  summary: string
  keyFeatures: string[]
  redirect: string
}

const DEMO_PASSWORD_DEFAULT = 'Skip@Pass'

const demoProfiles: DemoProfile[] = [
  {
    id: 'cliente',
    name: 'Carlos Eduardo Mendes',
    roleTitle: 'Cliente / Responsável de Qualidade (RD)',
    company: 'Construtora Horizonte',
    email: 'demo.cliente@alc.com.br',
    password: DEMO_PASSWORD_DEFAULT,
    badge: 'Perfil Cliente',
    badgeVariant: 'secondary',
    accentColor: 'text-blue-600',
    borderHover: 'hover:border-blue-500',
    icon: Building2,
    summary:
      'Empresa em processo ativo de certificação ISO 9001 e ISO 14001 na área de engenharia e construção civil.',
    keyFeatures: [
      'Envio e controle de evidências documentais (ARTs, alvarás, laudos)',
      'Acompanhamento do progresso percentual por norma ISO em tempo real',
      'Gestão visual de planos de ação, RNCs e tarefas por setores',
      'Assinatura digital do Representante da Direção (RD) no relatório oficial',
    ],
    redirect: '/dashboard',
  },
  {
    id: 'auditor',
    name: 'Cauli',
    roleTitle: 'Auditor Técnico & Consultor Sênior',
    company: 'ALC Auditoria Técnica',
    email: 'demo.auditor@alc.com.br',
    password: DEMO_PASSWORD_DEFAULT,
    badge: 'Perfil Auditor',
    badgeVariant: 'outline',
    accentColor: 'text-amber-600',
    borderHover: 'hover:border-amber-500',
    icon: ClipboardCheck,
    summary:
      'Auditor líder responsável por conduzir auditorias de certificação, aplicar pre-sets por norma e emitir pareceres.',
    keyFeatures: [
      'Hub do Auditor com pre-sets inteligentes de Pipes ISO 9001, 14001, 45001 e NRs',
      'Aplicação de pre-sets em 1 clique para clientes com setores correspondentes',
      'Aprovação, reprovação e emissão de notas técnicas em evidências',
      'Assinatura digital de Auditor Líder com carimbo INMETRO e hash seguro',
    ],
    redirect: '/consultor',
  },
  {
    id: 'admin',
    name: 'ALC Certificadora',
    roleTitle: 'Empresa Certificadora / Gestão Global',
    company: 'ALC Certificações Nacionais',
    email: 'demo.admin@alc.com.br',
    password: DEMO_PASSWORD_DEFAULT,
    badge: 'Perfil Certificadora',
    badgeVariant: 'default',
    accentColor: 'text-emerald-600',
    borderHover: 'hover:border-emerald-500',
    icon: Landmark,
    summary:
      'Organismo certificador com visão macro: gerencia dezenas de clientes em pipeline, catálogo de modelos e auditorias.',
    keyFeatures: [
      'Funil de Onboarding comercial de 5 etapas com controle de tempo e gargalos',
      'Pipeline de clientes (Construtora, BioTec, Metalúrgica, Nova Fibra, LogTransp)',
      'Configurador de Modelos de Negócio e Templates normativos mestres',
      'Indicadores executivos agregados de conformidade e auditorias da carteira',
    ],
    redirect: '/admin',
  },
]

export default function DemoPage() {
  const { signInAsDemo, isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleLoginDemo = async (email: string, redirect: string, name: string) => {
    setLoadingEmail(email)
    try {
      const { error } = await signInAsDemo(email)
      if (error) {
        toast.error('Não foi possível entrar como demo. Tente novamente.')
        setLoadingEmail(null)
      } else {
        toast.success(`Entrando como ${name}! Redirecionando...`)
        navigate(redirect)
      }
    } catch {
      toast.error('Erro na conexão. Tente novamente.')
      setLoadingEmail(null)
    }
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copiado para a área de transferência!')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 selection:bg-[#0055A4] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-sm group-hover:bg-[#0055A4] transition-colors">
              ISO
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight text-slate-900">
                Portal de Certificação ISO
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Ambiente de Demonstração
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-block text-xs text-slate-600">
                  Logado como <strong>{user?.name || user?.email}</strong>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => signOut()}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  Trocar de Conta
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs font-semibold"
                >
                  <Link to="/dashboard">
                    Ir ao Painel <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-700">
                    Login Tradicional
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="sm" className="text-xs">
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Voltar ao Início
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#0055A4] border border-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Acesso Imediato sem Necessidade de Cadastro
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore a Plataforma ISO com Dados Reais
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Experimente os <strong>3 papéis essenciais</strong> do ecossistema: a visão da empresa
            cliente, a perspectiva do auditor técnico independente e a gestão corporativa da
            certificadora.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 1 clique para entrar
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-blue-600" /> Senha unificada:{' '}
              <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800 font-bold">
                {DEMO_PASSWORD_DEFAULT}
              </code>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-purple-600" /> Dados sincronizados e prontos
            </span>
          </div>
        </div>

        {/* 3 Demo Profiles Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {demoProfiles.map((p) => {
            const Icon = p.icon
            const isLoading = loadingEmail === p.email
            return (
              <Card
                key={p.id}
                className={`flex flex-col justify-between border-2 border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-200 ${p.borderHover} relative overflow-hidden`}
              >
                {/* Accent Top Bar */}
                <div
                  className={`h-1.5 w-full ${
                    p.id === 'cliente'
                      ? 'bg-blue-600'
                      : p.id === 'auditor'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                  }`}
                />

                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`p-2.5 rounded-xl text-white ${
                          p.id === 'cliente'
                            ? 'bg-blue-600'
                            : p.id === 'auditor'
                              ? 'bg-amber-600'
                              : 'bg-emerald-600'
                        } shadow-sm`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold ${
                          p.id === 'cliente'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : p.id === 'auditor'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {p.badge}
                      </Badge>
                    </div>

                    <CardTitle className="text-xl font-bold text-slate-900 leading-snug">
                      {p.name}
                    </CardTitle>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {p.roleTitle} • <strong>{p.company}</strong>
                    </p>
                    <CardDescription className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {p.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Credentials Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">E-mail:</span>
                        <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                          <span>{p.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(p.email, `email-${p.id}`)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Copiar e-mail"
                          >
                            {copiedKey === `email-${p.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Senha:</span>
                        <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                          <span>{p.password}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(p.password, `pass-${p.id}`)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Copiar senha"
                          >
                            {copiedKey === `pass-${p.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Key features */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        O que você poderá testar:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {p.keyFeatures.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${p.accentColor}`}
                            />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-5 pt-0">
                  <Button
                    onClick={() => handleLoginDemo(p.email, p.redirect, p.name)}
                    disabled={loadingEmail !== null}
                    className={`w-full font-semibold text-white shadow-md cursor-pointer ${
                      p.id === 'cliente'
                        ? 'bg-[#0055A4] hover:bg-[#1A73E8]'
                        : p.id === 'auditor'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Autenticando {p.name}...
                      </>
                    ) : (
                      <>
                        Entrar como {p.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Interactive Feature Simulation (centralized from landing) */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-300 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  Simulação Interativa das Telas
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Pipes Kanban, Indicadores e Modelos Setoriais
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                Veja uma prévia dos fluxos antes mesmo de logar em qualquer perfil.
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-6 bg-slate-50/50">
            <LandingInteractiveDemo />
          </div>
        </div>

        {/* Comparison / Guide Table */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users2 className="h-5 w-5 text-[#0055A4]" />
              Guia Rápido: Qual perfil devo testar primeiro?
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-600">
              Cada perfil atende uma ponta da cadeia de certificação normativa.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-blue-600" /> Se você é uma Empresa / Cliente
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Entre como <strong>Cliente (Construtora Horizonte)</strong> para ver como é
                  simples fazer upload de evidências, responder checklists e acompanhar as barras de
                  progresso das normas 9001 e 14001.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleLoginDemo(
                      'demo.cliente@alc.com.br',
                      '/dashboard',
                      'Construtora Horizonte',
                    )
                  }
                  className="w-full text-blue-700 border-blue-300 hover:bg-blue-100 cursor-pointer"
                >
                  Acessar Cliente <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4 text-amber-600" /> Se você é Auditor /
                  Consultor
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Entre como <strong>Cauli</strong> para explorar o Hub de Pre-sets, ver a matriz de
                  setores da Construtora Horizonte e aplicar pre-sets de cláusulas ISO e NRs com
                  apenas um clique.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoginDemo('demo.auditor@alc.com.br', '/consultor', 'Cauli')}
                  className="w-full text-amber-800 border-amber-300 hover:bg-amber-100 cursor-pointer"
                >
                  Acessar Auditor (Cauli) <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-emerald-600" /> Se você gerencia uma
                  Certificadora
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Entre como <strong>ALC Certificadora</strong> para analisar o funil comercial de 5
                  etapas, a carteira de empresas cadastradas e a parametrização dos templates
                  mestres.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleLoginDemo('demo.admin@alc.com.br', '/admin', 'ALC Certificadora')
                  }
                  className="w-full text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
                >
                  Acessar Certificadora <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-center pt-4 pb-8 text-xs text-slate-500 border-t border-slate-200">
          <p>
            Dúvidas ou precisa de uma demonstração guiada para sua equipe? Contate-nos pelo e-mail{' '}
            <a href="mailto:contato@alc.com.br" className="text-[#0055A4] underline">
              contato@alc.com.br
            </a>{' '}
            ou ligue (11) 4003-8920.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link to="/" className="text-slate-600 hover:text-slate-900 underline">
              Página Inicial
            </Link>
            <span>•</span>
            <Link to="/login" className="text-slate-600 hover:text-slate-900 underline">
              Login
            </Link>
            <span>•</span>
            <Link to="/signup" className="text-slate-600 hover:text-slate-900 underline">
              Cadastro
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
