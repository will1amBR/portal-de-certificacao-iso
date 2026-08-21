import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  ClipboardCheck,
  Landmark,
  ChevronDown,
  Loader2,
  Users,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const demoAccounts = [
  {
    email: 'demo.cliente@alc.com.br',
    label: 'Cliente (Construtora)',
    description:
      'Construtora Horizonte — Acompanhe certificações, envie documentos e veja o progresso.',
    icon: Building2,
    redirect: '/app',
  },
  {
    email: 'demo.auditor@alc.com.br',
    label: 'Auditor',
    description:
      'Ana Costa — Analise documentos, agende auditorias e gerencie tarefas dos clientes.',
    icon: ClipboardCheck,
    redirect: '/dashboard',
  },
  {
    email: 'demo.admin@alc.com.br',
    label: 'Empresa de Auditoria',
    description: 'ALC Certificadora — Gerencie clientes, certificações, modelos e visualize KPIs.',
    icon: Landmark,
    redirect: '/admin',
  },
]

export function DemoSelector({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const { signInAsDemo } = useAuth()
  const navigate = useNavigate()
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null)

  const handleSelect = async (email: string, redirect: string, label: string) => {
    setLoadingEmail(email)
    try {
      const { error } = await signInAsDemo(email)
      if (error) {
        toast.error('Não foi possível entrar como demo. Tente novamente.')
        setLoadingEmail(null)
      } else {
        toast.success(`Acessando como ${label}!`)
        navigate(redirect)
      }
    } catch {
      toast.error('Erro na conexão. Tente novamente.')
      setLoadingEmail(null)
    }
  }

  const isHero = variant === 'hero'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isHero ? 'secondary' : 'outline'}
          disabled={loadingEmail !== null}
          className={cn(
            'gap-2 font-semibold transition-all',
            isHero
              ? 'bg-white/15 border-white/40 text-white hover:bg-white/25 backdrop-blur-md shadow-md text-sm px-5 py-2.5 h-auto'
              : 'w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm',
          )}
        >
          {loadingEmail ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Users className="h-4 w-4 text-sky-300" />
          )}
          <span>{loadingEmail ? 'Carregando perfil...' : 'Explorar Demo (3 Perfis)'}</span>
          {!loadingEmail && <ChevronDown className="h-4 w-4 opacity-70" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-96 p-2 shadow-xl border-slate-200">
        <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mb-2">
          <DropdownMenuLabel className="p-0 text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Demonstração Interativa
          </DropdownMenuLabel>
          <p className="text-xs text-slate-600 mt-0.5">
            Selecione o perfil desejado para navegar com dados reais pré-carregados
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <div className="space-y-1">
          {demoAccounts.map((acc) => {
            const Icon = acc.icon
            const isLoading = loadingEmail === acc.email
            return (
              <DropdownMenuItem
                key={acc.email}
                onClick={() => handleSelect(acc.email, acc.redirect, acc.label)}
                disabled={loadingEmail !== null}
                className="cursor-pointer p-3 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50/50 flex flex-col items-start transition-all"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-[#003B73] text-white shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{acc.label}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {acc.description}
                    </p>
                  </div>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0055A4] shrink-0" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>

        <div className="px-3 py-2 text-[11px] text-slate-500 text-center bg-slate-50 rounded-md mt-2 border border-slate-100">
          Acesso instantâneo com permissões completas
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
