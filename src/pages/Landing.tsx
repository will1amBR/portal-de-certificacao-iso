import { useEffect } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingIsoCards } from '@/components/landing/LandingIsoCards'
import { LandingMiniOnboarding } from '@/components/landing/LandingMiniOnboarding'
import { LandingProcess } from '@/components/landing/LandingProcess'
import { LandingInteractiveDemo } from '@/components/landing/LandingInteractiveDemo'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { LandingFooter } from '@/components/landing/LandingFooter'

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
        <section id="demo-interativa" className="scroll-mt-16">
          <LandingInteractiveDemo />
        </section>
        <section id="faq" className="scroll-mt-16">
          <LandingFaq />
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}
