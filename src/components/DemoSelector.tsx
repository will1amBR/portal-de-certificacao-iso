import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, ClipboardCheck, Landmark, ChevronDown, Loader2, Users } from 'lucide-react'
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
    email: 'demo.cliente@portal-iso.com',
    label: 'Cliente (Construtora)',
    description:
      'Construtora Horizonte — Acompanhe certificações, envie documentos e veja o progresso.',
    icon: Building2,
    redirect: '/dashboard',
  },
  {
    email: 'demo.auditor@portal-iso.com',
    label: 'Auditor',
    description:
      'Ana Costa — Analise documentos, agende auditorias e gerencie tarefas dos clientes.',
    icon: ClipboardCheck,
    redirect: '/dashboard',
  },
  {
    email: 'demo.admin@portal-iso.com',
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

  const handleSelect = async (email: string, redirect: string) => {
    setLoadingEmail(email)
    const { error } = await signInAsDemo(email)
    if (error) {
      toast.error('Não foi possível entrar como demo. Tente novamente.')
      setLoadingEmail(null)
    } else {
      toast.success('Entrando na conta demo...')
      navigate(redirect)
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
            isHero
              ? 'bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm'
              : 'w-full border-slate-300 text-slate-700 hover:bg-slate-50',
          )}
        >
          {loadingEmail ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Users className="h-4 w-4" />
          )}
          Entrar como Demo
          {!loadingEmail && <ChevronDown className="h-4 w-4 ml-1" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-80">
        <DropdownMenuLabel>Escolha um perfil demo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {demoAccounts.map((acc) => {
          const Icon = acc.icon
          return (
            <DropdownMenuItem
              key={acc.email}
              onClick={() => handleSelect(acc.email, acc.redirect)}
              className="cursor-pointer p-3"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{acc.label}</p>
                  <p className="text-xs text-slate-500">{acc.description}</p>
                </div>
                {loadingEmail === acc.email && (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                )}
              </div>
            </DropdownMenuItem>
          )
        })}
        <div className="px-3 py-2 text-[10px] text-slate-400 text-center border-t mt-1">
          Todas as contas usam a senha: Skip@Pass
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
