import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Leaf, HeartPulse, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

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
              {isAuthenticated ? 'Ver Dashboard' : 'Entrar'}
            </Button>
          </Link>
        </div>
        <div className="mt-12 flex items-center justify-center gap-6 md:gap-8 text-blue-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-300" />
            <span className="text-sm font-medium">ISO 9001</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-300" />
            <span className="text-sm font-medium">ISO 14001</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-300" />
            <span className="text-sm font-medium">ISO 45001</span>
          </div>
        </div>
      </div>
    </section>
  )
}
