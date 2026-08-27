import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function DemoBanner({ onOpenTour }: { onOpenTour?: () => void }) {
  const { isDemoMode, user, userRole } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!isDemoMode || dismissed) return null

  const roleLabel =
    userRole === 'admin'
      ? 'Empresa de Auditoria (ALC Certificadora)'
      : userRole === 'consultor'
        ? 'Auditor / Consultor Técnico (Ana Costa)'
        : 'Cliente (Construtora Horizonte)'

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white px-4 py-2 flex items-center justify-between gap-3 text-xs md:text-sm shadow-sm z-40 border-b border-orange-700">
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded text-[11px]">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          Modo Demo
        </div>
        <span className="text-white font-medium">
          Conectado como <strong>{user?.name || roleLabel}</strong> ({roleLabel}). Explore
          livremente as ferramentas.
        </span>
        {onOpenTour && (
          <button
            type="button"
            onClick={onOpenTour}
            className="text-yellow-200 hover:text-white underline font-semibold text-xs ml-1 cursor-pointer"
          >
            Ver Tour de Onboarding
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1.5 hover:bg-white/20 rounded-md transition-colors shrink-0 text-white/90 hover:text-white min-w-[28px] min-h-[28px] flex items-center justify-center cursor-pointer"
        aria-label="Ocultar aviso de demonstração"
        title="Ocultar aviso"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function DemoBadge() {
  const { isDemoMode } = useAuth()
  if (!isDemoMode) return null

  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-sm border border-amber-400/30">
      <Sparkles className="h-3 w-3 text-yellow-200" />
      Demo Ativa
    </span>
  )
}
