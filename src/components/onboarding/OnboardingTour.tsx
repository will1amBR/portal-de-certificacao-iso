import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Building2,
  Kanban,
  FileCheck2,
  Rocket,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  CalendarCheck,
  FileText,
  BadgeCheck,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface OnboardingTourProps {
  open: boolean
  onClose: () => void
  onComplete?: () => void
  initialStep?: number
  mode?: 'modal' | 'embedded'
}

interface TourStep {
  id: number
  badge: string
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  color: string
  bgLight: string
  borderColor: string
  highlights: { title: string; desc: string; icon: React.ElementType }[]
  previewType: 'overview' | 'flow' | 'kanban' | 'docs' | 'ready'
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    badge: 'Visão Geral do Portal',
    title: 'Bem-vindo ao Portal de Certificação ISO',
    subtitle:
      'Sua plataforma integrada para certificação 9001, 14001 e 45001 com apoio especializado',
    description:
      'Desenvolvido para simplificar todo o ciclo de conformidade normativa da sua empresa, desde o diagnóstico inicial até a emissão do certificado auditado.',
    icon: ShieldCheck,
    color: 'text-[#0055A4]',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    highlights: [
      {
        title: '3 Normas Principais',
        desc: 'ISO 9001 (Qualidade), ISO 14001 (Meio Ambiente) e ISO 45001 (Saúde & Segurança).',
        icon: BadgeCheck,
      },
      {
        title: 'Templates Inteligentes',
        desc: 'Checklists, políticas e formulários adaptados ao seu segmento de atuação.',
        icon: Sparkles,
      },
      {
        title: 'Consultoria Integrada',
        desc: 'Comunicação direta com auditores e consultores técnicos em cada etapa.',
        icon: FileCheck2,
      },
    ],
    previewType: 'overview',
  },
  {
    id: 2,
    badge: 'Fluxo Simples',
    title: 'Como Funciona a Jornada?',
    subtitle: 'Quatro etapas lineares e transparentes para estruturar sua empresa',
    description:
      'Em menos de 2 minutos você configura sua organização e recebe o plano de trabalho completo com cronograma estimado.',
    icon: Layers,
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    highlights: [
      {
        title: '1. CNPJ e Dados Básicos',
        desc: 'Identificação imediata da razão social e segmento da empresa.',
        icon: Building2,
      },
      {
        title: '2. Modelo de Negócio',
        desc: 'Escolha seu setor (Comércio, Construção, Serviços ou Indústria).',
        icon: Layers,
      },
      {
        title: '3. Geração Automática',
        desc: 'Criação instantânea de tarefas, documentos e pipes por cláusula ISO.',
        icon: Sparkles,
      },
    ],
    previewType: 'flow',
  },
  {
    id: 3,
    badge: 'Gestão Ágil',
    title: 'Seus Módulos (Pipes & Kanban)',
    subtitle: 'Organização visual no padrão Pipefy por cláusulas e requisitos ISO',
    description:
      'Cada norma conta com pipes pré-configurados para gerenciar não-conformidades, riscos, oportunidades, auditorias internas e melhorias contínuas.',
    icon: Kanban,
    color: 'text-sky-600',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-200',
    highlights: [
      {
        title: 'Kanban Interativo',
        desc: 'Mova cards entre Triagem, Em Análise, Plano de Ação e Concluído.',
        icon: Kanban,
      },
      {
        title: 'Cláusulas Mapeadas',
        desc: 'Requisitos 4 a 10 das normas ISO divididos por áreas operacionais.',
        icon: CheckCircle2,
      },
      {
        title: 'Prazos e Responsáveis',
        desc: 'Atribua auditores e prazos com alertas automáticos de vencimento.',
        icon: CalendarCheck,
      },
    ],
    previewType: 'kanban',
  },
  {
    id: 4,
    badge: 'Evidências & Auditoria',
    title: 'Documentos e Agendamentos',
    subtitle: 'Central unificada para controle de versões, aprovações e datas de auditoria',
    description:
      'Elimine planilhas soltas. Faça upload de procedimentos e políticas, receba pareceres dos consultores e agende auditorias presenciais ou remotas.',
    icon: FileText,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    highlights: [
      {
        title: 'Repositório de Evidências',
        desc: 'Upload seguro com controle de versões (V1.0, V2.0) e status de aprovação.',
        icon: FileText,
      },
      {
        title: 'Agenda de Auditorias',
        desc: 'Sessões de alinhamento e auditorias de certificação com link de videoconferência.',
        icon: CalendarCheck,
      },
      {
        title: 'Relatórios Executivos',
        desc: 'Exportação em PDF do índice de maturidade para a diretoria.',
        icon: BadgeCheck,
      },
    ],
    previewType: 'docs',
  },
  {
    id: 5,
    badge: 'Hora de Configurar',
    title: 'Pronto para Começar!',
    subtitle: 'Vamos dar o primeiro passo configurando o perfil da sua empresa',
    description:
      'O assistente a seguir levará menos de 1 minuto. Ao informar seu CNPJ e modelo de negócio, todo o ambiente será preparado automaticamente.',
    icon: Rocket,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    highlights: [
      {
        title: 'Passo 1: CNPJ',
        desc: 'Informe o número do documento da sua empresa.',
        icon: Building2,
      },
      {
        title: 'Passo 2: Modelo',
        desc: 'Selecione a atividade predominante do negócio.',
        icon: Layers,
      },
      {
        title: 'Passo 3: Começar',
        desc: 'Acesse o dashboard com todos os templates já carregados.',
        icon: Rocket,
      },
    ],
    previewType: 'ready',
  },
]

