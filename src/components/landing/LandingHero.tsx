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
      className="relative overflow-hidden bg-gradient-to-br from-[#003B73] via-[#0055A4] to-[#007ACC] text-white pt-24 pb-20 md:pt-32 md:pb-28"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00A86B] rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span className="text-sm font-medium text-blue-100">
            Plataforma oficial de certificação ISO
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
          Certificação ISO nunca foi tão fácil
          <span className="block text-blue-200">— e nem tão revolucionária</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-blue-100 max-w-2xl mx-auto animate-fade-in-up">
          Com décadas de experiência em certificações ambientais, simplificamos todo o processo para
          você. Templates inteligentes, automação completa e suporte de consultores especializados.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up">
          {!isAuthenticated && (
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-[#00A86B] hover:bg-emerald-600 font-bold px-8 shadow-lg shadow-emerald-950/20 w-full sm:w-auto"
              >
                Criar Conta Gratuita <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          )}
          <Link to={isAuthenticated ? '/dashboard' : '/login'}>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto font-semibold"
            >
              {isAuthenticated ? 'Acessar Painel' : 'Fazer Login'}
            </Button>
          </Link>
        </div>

        {!isAuthenticated && (
          <div className="mt-5 flex flex-col items-center justify-center gap-2 animate-fade-in-up">
            <span className="text-xs text-blue-200 font-medium">
              Sem cadastro prévio? Acesse a demonstração:
            </span>
            <DemoSelector variant="hero" />
          </div>
        )}

        {/* Badges and Metrics Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold text-white">100%</p>
            <p className="text-xs text-blue-200 mt-1">Conformidade Normativa</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold text-emerald-300">-60%</p>
            <p className="text-xs text-blue-200 mt-1">Tempo de Adequação</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold text-yellow-300">3 Normas</p>
            <p className="text-xs text-blue-200 mt-1">ISO 9001, 14001, 45001</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-2xl md:text-3xl font-extrabold text-sky-300">Pipes & AI</p>
            <p className="text-xs text-blue-200 mt-1">Gestão Ágil Integrada</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 md:gap-8 text-blue-200 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold">ISO 9001 (Qualidade)</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Leaf className="h-4 w-4 text-emerald-300" />
            <span className="text-xs font-semibold">ISO 14001 (Ambiental)</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <HeartPulse className="h-4 w-4 text-rose-300" />
            <span className="text-xs font-semibold">ISO 45001 (Saúde & Segurança)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
