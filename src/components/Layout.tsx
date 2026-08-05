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
  X,
  CheckCircle2,
  LayoutTemplate,
  Settings,
  Building2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DemoBanner, DemoBadge } from '@/components/DemoBanner'
import { NotificationBell } from '@/components/NotificationBell'

export default function Layout() {
  const { user, signOut, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!isAuthenticated) {
    return <Outlet />
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Minhas Certificações', path: '/certificacoes', icon: ShieldCheck },
    { label: 'Meus Modelos', path: '/modelos', icon: LayoutTemplate },
    ...(user?.role === 'admin'
      ? [
          { label: 'Área Admin', path: '/admin', icon: Building2 },
          { label: 'Gerenciar Modelos', path: '/admin/modelos', icon: Settings },
        ]
      : []),
    { label: 'Documentos', path: '/documentos', icon: FileText },
    { label: 'Agendamentos', path: '/agendamentos', icon: Calendar },
    { label: 'Meu Perfil', path: '/perfil', icon: User },
  ]

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col md:flex-row">
      <aside className="hidden md:flex md:w-64 flex-col bg-[#003B73] text-white border-r border-blue-900 shrink-0">
        <div className="p-6 border-b border-blue-900/50 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 text-white font-black text-xl">ISO</div>
          <div>
            <h1 className="font-bold text-base leading-tight">Certificação ISO</h1>
            <p className="text-xs text-blue-200">Portal de Qualidade</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#0055A4] text-white font-semibold shadow-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-rose-500/20 hover:text-rose-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#003B73] text-white z-50 flex flex-col transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-white/10 text-white font-black">ISO</div>
            <span className="font-bold text-base">Portal de Certificação</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-blue-200 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#0055A4] text-white font-semibold'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-200 hover:bg-rose-500/20"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <DemoBanner />
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <DemoBadge />
            <span className="text-xs md:text-sm text-slate-500 font-medium hidden sm:inline-block">
              Portal de Adequação ISO 9001, 14001 e 45001
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors">
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#0055A4] text-white text-xs font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-800 hidden md:inline-block">
                    {user?.name || user?.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">{user?.name || 'Usuário'}</p>
                  <p className="text-xs font-normal text-slate-500 truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/perfil')} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/certificacoes')}
                  className="cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Certificações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-rose-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
          © {new Date().getFullYear()} Portal de Certificação ISO. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  )
}
