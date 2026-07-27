import { useEffect } from 'react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingIsoCards } from '@/components/landing/LandingIsoCards'
import { LandingProcess } from '@/components/landing/LandingProcess'
import { LandingAudience } from '@/components/landing/LandingAudience'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function Landing() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <LandingHero />
      <LandingIsoCards />
      <LandingProcess />
      <LandingAudience />
      <LandingTestimonials />
      <LandingFooter />
    </div>
  )
}
