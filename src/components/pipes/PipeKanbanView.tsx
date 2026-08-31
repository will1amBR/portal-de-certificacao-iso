import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Sparkles,
  Bot,
  Zap,
  Share2,
  HelpCircle,
  Calendar,
  Building,
  UserCheck,
  Mail,
  Phone,
  Info,
} from 'lucide-react'
import { Pipe } from '@/services/pipes'
import { PipeCard, getCardsByPipe, moveCardStage } from '@/services/cards'
import { getPipeIcon, getPipeHeaderColor } from './pipeIcons'
import { NewCardDialog } from './NewCardDialog'
import { CardDetailDialog } from './CardDetailDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PipeKanbanViewProps {
  pipe: Pipe
  certId?: string
  onBack: () => void
}

export function PipeKanbanView({ pipe, certId, onBack }: PipeKanbanViewProps) {
  const [cards, setCards] = useState<PipeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<
    'Kanban' | 'Lista' | 'Relatórios' | 'Formulário' | 'Emails' | 'Painéis' | 'Learning Center'
  >('Kanban')
  const [selectedCard, setSelectedCard] = useState<PipeCard | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  const Icon = getPipeIcon(pipe.icon)
  const headerColor = getPipeHeaderColor(pipe.code, pipe.color)
  const stages =
    Array.isArray(pipe.stages) && pipe.stages.length > 0
      ? pipe.stages
      : ['Ação Imediata', 'Análise da Causa', 'Ação Corretiva', 'Analisado a Eficácia', 'Concluído']

  const loadCards = async () => {
    try {
      const data = await getCardsByPipe(pipe.id, certId)
      setCards(data)
    } catch {
      // Falha ou isolamento de dados
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCards()
  }, [pipe.id, certId])

  useRealtime('pipe_cards', () => {
    loadCards()
  })

  const filteredCards = cards.filter((c) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const deptName = c.data?.department_name || c.data?.assigned_sector || ''
    const deptMgr = c.data?.department_manager || ''
    return (
      c.title.toLowerCase().includes(q) ||
      (c.origin && c.origin.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      deptName.toLowerCase().includes(q) ||
      deptMgr.toLowerCase().includes(q)
    )
  })

  const handleCardClick = (card: PipeCard) => {
    setSelectedCard(card)
    setDetailOpen(true)
  }

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId)
    setDraggingCardId(cardId)
  }

  const handleDragOver = (e: React.DragEvent, stageName: string) => {
    e.preventDefault()
    if (dragOverStage !== stageName) {
      setDragOverStage(stageName)
    }
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    setDragOverStage(null)
    const cardId = e.dataTransfer.getData('text/plain') || draggingCardId
    if (!cardId) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.stage === targetStage) {
      setDraggingCardId(null)
      return
    }

    // Optimistic UI update
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, stage: targetStage } : c)))
    setDraggingCardId(null)

    try {
      await moveCardStage(cardId, targetStage)
      toast.success(`Card movido para "${targetStage}"`)
    } catch {
      toast.error('Erro ao movimentar o card')
      loadCards()
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-8rem)] rounded-xl border border-slate-200 overflow-hidden flex flex-col">
      {/* Top Bar Header Style Pipefy */}
      <div className="bg-white border-b border-slate-200 px-5 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 -ml-2 h-8 px-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>

            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'p-2 rounded-lg flex items-center justify-center text-white',
                  headerColor,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 leading-none">{pipe.title}</h1>
                  <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                </div>
                {pipe.description && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{pipe.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-slate-700 bg-white border-slate-200"
            >
              <Bot className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
              Agentes de IA
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-slate-700 bg-white border-slate-200 hidden sm:flex"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              Automações
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-slate-700 bg-white border-slate-200 hidden md:flex"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Compartilhar formulário
            </Button>
          </div>
        </div>

        {/* Navigation Tabs under header (Kanban, Lista, Relatórios, etc.) */}
        <div className="flex items-center justify-between mt-3 border-t border-slate-100 pt-2 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            {[
              { id: 'Kanban', label: 'Kanban' },
              { id: 'Lista', label: 'Lista' },
              { id: 'Relatórios', label: 'Relatórios' },
              { id: 'Formulário', label: 'Formulário' },
              { id: 'Emails', label: 'Emails' },
              { id: 'Painéis', label: 'Painéis' },
              { id: 'Learning Center', label: 'Learning Center' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
                  activeTab === tab.id
                    ? 'text-blue-700 border-b-2 border-blue-600 rounded-b-none bg-blue-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Procurar cards, setores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs pl-8 bg-white border-slate-200"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Kanban Content Area */}
      {activeTab === 'Kanban' ? (
        <div className="flex-1 p-4 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
            </div>
          ) : (
            <div className="flex items-start gap-4 pb-4 min-w-max">
              {stages.map((stageName, colIndex) => {
                const stageCards = filteredCards.filter((c) => c.stage === stageName)
                const isFirstCol = colIndex === 0
                const isDragTarget = dragOverStage === stageName

                return (
                  <div
                    key={stageName}
                    onDragOver={(e) => handleDragOver(e, stageName)}
                    onDrop={(e) => handleDrop(e, stageName)}
                    className={cn(
                      'w-72 md:w-80 flex-shrink-0 bg-slate-100/80 rounded-xl border transition-all flex flex-col max-h-[calc(100vh-16rem)]',
                      isDragTarget ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200/90',
                    )}
                  >
                    {/* Stage Header */}
                    <div className="p-3 bg-white rounded-t-xl border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-blue-900">{stageName}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {stageCards.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <NewCardDialog
                          pipeId={pipe.id}
                          defaultStage={stageName}
                          stages={stages}
                          certId={certId}
                          onCreated={loadCards}
                          trigger={
                            <button
                              type="button"
                              aria-label="Adicionar card na etapa"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-md min-h-[28px] min-w-[28px] flex items-center justify-center transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          }
                        />
                      </div>
                    </div>

                    {/* Column body with cards */}
                    <div className="p-2 space-y-2 overflow-y-auto flex-1 min-h-[140px]">
                      {stageCards.length === 0 ? (
                        <div className="py-8 px-4 text-center">
                          <p className="text-xs text-slate-400">
                            {isFirstCol
                              ? 'Aqui chegam os cards criados para este pipe.'
                              : 'Arraste cards para esta etapa.'}
                          </p>
                        </div>
                      ) : (
                        stageCards.map((card) => {
                          const assignedSector =
                            card.data?.department_name || card.data?.assigned_sector
                          const assignedManager = card.data?.department_manager

                          return (
                            <div
                              key={card.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, card.id)}
                              onClick={() => handleCardClick(card)}
                              className={cn(
                                'bg-white rounded-lg border border-slate-200/90 p-3 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-blue-300 group',
                                draggingCardId === card.id && 'opacity-50 scale-95',
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 font-mono">
                                  {card.title}
                                </span>
                                {card.priority === 'crítica' && (
                                  <span className="h-2 w-2 rounded-full bg-red-500 ring-2 ring-red-100" />
                                )}
                                {card.priority === 'alta' && (
                                  <span className="h-2 w-2 rounded-full bg-orange-500 ring-2 ring-orange-100" />
                                )}
                              </div>

                              {/* SOLICITAÇÃO 3: Exibição destacada do setor e responsável no card */}
                              {assignedSector && (
                                <div className="mt-2 p-1.5 rounded-md bg-blue-50/70 border border-blue-100 flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-blue-900 truncate flex items-center gap-1">
                                    <Building className="h-3 w-3 text-[#0055A4] shrink-0" />
                                    {assignedSector}
                                  </span>
                                  {assignedManager && (
                                    <span className="text-[10px] text-blue-700 font-medium truncate shrink-0">
                                      {assignedManager}
                                    </span>
                                  )}
                                </div>
                              )}

                              {card.origin && (
                                <div className="mt-2">
                                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                    ORIGEM DA NÃO-CONFORMIDADE
                                  </span>
                                  <span className="inline-block mt-0.5 text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                                    {card.origin}
                                  </span>
                                </div>
                              )}

                              {card.description && (
                                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                  {card.description}
                                </p>
                              )}

                              {card.due_date && (
                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-slate-400" />
                                    {new Date(card.due_date).toLocaleDateString('pt-BR')}
                                  </span>
                                  {card.stage === 'Concluído' ? (
                                    <span className="text-emerald-600 font-medium">Finalizado</span>
                                  ) : (
                                    <span className="text-amber-600 font-medium">Em aberto</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })
                      )}

                      {/* Add button inside column */}
                      <NewCardDialog
                        pipeId={pipe.id}
                        defaultStage={stageName}
                        stages={stages}
                        certId={certId}
                        onCreated={loadCards}
                        trigger={
                          <button
                            type="button"
                            className="w-full py-2.5 text-xs font-medium text-slate-500 hover:text-blue-700 hover:bg-white/80 rounded-md border border-dashed border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                          >
                            <Plus className="h-3.5 w-3.5 shrink-0" /> Adicionar card
                          </button>
                        }
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        /* Alternative Tab View placeholder with clean table */
        <div className="flex-1 p-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              {activeTab} - {pipe.title}
            </h2>
            <p className="text-sm text-slate-500">
              Visualização detalhada dos registros, setores responsáveis e análises associadas a
              esta cláusula ISO.
            </p>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">Código / ID</th>
                    <th className="p-3">Setor Responsável</th>
                    <th className="p-3">Origem</th>
                    <th className="p-3">Fase Atual</th>
                    <th className="p-3">Prioridade</th>
                    <th className="p-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCards.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => handleCardClick(c)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="p-3 font-mono font-medium text-blue-700">{c.title}</td>
                      <td className="p-3 font-medium text-slate-800">
                        {c.data?.department_name || c.data?.assigned_sector || 'Geral'}
                      </td>
                      <td className="p-3 text-slate-600">{c.origin || 'Geral'}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px]">
                          {c.stage}
                        </Badge>
                      </td>
                      <td className="p-3 capitalize">{c.priority || 'Normal'}</td>
                      <td className="p-3 text-slate-400">
                        {c.due_date ? new Date(c.due_date).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floating Create Card Action */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
        <NewCardDialog
          pipeId={pipe.id}
          defaultStage={stages[0] || 'Ação Imediata'}
          stages={stages}
          certId={certId}
          onCreated={loadCards}
          trigger={
            <Button className="bg-[#0055A4] hover:bg-[#004080] text-white shadow-sm font-semibold text-xs">
              <Plus className="h-4 w-4 mr-1.5" /> Criar novo card
            </Button>
          }
        />

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <HelpCircle className="h-4 w-4" />
          <span>Arraste os cards entre as colunas para atualizar a fase do processo</span>
        </div>
      </div>

      {/* Card Detail / Edit Dialog */}
      <CardDetailDialog
        card={selectedCard}
        stages={stages}
        pipeTitle={pipe.title}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdated={loadCards}
      />
    </div>
  )
}
