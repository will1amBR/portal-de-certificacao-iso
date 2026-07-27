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
    <>
      <section id="como-funciona" className="bg-[#F5F7FA] py-16 md:py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
            Como Funciona
          </h2>
          <p className="text-slate-500 text-center mb-10">
            Do cadastro à certificação em 4 passos simples
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="bg-white rounded-xl p-5 border border-slate-200 relative"
              >
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0055A4] text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <step.icon className="h-6 w-6 text-[#0055A4] mb-3" />
                <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                <p className="text-xs font-medium text-[#00A86B] mt-2">{step.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="max-w-6xl mx-auto px-4 py-16 md:py-20 scroll-mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          Por que somos diferentes?
        </h2>
        <p className="text-slate-500 text-center mb-10">
          Uma plataforma revolucionária que transforma a certificação ISO
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex p-3 rounded-xl bg-[#0055A4]/5 mb-4">
                <b.icon className="h-6 w-6 text-[#0055A4]" />
              </div>
              <h3 className="font-bold text-slate-900">{b.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
