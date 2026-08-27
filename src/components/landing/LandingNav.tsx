import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Phone,
  Sparkles,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { DemoSelector } from '@/components/DemoSelector'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Visão Geral', href: '#sobre', icon: Sparkles },
  { label: 'Normas ISO', href: '#certificacoes', icon: ShieldCheck },
  { label: 'Como Funciona (Onboarding)', href: '#onboarding-explicativo', icon: CheckCircle2 },
  { label: 'Etapas de Certificação', href: '#como-funciona', icon: ShieldCheck },
  { label: 'Demonstração Interativa', href: '#demo-interativa', icon: Sparkles },
  { label: 'Dúvidas Frequentes', href: '#faq', icon: HelpCircle },
  { label: 'Contato', href: '#contato', icon: Phone },
]

export function LandingNav() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 text-slate-900'
          : 'bg-transparent text-white',
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#sobre"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
        >
          <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-sm tracking-wide shadow-sm group-hover:bg-[#0055A4] transition-colors">
            ISO
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                'font-bold text-base leading-tight tracking-tight transition-colors',
                scrolled ? 'text-slate-900' : 'text-white',
              )}
            >
              Portal ISO
            </span>
            <span
              className={cn(
                'text-[10px] uppercase font-semibold tracking-wider transition-colors',
                scrolled ? 'text-slate-500' : 'text-blue-200',
              )}
            >
              Qualidade & Conformidade
            </span>
          </div>
        </a>

        {/* Right action & Hamburger Menu button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button
                size="sm"
                className="bg-[#0055A4] hover:bg-[#1A73E8] text-white font-medium text-xs sm:text-sm px-3.5 py-2 h-9 rounded-lg shadow-sm"
              >
                Ir ao Painel <ArrowRight className="h-3.5 w-3.5 ml-1.5 shrink-0" />
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex">
              <Button
                variant={scrolled ? 'outline' : 'ghost'}
                size="sm"
                className={cn(
                  'text-xs font-semibold px-3.5 py-2 h-9 rounded-lg transition-colors',
                  scrolled
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-white hover:bg-white/10 hover:text-white',
                )}
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" /> Entrar
              </Button>
            </Link>
          )}

          {/* Clean Hamburger Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Abrir menu de navegação"
                className={cn(
                  'p-2 h-10 w-10 rounded-lg flex items-center justify-center transition-all cursor-pointer',
                  scrolled
                    ? 'text-slate-800 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                    : 'text-white hover:bg-white/15 border border-white/20',
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[360px] p-0 flex flex-col justify-between bg-white border-l border-slate-200"
            >
              <div>
                <SheetHeader className="p-5 border-b border-slate-100 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-sm">
                      ISO
                    </div>
                    <div>
                      <SheetTitle className="text-base font-bold text-slate-900">
                        Navegação Principal
                      </SheetTitle>
                      <p className="text-xs text-slate-500">Portal de Certificação e Gestão</p>
                    </div>
                  </div>
                </SheetHeader>

                {/* Nav Links */}
                <div className="p-4 space-y-1">
                  {navLinks.map((item) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-slate-700 hover:text-[#0055A4] hover:bg-blue-50/70 transition-colors"
                      >
                        <Icon className="h-4 w-4 text-slate-400 group-hover:text-[#0055A4]" />
                        <span>{item.label}</span>
                      </a>
                    )
                  })}
                </div>

                {/* Quick Access Demo */}
                {!isAuthenticated && (
                  <div className="px-4 py-3 mx-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Testar sem cadastro:
                    </p>
                    <DemoSelector variant="default" />
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="block">
                    <Button className="w-full bg-[#0055A4] hover:bg-[#1A73E8] text-white font-semibold">
                      Acessar Painel <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" onClick={() => setOpen(false)} className="block">
                      <Button className="w-full bg-[#00A86B] hover:bg-emerald-600 text-white font-semibold shadow-sm">
                        <UserPlus className="h-4 w-4 mr-1.5" /> Criar Conta Gratuita
                      </Button>
                    </Link>
                    <Link to="/login" onClick={() => setOpen(false)} className="block">
                      <Button
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-white"
                      >
                        <LogIn className="h-4 w-4 mr-1.5" /> Fazer Login
                      </Button>
                    </Link>
                  </>
                )}
                <p className="text-[11px] text-center text-slate-400 pt-1">
                  ISO 9001 • ISO 14001 • ISO 45001
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
