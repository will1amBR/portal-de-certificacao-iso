import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Leaf,
  HeartPulse,
  ShoppingCart,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Users,
  FileText,
  Calendar,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Landing() {
  const { isAuthenticated } = useAuth()

  const isoCards = [
    {
      icon: ShieldCheck,
      code: 'ISO 9001',
      title: 'Gestão da Qualidade',
      desc: 'Padronização de processos, melhoria contínua e satisfação do cliente.',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: Leaf,
      code: 'ISO 14001',
      title: 'Gestão Ambiental',
      desc: 'Reduza impactos ambientais e garanta conformidade legal.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: HeartPulse,
      code: 'ISO 45001',
      title: 'Saúde e Segurança',
      desc: 'Proteja seus colaboradores com gestão de riscos ocupacionais.',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  const models = [
    { icon: ShoppingCart, name: 'Mercado', desc: 'Varejo, supermercados e mercearias' },
    { icon: Building2, name: 'Construtora', desc: 'Construção civil, obras e engenharia' },
    { icon: Briefcase, name: 'Prestador de Serviços', desc: 'Empresas de serviços em geral' },
  ]

  const steps = [
    { icon: FileText, title: 'Cadastro e Onboarding', desc: 'Informe CNPJ e modelo de negócio' },
    {
      icon: Zap,
      title: 'Templates Automáticos',
      desc: 'Tarefas e documentos gerados automaticamente',
    },
    {
      icon: Users,
      title: 'Suporte de Consultor',
      desc: 'Acompanhamento especializado em todo o processo',
    },
    {
      icon: CheckCircle2,
      title: 'Certificação Concluída',
      desc: 'Adequação completa e auditoria final',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-sm">ISO</div>
            <span className="font-bold text-slate-900">Portal de Certificação</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-[#0055A4] hover:bg-[#1A73E8]">
                  Ir para o Painel <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-[#00A86B] hover:bg-emerald-600">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#003B73] via-[#0055A4] to-[#007ACC] text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight animate-fade-in-up">
            Simplifique sua Jornada de
            <br />
            Certificação ISO
          </h1>
          <p className="mt-4 text-base md:text-lg text-blue-100 max-w-2xl mx-auto animate-fade-in-up">
            Gestão completa para ISO 9001, 14001 e 45001 com templates por modelo de negócio e
            suporte de consultores especializados.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up">
            {!isAuthenticated && (
              <Link to="/signup">
                <Button size="lg" className="bg-[#00A86B] hover:bg-emerald-600 w-full sm:w-auto">
                  Criar Conta Gratuita <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto"
              >
                {isAuthenticated ? 'Ver Dashboard' : 'Já tenho conta'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          Certificações Disponíveis
        </h2>
        <p className="text-slate-500 text-center mb-10">
          As três normas mais demandadas pelo mercado
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isoCards.map((iso) => (
            <div
              key={iso.code}
              className="rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-xl ${iso.bg} mb-4`}>
                <iso.icon className={`h-7 w-7 ${iso.color}`} />
              </div>
              <p className="text-sm font-bold text-slate-400">{iso.code}</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{iso.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{iso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
            Como Funciona
          </h2>
          <p className="text-slate-500 text-center mb-10">Do cadastro à certificação em 4 passos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="bg-white rounded-xl p-5 border border-slate-200 relative"
              >
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0055A4] text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <step.icon className="h-6 w-6 text-[#0055A4] mb-3" />
                <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          Templates por Modelo de Negócio
        </h2>
        <p className="text-slate-500 text-center mb-10">
          Templates personalizados de tarefas, documentos e agendamentos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border-2 border-slate-200 p-6 text-center hover:border-[#0055A4] transition-colors"
            >
              <div className="inline-flex p-4 rounded-2xl bg-slate-100 mb-4">
                <m.icon className="h-8 w-8 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{m.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#003B73] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Users className="h-12 w-12 mx-auto text-blue-300 mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold">Suporte de Consultores Especializados</h2>
          <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
            Nossa equipe de consultores acompanha todo o processo de adequação, resolvendo dúvidas,
            revisando documentos e preparando sua empresa para a auditoria final.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Pronto para começar?</h2>
        <p className="text-slate-500 mt-2">
          Crie sua conta gratuitamente e inicie o processo de certificação hoje.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {!isAuthenticated ? (
            <>
              <Link to="/signup">
                <Button size="lg" className="bg-[#00A86B] hover:bg-emerald-600">
                  Criar Conta <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Entrar
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="bg-[#0055A4] hover:bg-[#1A73E8]">
                Ir para o Painel <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <footer className="bg-[#003B73] text-blue-200 py-6 text-center text-sm">
        © {new Date().getFullYear()} Portal de Certificação ISO. Todos os direitos reservados.
      </footer>
    </div>
  )
}
