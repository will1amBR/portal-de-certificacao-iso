import { useState, useEffect } from 'react'
import {
  Plus,
  Lock,
  Search,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  HelpCircle,
  Database,
} from 'lucide-react'
import { Pipe, getPipes } from '@/services/pipes'
import { getAllCards, PipeCard } from '@/services/cards'
import { getPipeIcon, getPipeHeaderColor, getPipeBgCard } from './pipeIcons'
import { PipeKanbanView } from './PipeKanbanView'
import { NewPipeDialog } from './NewPipeDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PipesGridProps {
  certId?: string
  defaultOpenPipeId?: string
}

export function PipesGrid({ certId, defaultOpenPipeId }: PipesGridProps) {
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [cards, setCards] = useState<PipeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPipe, setSelectedPipe] = useState<Pipe | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<'Pipes' | 'Databases'>('Pipes')

  const loadData = async () => {
    try {
      const [pipesData, cardsData] = await Promise.all([
        getPipes(),
        getAllCards().catch(() => [] as PipeCard[]),
      ])
      setPipes(pipesData)
      setCards(cardsData)

      if (defaultOpenPipeId && !selectedPipe) {
        const found = pipesData.find((p) => p.id === defaultOpenPipeId)
        if (found) setSelectedPipe(found)
      }
    } catch {
      toast.error('Erro ao carregar dados de Pipes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [certId])

  useRealtime('pipes', () => {
    loadData()
  })
  useRealtime('pipe_cards', () => {
    loadData()
  })

  // Count cards per pipe
  const getPipeCardsCount = (pipeId: string) => {
    return cards.filter((c) => {
      if (c.pipe !== pipeId) return false
      if (certId && c.certification && c.certification !== certId) return false
      return true
    }).length
  }

  const filteredPipes = pipes.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      (p.code && p.code.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  })

  // If a pipe is currently opened, display its Kanban View
  if (selectedPipe) {
    return (
      <PipeKanbanView pipe={selectedPipe} certId={certId} onBack={() => setSelectedPipe(null)} />
    )
  }

  return (
    <div className="space-y-6">
      {/* Pipefy-like sub navigation: Pipes / Databases & Search */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveSubTab('Pipes')}
            className={cn(
              'text-sm font-semibold pb-2 -mb-3 transition-colors relative',
              activeSubTab === 'Pipes'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            Pipes
          </button>
          <button
            onClick={() => setActiveSubTab('Databases')}
            className={cn(
              'text-sm font-semibold pb-2 -mb-3 transition-colors relative',
              activeSubTab === 'Databases'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            Databases
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar pipes, processos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs pl-9 bg-white border-slate-200"
            />
          </div>
          <NewPipeDialog onCreated={loadData} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
        </div>
      ) : activeSubTab === 'Databases' ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Bases de Conhecimento e Registros ISO
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Visualize o catálogo mestre de procedimentos, fornecedores homologados, registros de
            calibração e listas de presença estruturadas.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveSubTab('Pipes')}
            className="text-xs"
          >
            Voltar para os Pipes
          </Button>
        </div>
      ) : (
        /* Pipefy-like Grid of cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Create pipe card tile (Pipefy style) */}
          <NewPipeDialog
            onCreated={loadData}
            trigger={
              <button
                type="button"
                className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white/70 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-3 transition-all group shadow-sm cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Criar pipe
                </span>
              </button>
            }
          />

          {/* Pipe Cards Grid */}
          {filteredPipes.map((pipe) => {
            const Icon = getPipeIcon(pipe.icon)
            const count = getPipeCardsCount(pipe.id)
            const headerColor = getPipeHeaderColor(pipe.code, pipe.color)
            const bgClass = getPipeBgCard(pipe.code)

            return (
              <div
                key={pipe.id}
                onClick={() => setSelectedPipe(pipe)}
                className={cn(
                  'h-44 rounded-2xl border p-4 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden bg-white/90',
                  bgClass,
                )}
              >
                {/* Icon in upper left with nice colored square */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={cn(
                        'h-9 w-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform',
                        headerColor,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-3 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                    {pipe.title}
                  </h3>
                </div>

                {/* Footer of the card: Card count and lock icon */}
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100/80">
                  <span className="font-medium text-[11px] text-slate-600">
                    {count} {count === 1 ? 'card' : 'cards'}
                  </span>
                  <Lock className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-600" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
