import { useEffect } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingIsoCards } from '@/components/landing/LandingIsoCards'
import { LandingMiniOnboarding } from '@/components/landing/LandingMiniOnboarding'
import { LandingProcess } from '@/components/landing/LandingProcess'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Landing() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-white selection:bg-[#0055A4] selection:text-white">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingIsoCards />
        <section id="onboarding-explicativo" className="scroll-mt-16">
          <LandingMiniOnboarding />
        </section>
        <LandingProcess />

        {/* Clean Callout Section para a página dedicada /demo */}
        <section className="py-14 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border-y border-blue-100/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#0055A4]">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Ambiente de Demonstração
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quer ver a plataforma em ação antes de se cadastrar?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Disponibilizamos 3 perfis completos com dados simulados prontos para testar: Cliente
              Construtora, Auditor Técnico e Empresa Certificadora.
            </p>
            <div className="pt-2">
              <Link to="/demo">
                <Button
                  size="lg"
                  className="bg-[#0055A4] hover:bg-[#1A73E8] text-white font-semibold px-6 shadow-md rounded-xl text-sm"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                  Conhecer as Demos <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-16">
          <LandingFaq />
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}
