import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Leaf, HeartPulse, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { DemoSelector } from '@/components/DemoSelector'

export function LandingHero() {
  const { isAuthenticated } = useAuth()

  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-gradient-to-b from-[#003060] via-[#004080] to-[#0055A4] text-white pt-28 pb-20 md:pt-36 md:pb-28"
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
            Plataforma Integrada de Gestão ISO
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Sua certificação ISO simplificada, ágil e em conformidade total
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
          Templates inteligentes, gestão em Pipes e suporte técnico para as normas ISO 9001, 14001 e
          45001 em um único ambiente limpo e organizado.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {!isAuthenticated && (
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-[#00A86B] hover:bg-emerald-600 font-semibold text-white px-7 h-11 w-full sm:w-auto shadow-md rounded-xl text-sm"
              >
                Começar Gratuitamente <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
              </Button>
            </Link>
          )}

          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/25 px-7 h-11 w-full sm:w-auto font-medium rounded-xl text-sm backdrop-blur-sm"
            >
              {isAuthenticated ? 'Ir para o Painel' : 'Acessar Conta'}
            </Button>
          </Link>
        </div>

        {/* Demo Fast Selector */}
        {!isAuthenticated && (
          <div className="mt-6 pt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-blue-200">
            <span>Ou explore direto com dados de teste:</span>
            <DemoSelector variant="hero" />
          </div>
        )}

        {/* Key Clean Highlights */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">-60%</p>
            <p className="text-xs text-blue-200/80 mt-0.5">Tempo de Adequação</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-300">100%</p>
            <p className="text-xs text-blue-200/80 mt-0.5">Conformidade Normativa</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-sky-300">3 Normas</p>
            <p className="text-xs text-blue-200/80 mt-0.5">9001 • 14001 • 45001</p>
          </div>
        </div>
      </div>
    </section>
  )
}
