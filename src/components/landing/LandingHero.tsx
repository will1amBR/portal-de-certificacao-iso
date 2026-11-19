import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSiteContent } from '@/hooks/use-site-content'

export function LandingHero() {
  const { isAuthenticated } = useAuth()
  const { metrics } = useSiteContent()

  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-gradient-to-b from-[#003060] via-[#004080] to-[#0055A4] text-white pt-24 pb-16 md:pt-32 md:pb-24"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-400 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Minimal clean pill */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3.5 py-1 mb-6 border border-white/15 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          <span className="text-xs font-medium text-blue-100">
            Plataforma usada por certificadoras e empresas em certificação ISO
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Conquiste a certificação ISO <span className="text-sky-300">em até 60% menos tempo</span>,
          com documentos prontos e auditoria sem surpresas
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
          Templates inteligentes por segmento, gestão visual em Pipes e suporte de auditores
          sêniores para ISO 9001, 14001 e 45001. Da primeira tarefa até o selo, em um único
          ambiente.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-[#00A86B] hover:bg-emerald-600 font-semibold text-white px-7 h-11 w-full sm:w-auto shadow-md rounded-xl text-sm whitespace-nowrap"
            >
              {isAuthenticated ? 'Ir para o Painel' : 'Criar conta gratuita'}
              <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
            </Button>
          </Link>

          {!isAuthenticated && (
            <Link to="/demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/25 px-6 h-11 w-full sm:w-auto font-medium rounded-xl text-sm backdrop-blur-sm whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                Conhecer as Demos
              </Button>
            </Link>
          )}

          <a href="#onboarding-explicativo" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="ghost"
              className="text-blue-100 hover:text-white hover:bg-white/10 px-5 h-11 w-full sm:w-auto font-medium rounded-xl text-sm transition-all whitespace-nowrap"
            >
              Ver como funciona
            </Button>
          </a>
        </div>

        {/* Trust microcopy */}
        {!isAuthenticated && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-blue-200">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Sem cartão de crédito
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Onboarding guiado em minutos
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Dados isolados por empresa
            </span>
          </p>
        )}

        {/* Key Clean Highlights */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {metrics.map((m, i) => (
            <div key={`${m.value}-${m.label}-${i}`}>
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  i === 1 ? 'text-emerald-300' : i === 2 ? 'text-sky-300' : 'text-white'
                }`}
              >
                {m.value}
              </p>
              <p className="text-xs text-blue-200/80 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
