import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function DemoBanner() {
  const { isDemoMode } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!isDemoMode || dismissed) return null

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-sm animate-fade-in-down">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="font-medium truncate sm:whitespace-normal">
          Você está explorando o portal em modo demonstração. Nenhum dado real é afetado.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-white/20 rounded transition-colors shrink-0"
        aria-label="Fechar banner"
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
    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 animate-fade-in">
      <Sparkles className="h-3 w-3" />
      Modo Demo
    </span>
  )
}
