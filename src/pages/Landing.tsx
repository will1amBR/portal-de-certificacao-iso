import { useEffect } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingIsoCards } from '@/components/landing/LandingIsoCards'
import { LandingProcess } from '@/components/landing/LandingProcess'
import { LandingAudience } from '@/components/landing/LandingAudience'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingFooter } from '@/components/landing/LandingFooter'

import { LandingInteractiveDemo } from '@/components/landing/LandingInteractiveDemo'
import { LandingFaq } from '@/components/landing/LandingFaq'

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
      <LandingHero />
      <LandingIsoCards />
      <LandingProcess />
      <section id="demo-interativa" className="scroll-mt-16">
        <LandingInteractiveDemo />
      </section>
      <LandingAudience />
      <LandingTestimonials />
      <section id="faq" className="scroll-mt-16">
        <LandingFaq />
      </section>
      <LandingFooter />
    </div>
  )
}
