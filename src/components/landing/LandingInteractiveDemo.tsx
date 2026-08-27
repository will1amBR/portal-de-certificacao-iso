import { useState } from 'react'
import { Kanban, BarChart3, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function LandingInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'pipes' | 'kpis' | 'templates'>('pipes')

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Interface Intuitiva & Visual
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Visão simplificada em Pipes, indicadores atualizados e automação por modelo de negócio.
          </p>

          {/* Clean Segmented Control */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl mt-6 border border-slate-200 max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('pipes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'pipes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="h-3.5 w-3.5 text-blue-600" /> Pipes & RNCs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kpis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'kpis'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-emerald-600" /> Indicadores
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-600" /> Modelos por Setor
            </button>
          </div>
        </div>

        {/* Clean Mock Preview */}
        <div className="bg-slate-900 rounded-xl p-2.5 sm:p-3 shadow-md border border-slate-800">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-slate-400 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700 inline-block" />
            </div>
            <span className="font-mono text-[11px] text-slate-400">portal-iso/painel</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
              Online
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-slate-900">
            {activeTab === 'pipes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                      RNC
                    </span>
                    Pipe de Relatório de Não-Conformidade
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-[11px] border-emerald-300 text-emerald-700 bg-emerald-50"
                  >
                    Ativo
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wide mb-2">
                      1. Ação Imediata (2)
                    </p>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 text-xs mb-1.5">
                      <p className="font-semibold text-slate-800 text-xs">Calibração Balança 03</p>
                      <span className="text-[10px] text-rose-600 font-medium">Prioridade Alta</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                      <p className="font-semibold text-slate-800 text-xs">Descarte de Resíduos</p>
                      <span className="text-[10px] text-amber-600 font-medium">
                        Prioridade Média
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wide mb-2">
                      2. Causa Raiz (1)
                    </p>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                      <p className="font-semibold text-slate-800 text-xs">Procedimento de Solda</p>
                      <span className="text-[10px] text-blue-600 font-medium">
                        Diagrama Ishikawa
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-[11px] text-slate-500 uppercase tracking-wide mb-2">
                      3. Eficácia Validada (5)
                    </p>
                    <div className="p-2 bg-emerald-50/60 rounded border border-emerald-100 text-xs">
                      <p className="font-semibold text-slate-800 text-xs">Treinamento NR-35</p>
                      <span className="text-[10px] text-emerald-700 font-bold">100% Aprovado</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kpis' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Indicadores de Conformidade
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-[11px] border-blue-300 text-blue-700 bg-blue-50"
                  >
                    Atualizado Hoje
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">ISO 9001 - Qualidade</span>
                    <p className="text-xl font-black text-blue-600 mt-1">94.8%</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">Meta atingida (≥ 90%)</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">
                      ISO 14001 - Ambiental
                    </span>
                    <p className="text-xl font-black text-emerald-600 mt-1">98.1%</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">0 autuações registradas</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">ISO 45001 - SST</span>
                    <p className="text-xl font-black text-amber-600 mt-1">420 dias</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sem acidentes de trabalho</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Automação por Segmento de Empresa
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-[11px] border-purple-300 text-purple-700 bg-purple-50"
                  >
                    Instanciação Rápida
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 mb-1">🏗️ Construtoras & Engenharia</p>
                    <p className="text-slate-500 text-[11px]">
                      Controle de ARTs, canteiro de obras e programas PGR/PCMSO.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 mb-1">🏪 Comércio & Varejo</p>
                    <p className="text-slate-500 text-[11px]">
                      Alvarás sanitários, validade de estoque e homologação.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 mb-1">🛠️ Serviços & Tecnologia</p>
                    <p className="text-slate-500 text-[11px]">
                      SLAs contratuais, pesquisa NPS e gestão de competências.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
