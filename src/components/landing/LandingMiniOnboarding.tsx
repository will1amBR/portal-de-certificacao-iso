import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Sparkles,
  Award,
  ArrowRight,
  Play,
  Kanban,
  CheckCircle2,
  FileText,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import { cn } from '@/lib/utils'

export function LandingMiniOnboarding() {
  const [activeStep, setActiveStep] = useState(0)
  const [tourModalOpen, setTourModalOpen] = useState(false)

  const steps = [
    {
      id: 0,
      stepNum: '01',
      title: 'CNPJ e Segmento',
      shortLabel: 'CNPJ',
      subtitle: 'Identificação imediata',
      desc: 'Informe o CNPJ da sua empresa. Nosso sistema identifica a atividade principal e prepara a estrutura para ISO 9001, 14001 ou 45001.',
      icon: Building2,
      badge: 'Passo 1',
      color: 'text-blue-600',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      preview: {
        title: 'Cadastro Automatizado',
        tags: ['CNPJ Válido', 'Dados da Empresa', 'Setor Automático'],
        detail: 'Ex: Construtora Horizonte S.A. • Engenharia e Obras',
      },
    },
    {
      id: 1,
      stepNum: '02',
      title: 'Modelo de Negócio',
      shortLabel: 'Modelo',
      subtitle: 'Personalização dos requisitos',
      desc: 'Escolha seu setor de atuação (Comércio, Construtora ou Serviços). Os modelos aplicam cláusulas, pesos e riscos personalizados ao seu nicho.',
      icon: Layers,
      badge: 'Passo 2',
      color: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      preview: {
        title: 'Templates por Segmento',
        tags: ['Construção Civil', 'Comércio Geral', 'Prestação de Serviços'],
        detail: '42 tarefas e 18 procedimentos normativos mapeados',
      },
    },
    {
      id: 2,
      stepNum: '03',
      title: 'Certificação & Pipes',
      shortLabel: 'Certificação',
      subtitle: 'Gestão visual ágil até o selo',
      desc: 'Acompanhe tarefas em Kanban, aprove documentos com auditor técnico e conclua a auditoria oficial de certificação sem dor de cabeça.',
      icon: Award,
      badge: 'Passo 3',
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      preview: {
        title: 'Pronto para Auditoria',
        tags: ['Pipes de Cláusulas', 'Evidências V1.0', '100% Conforme'],
        detail: 'Painel com índice de maturidade e relatório para diretoria',
      },
    },
  ]

  const current = steps[activeStep]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-sky-50/40 to-white border-b border-slate-200/80">
      {/* Interactive tour modal triggerable directly from the landing section */}
      <OnboardingTour
        open={tourModalOpen}
        onClose={() => setTourModalOpen(false)}
        initialStep={1}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0055A4] text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Onboarding Rápido e Descomplicado
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Como funciona o portal do início ao fim
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              Três passos simples para iniciar a estruturação da sua empresa com templates
              automáticos e apoio dos nossos auditores.
            </p>
          </div>

          <Button
            onClick={() => setTourModalOpen(true)}
            variant="outline"
            className="border-[#0055A4] text-[#0055A4] hover:bg-blue-50 font-semibold whitespace-nowrap min-h-[42px] shrink-0 cursor-pointer shadow-xs"
          >
            <Play className="h-4 w-4 mr-2 fill-current" />
            Assistir Tour Completo (5 Steps)
          </Button>
        </div>

        {/* 3 Step Interactive Stepper Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {steps.map((s, idx) => {
            const Icon = s.icon
            const isActive = activeStep === idx
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer',
                  isActive
                    ? 'bg-white border-[#0055A4] shadow-md ring-2 ring-[#0055A4]/15'
                    : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white',
                )}
              >
                <div
                  className={cn(
                    'p-2.5 rounded-lg shrink-0 transition-colors',
                    isActive ? 'bg-[#0055A4] text-white' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {s.stepNum}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-[#0055A4] bg-blue-50 px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-slate-900 truncate mt-0.5">{s.title}</p>
                  <p className="text-xs text-slate-500 truncate">{s.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Dynamic Interactive Stage Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-semibold px-2.5 py-0.5',
                    current.bgLight,
                    current.color,
                    current.borderColor,
                  )}
                >
                  {current.badge} • Passo a Passo
                </Badge>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500 font-medium">
                  Tempo estimado: 40 segundos
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{current.desc}</p>

              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <Link to="/signup">
                  <Button className="bg-[#00A86B] hover:bg-emerald-600 text-white font-semibold whitespace-nowrap min-h-[40px] px-5 shadow-sm">
                    Iniciar Meu Onboarding <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setTourModalOpen(true)}
                  className="text-[#0055A4] hover:bg-blue-50 text-xs whitespace-nowrap min-h-[40px] cursor-pointer"
                >
                  Ver todos os 5 módulos do portal <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>

            {/* Right Interactive Visual Simulation */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">
                      {current.preview.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Simulação</span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {current.preview.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 shadow-2xs"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 font-medium">
                    {current.preview.detail}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0055A4]" /> ISO 9001 / 14001 / 45001
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="text-[#0055A4] hover:underline font-semibold cursor-pointer"
                  >
                    Próximo passo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
