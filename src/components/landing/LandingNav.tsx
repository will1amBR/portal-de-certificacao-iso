import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Time', href: '#time' },
  { label: 'Contato', href: '#contato' },
]

export function LandingNav() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#sobre" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-sm">ISO</div>
          <span
            className={cn('font-bold hidden sm:inline', scrolled ? 'text-slate-900' : 'text-white')}
          >
            Portal de Certificação
          </span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled ? 'text-slate-600 hover:text-[#0055A4]' : 'text-white/90 hover:text-white',
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" className="bg-[#0055A4] hover:bg-[#1A73E8]">
                Ir para o Painel <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(scrolled ? 'text-slate-700' : 'text-white hover:bg-white/10')}
                >
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
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className="h-6 w-6 text-slate-900" />
          ) : (
            <Menu className={cn('h-6 w-6', scrolled ? 'text-slate-900' : 'text-white')} />
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-[#0055A4]"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <Link to="/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Entrar
              </Button>
            </Link>
            <Link to="/signup" className="flex-1">
              <Button size="sm" className="w-full bg-[#00A86B] hover:bg-emerald-600">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
