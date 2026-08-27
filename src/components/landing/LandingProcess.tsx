import {
  FileText,
  Zap,
  CheckCircle2,
  Users,
  Brain,
  Bell,
  BarChart3,
  MessageSquare,
  FileCheck,
  RefreshCw,
} from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Informe seu CNPJ',
    desc: 'Cadastro rápido com identificação automática da sua empresa.',
    benefit: 'Comece em minutos, sem burocracia.',
  },
  {
    icon: Zap,
    title: 'Selecione seu modelo de negócio',
    desc: 'Escolha entre Mercado, Construtora ou Prestador de Serviços.',
    benefit: 'Templates personalizados para o seu segmento.',
  },
  {
    icon: CheckCircle2,
    title: 'Receba templates prontos',
    desc: 'Tarefas, documentos e agendamentos gerados automaticamente.',
    benefit: 'Economize semanas de trabalho manual.',
  },
  {
    icon: Users,
    title: 'Acompanhe com seu consultor',
    desc: 'Suporte especializado em tempo real durante todo o processo.',
    benefit: 'Nunca fique sozinho na jornada de certificação.',
  },
]

const benefits = [
  {
    icon: Brain,
    title: 'Templates inteligentes',
    desc: 'Checklists e documentos adaptados ao seu segmento.',
  },
  { icon: Zap, title: 'Automação total', desc: 'Tarefas, lembretes e notificações automáticas.' },
  {
    icon: BarChart3,
    title: 'Acompanhamento visual',
    desc: 'Gráficos de progresso e relatórios em PDF.',
  },
  {
    icon: MessageSquare,
    title: 'Chat com consultor',
    desc: 'Comunicação direta e histórica com especialistas.',
  },
  { icon: FileCheck, title: 'Aprovação em lote', desc: 'Gerencie documentos de forma eficiente.' },
  {
    icon: RefreshCw,
    title: 'Renovação facilitada',
    desc: 'Modelos prontos para renovar sua certificação.',
  },
]

export function LandingProcess() {
  return (
    <section
      id="como-funciona"
      className="bg-slate-50/70 border-y border-slate-200/80 py-16 md:py-20 scroll-mt-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Como Funciona
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Do cadastro inicial à certificação em 4 etapas diretas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#0055A4]">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 mt-3 pt-2 border-t border-slate-100">
                {step.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
