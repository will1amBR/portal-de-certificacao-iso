import { useState } from 'react'
import {
  ShieldCheck,
  Zap,
  Kanban,
  FileCheck,
  Users2,
  BarChart3,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoSelector } from '@/components/DemoSelector'

export function LandingInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'pipes' | 'kpis' | 'templates'>('pipes')

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Demonstração Visual
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Veja a plataforma em ação
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Interfaces intuitivas inspiradas no padrão Pipefy, relatórios em tempo real e automação
            completa para sua certificação.
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setActiveTab('pipes')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'pipes'
                  ? 'bg-[#003B73] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Kanban className="h-4 w-4" /> Gestão em Pipes (Kanban)
            </button>
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'kpis'
                  ? 'bg-[#003B73] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" /> Indicadores & KPIs
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'templates'
                  ? 'bg-[#003B73] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className="h-4 w-4" /> Templates por Segmento
            </button>
          </div>
        </div>

        {/* Mock Preview Card with real look */}
        <div className="bg-slate-900 rounded-2xl p-2 md:p-3 shadow-2xl border border-slate-800 max-w-5xl mx-auto">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-slate-400 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="font-mono text-[11px] text-slate-400">portal-iso.alc.com.br/app</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
              Online
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 md:p-6 text-slate-900 min-h-[380px]">
            {activeTab === 'pipes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <span className="p-1.5 bg-blue-600 text-white rounded-lg text-xs font-black">
                        RNC
                      </span>
                      Pipe: Relatório de Não-Conformidade & Ação Corretiva
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fluxo automatizado de tratamento de desvios ISO 9001 e 14001
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-xs">Ativo</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-blue-900 uppercase">
                        1. Ação Imediata
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                        2
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">RNC-042: Calibração Balança 03</p>
                        <p className="text-[11px] text-slate-500 mt-1">Origem: Auditoria Interna</p>
                        <span className="inline-block mt-2 text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                          Crítica
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">RNC-043: Descarte de Efluentes</p>
                        <p className="text-[11px] text-slate-500 mt-1">Origem: Monitoramento</p>
                        <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                          Média
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-blue-900 uppercase">
                        2. Análise da Causa
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                        1
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <p className="font-bold text-slate-800">RNC-039: Procedimento de Solda</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Diagrama de Ishikawa aplicado
                      </p>
                      <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                        Em Análise
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-emerald-900 uppercase">
                        3. Eficácia Validada
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                        5
                      </span>
                    </div>
                    <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs">
                      <p className="font-bold text-slate-800">RNC-038: Treinamento NR-35</p>
                      <p className="text-[11px] text-slate-500 mt-1">100% da equipe capacitada</p>
                      <span className="inline-block mt-2 text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                        Concluído
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kpis' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Painel Executivo de Conformidade & Metas
                    </h4>
                    <p className="text-xs text-slate-500">
                      Indicadores automáticos atualizados por cada tarefa e evidência
                    </p>
                  </div>
                  <Badge className="bg-[#0055A4] text-white">Tempo Real</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">
                      ISO 9001 — Qualidade
                    </span>
                    <p className="text-2xl font-black text-blue-600 mt-1">94.8%</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      ▲ +3.2% vs mês anterior
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">Meta: ≥ 90% de conformidade</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">
                      ISO 14001 — Ambiental
                    </span>
                    <p className="text-2xl font-black text-emerald-600 mt-1">98.1%</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      0 autuações ambientais
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">Meta: 100% destinação correta</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">ISO 45001 — SSO</span>
                    <p className="text-2xl font-black text-amber-600 mt-1">420 dias</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Sem acidentes com afastamento
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">APR 100% atualizada</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Biblioteca de Modelos & Automação
                    </h4>
                    <p className="text-xs text-slate-500">
                      Estrutura pronta disparada no momento em que a empresa cadastra seu CNPJ
                    </p>
                  </div>
                  <Badge className="bg-purple-600 text-white">Auto-instanciação</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-xs text-slate-900">🏗️ Construtora & Obras</p>
                    <ul className="text-xs text-slate-600 mt-2 space-y-1.5">
                      <li>• Controle de ARTs e RRTs</li>
                      <li>• PGR e PCMSO digital</li>
                      <li>• Checklist diário de canteiro</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-xs text-slate-900">🏪 Varejo & Mercados</p>
                    <ul className="text-xs text-slate-600 mt-2 space-y-1.5">
                      <li>• Alvarás e Vigilância Sanitária</li>
                      <li>• Controle de validade e descarte</li>
                      <li>• Homologação de fornecedores</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-xs text-slate-900">🛠️ Serviços & Consultoria</p>
                    <ul className="text-xs text-slate-600 mt-2 space-y-1.5">
                      <li>• Contratos e SLAs</li>
                      <li>• Pesquisa de satisfação (NPS)</li>
                      <li>• Gestão de competências</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to try demo */}
        <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-sm text-slate-600 font-medium">
            Experimente agora mesmo com dados de exemplo:
          </p>
          <DemoSelector />
        </div>
      </div>
    </section>
  )
}