export function OnboardingTour({
  open,
  onClose,
  onComplete,
  initialStep = 1,
  mode = 'modal',
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  useEffect(() => {
    if (open) {
      setCurrentStep(initialStep)
    }
  }, [open, initialStep])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && currentStep < TOUR_STEPS.length) {
        setCurrentStep((s) => s + 1)
      }
      if (e.key === 'ArrowLeft' && currentStep > 1) {
        setCurrentStep((s) => s - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, currentStep, onClose])

  if (!open) return null

  const stepData = TOUR_STEPS[currentStep - 1]
  const isLastStep = currentStep === TOUR_STEPS.length
  const StepIcon = stepData.icon

  const handleNext = () => {
    if (isLastStep) {
      if (onComplete) {
        onComplete()
      } else {
        onClose()
      }
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  const renderVisualPreview = (type: TourStep['previewType']) => {
    switch (type) {
      case 'overview':
        return (
          <div className="space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Tríade de Certificação</span>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Totalmente Integrado
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-xs font-bold text-[#0055A4] block">ISO 9001</span>
                  <span className="text-[10px] text-slate-500">Qualidade</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700 block">ISO 14001</span>
                  <span className="text-[10px] text-slate-500">Ambiental</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                  <span className="text-xs font-bold text-rose-700 block">ISO 45001</span>
                  <span className="text-[10px] text-slate-500">SST</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-900/5 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0055A4]" />
                <span className="text-slate-700 font-medium">
                  Templates inteligentes pré-carregados
                </span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                Prontos
              </span>
            </div>
          </div>
        )

      case 'flow':
        return (
          <div className="space-y-2">
            {[
              { num: '01', title: 'CNPJ da Empresa', status: 'Identificação rápida', done: true },
              {
                num: '02',
                title: 'Modelo de Negócio',
                status: 'Adequação de templates',
                done: true,
              },
              {
                num: '03',
                title: 'Geração de Tarefas & Pipes',
                status: 'Automação total',
                done: true,
              },
              {
                num: '04',
                title: 'Acompanhamento & Auditoria',
                status: 'Conquista do selo ISO',
                done: false,
              },
            ].map((f, idx) => (
              <div
                key={f.num}
                className={cn(
                  'flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all',
                  idx === 0
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-slate-200 text-slate-700',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]',
                      idx === 0 ? 'bg-[#0055A4] text-white' : 'bg-slate-200 text-slate-700',
                    )}
                  >
                    {f.num}
                  </span>
                  <div>
                    <p className="font-semibold">{f.title}</p>
                    <p className="text-[10px] text-slate-500">{f.status}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        )

      case 'kanban':
        return (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Kanban className="h-3.5 w-3.5 text-sky-600" /> Pipe: Não Conformidades
              </span>
              <span className="text-[10px] text-slate-500">Padrão Pipefy</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-800 block mb-1">Triagem (2)</span>
                <div className="p-1.5 bg-slate-50 rounded text-slate-600 text-[9px] mb-1">
                  Calibração de Manômetro
                </div>
                <div className="p-1.5 bg-slate-50 rounded text-slate-600 text-[9px]">
                  Revisão de EPI
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-blue-200 shadow-2xs bg-blue-50/30">
                <span className="font-bold text-blue-900 block mb-1">Em Análise (1)</span>
                <div className="p-1.5 bg-blue-100/70 text-blue-900 rounded text-[9px]">
                  Treinamento ISO 9001
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200 shadow-2xs bg-emerald-50/30">
                <span className="font-bold text-emerald-900 block mb-1">Concluído (4)</span>
                <div className="p-1.5 bg-emerald-100/70 text-emerald-900 rounded text-[9px]">
                  Política da Qualidade
                </div>
              </div>
            </div>
          </div>
        )

      case 'docs':
        return (
          <div className="space-y-2">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-blue-50 text-[#0055A4]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Manual da Qualidade (PQ-01)</p>
                  <p className="text-[10px] text-slate-500">Versão 2.1 • Aprovado pelo auditor</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 text-[10px] hover:bg-emerald-100">
                Aprovado
              </Badge>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-indigo-50 text-indigo-600">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Auditoria Interna Fase 1</p>
                  <p className="text-[10px] text-slate-500">
                    Agendado para próxima semana • Online
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] bg-sky-50 text-sky-800 border-sky-200"
              >
                Confirmado
              </Badge>
            </div>
          </div>
        )

      case 'ready':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-4 rounded-xl border border-blue-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Rocket className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Tudo pronto para a sua jornada!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Clique no botão abaixo para preencher o CNPJ e selecionar o seu modelo de negócio.
            </p>
          </div>
        )
    }
  }

  return (
    <div
      className={cn(
        mode === 'modal'
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200'
          : 'w-full',
      )}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col',
          mode === 'modal' ? 'max-h-[90vh]' : '',
        )}
      >
        {/* Modal Top Bar with Stepper and Close */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[#003B73] text-white font-black text-xs">ISO</div>
            <div>
              <p className="text-xs font-bold text-slate-900">Guia Rápido de Introdução</p>
              <p className="text-[11px] text-slate-500">
                Passo {currentStep} de {TOUR_STEPS.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step progress pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {TOUR_STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={cn(
                    'h-2 rounded-full transition-all cursor-pointer',
                    s.id === currentStep
                      ? 'w-7 bg-[#0055A4]'
                      : s.id < currentStep
                        ? 'w-3.5 bg-blue-300'
                        : 'w-2 bg-slate-200',
                  )}
                  title={`Ir para o Passo ${s.id}: ${s.title}`}
                  aria-label={`Ir para o Passo ${s.id}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer min-h-[36px] min-w-[36px]"
              aria-label="Fechar tour de onboarding"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Header of the step */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  'p-3 rounded-xl shrink-0 shadow-xs border',
                  stepData.bgLight,
                  stepData.color,
                  stepData.borderColor,
                )}
              >
                <StepIcon className="h-6 w-6" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[11px] font-semibold mb-1 border',
                    stepData.bgLight,
                    stepData.color,
                    stepData.borderColor,
                  )}
                >
                  {stepData.badge}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {stepData.title}
                </h3>
                <p className="text-sm font-medium text-slate-600 mt-1">{stepData.subtitle}</p>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {stepData.description}
          </p>

          {/* Grid with visual preview and feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Visual Interactive Preview Box */}
            <div className="md:col-span-5 bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/90 flex flex-col justify-between min-h-[190px]">
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Prévia em Tempo Real
                </span>
                {renderVisualPreview(stepData.previewType)}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-2 pt-2 border-t border-slate-200/60">
                <HelpCircle className="h-3 w-3" />
                <span>Dados de exemplo do portal</span>
              </div>
            </div>

            {/* Highlights List */}
            <div className="md:col-span-7 space-y-2.5">
              {stepData.highlights.map((h, i) => {
                const HIcon = h.icon
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-200 transition-colors flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-[#0055A4] shrink-0 mt-0.5">
                      <HIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-snug">{h.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation Actions */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 whitespace-nowrap min-h-[40px] px-3 cursor-pointer"
            >
              Pular tour
            </Button>
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="text-xs text-slate-700 whitespace-nowrap min-h-[40px] px-3 border-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleNext}
              className={cn(
                'text-xs font-semibold whitespace-nowrap min-h-[40px] px-5 text-white shadow-sm cursor-pointer',
                isLastStep
                  ? 'bg-[#00A86B] hover:bg-emerald-600'
                  : 'bg-[#0055A4] hover:bg-[#1A73E8]',
              )}
            >
              {isLastStep ? (
                <>
                  Vamos começar <ArrowRight className="h-4 w-4 ml-1.5" />
                </>
              ) : (
                <>
                  Próximo <ChevronRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
