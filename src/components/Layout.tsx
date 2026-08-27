import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Calendar,
  User,
  LogOut,
  Menu,
  CheckCircle2,
  LayoutTemplate,
  Settings,
  Building2,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { DemoBanner, DemoBadge } from '@/components/DemoBanner'
import { NotificationBell } from '@/components/NotificationBell'

export default function Layout() {
  const { user, signOut, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)

  if (!isAuthenticated) {
    return <Outlet />
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Processos & Pipes', path: '/certificacoes', icon: ShieldCheck },
    { label: 'Documentos', path: '/documentos', icon: FileText },
    { label: 'Agendamentos', path: '/agendamentos', icon: Calendar },
    { label: 'Meus Modelos', path: '/modelos', icon: LayoutTemplate },
    ...(user?.role === 'admin'
      ? [
          { label: 'Painel Admin & Funil', path: '/admin', icon: Building2 },
          { label: 'Gerenciar Modelos', path: '/admin/modelos', icon: Settings },
        ]
      : []),
    { label: 'Meu Perfil', path: '/perfil', icon: User },
  ]

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'
  const userRoleBadge =
    user?.role === 'admin'
      ? 'Empresa de Auditoria'
      : user?.role === 'consultor'
        ? 'Auditor Técnico'
        : 'Cliente'

  const currentItem = navItems.find((item) =>
    item.path === '/dashboard'
      ? location.pathname === '/dashboard' || location.pathname === '/app'
      : location.pathname.startsWith(item.path),
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <DemoBanner onOpenTour={() => setTourOpen(true)} />

      {/* Onboarding Tour Modal accessible anywhere in layout */}
      <OnboardingTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        onComplete={() => {
          setTourOpen(false)
          if (!user?.cnpj || !user?.business_model) {
            navigate('/onboarding')
          }
        }}
      />

      {/* Clean Global Header with Hamburger Menu */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Hamburger Button & App Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Abrir menu de navegação"
                className="p-2 h-10 w-10 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] p-0 flex flex-col justify-between bg-white border-r border-slate-200"
            >
              <div>
                <SheetHeader className="p-5 border-b border-slate-100 text-left bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-sm">
                      ISO
                    </div>
                    <div>
                      <SheetTitle className="text-sm font-bold text-slate-900 leading-tight">
                        Portal de Certificação
                      </SheetTitle>
                      <p className="text-[11px] text-slate-500">Menu Principal</p>
                    </div>
                  </div>
                </SheetHeader>

                {/* Navigation Items */}
                <nav className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const active =
                      item.path === '/dashboard'
                        ? location.pathname === '/dashboard' || location.pathname === '/app'
                        : location.pathname.startsWith(item.path)

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? 'bg-[#0055A4] text-white font-semibold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {active && <ChevronRight className="h-4 w-4 opacity-70" />}
                      </Link>
                    )
                  })}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        setTourOpen(true)
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0055A4] transition-colors cursor-pointer border border-dashed border-slate-200 mt-2"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-[#0055A4]" />
                        <span>Tour de Onboarding</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-[#0055A4] font-bold px-1.5 py-0.5 rounded">
                        Guia
                      </span>
                    </button>
                  </div>
                </nav>
              </div>

              {/* Bottom user profile quick link and logout */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2.5 px-2 py-1">
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#0055A4] text-white text-xs font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {user?.name || user?.email}
                    </span>
                    <span className="text-[10px] text-slate-500">{userRoleBadge}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 justify-center h-9"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sair da Conta
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Clean Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#003B73] text-white font-black text-xs">ISO</div>
            <span className="font-bold text-slate-900 text-sm hidden sm:inline">
              Portal de Certificação
            </span>
          </Link>

          {currentItem && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 pl-2 border-l border-slate-200">
              <span className="text-slate-600 font-medium">{currentItem.label}</span>
            </div>
          )}

          <DemoBadge />
        </div>

        {/* Right Actions: Notifications & User Avatar Dropdown */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTourOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0055A4] hover:bg-blue-50 h-9 px-3 border border-slate-200 rounded-lg cursor-pointer min-h-[36px]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0055A4]" />
            <span>Tour Guiado</span>
          </Button>

          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Menu do usuário"
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-[#0055A4] text-white text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:flex flex-col">
                  <span className="text-xs font-bold text-slate-800 leading-none">
                    {user?.name || user?.email}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {userRoleBadge}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <p className="text-xs font-semibold text-slate-900">{user?.name || 'Usuário'}</p>
                <p className="text-[11px] font-normal text-slate-500 truncate">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/perfil')}
                className="cursor-pointer text-xs"
              >
                <User className="h-3.5 w-3.5 mr-2" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/certificacoes')}
                className="cursor-pointer text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                Processos & Pipes
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTourOpen(true)}
                className="cursor-pointer text-xs text-[#0055A4] focus:text-[#0055A4]"
              >
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Tour de Onboarding
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-rose-600 cursor-pointer text-xs focus:text-rose-600 focus:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area - Full width, clean & airy */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Clean subtle footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        © {new Date().getFullYear()} Portal de Certificação ISO
      </footer>
    </div>
  )
}
