import { useState } from 'react'
import { ShieldCheck, Leaf, HeartPulse, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const isoData = [
  {
    icon: ShieldCheck,
    code: 'ISO 9001',
    title: 'Gestão da Qualidade',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'hover:border-sky-300',
    desc: 'Padronize processos, garanta melhoria contínua e eleve a satisfação dos seus clientes.',
    long: 'A ISO 9001 é a norma mais reconhecida mundialmente para sistemas de gestão da qualidade. Nosso portal simplifica a conformidade com templates automatizados de procedimentos, registros de não conformidades, auditorias internas e indicadores de desempenho, tudo em um só lugar.',
  },
  {
    icon: Leaf,
    code: 'ISO 14001',
    title: 'Gestão Ambiental',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-300',
    desc: 'Reduza impactos ambientais, garanta conformidade legal e promova sustentabilidade.',
    long: 'A ISO 14001 define requisitos para sistemas de gestão ambiental. O portal oferece checklists de aspectos e impactos ambientais, modelos de procedimentos de gestão de resíduos, monitoramento de consumo e conformidade legal, automatizado e adaptado ao seu segmento.',
  },
  {
    icon: HeartPulse,
    code: 'ISO 45001',
    title: 'Saúde e Segurança',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-300',
    desc: 'Proteja seus colaboradores com gestão de riscos ocupacionais e prevenção de acidentes.',
    long: 'A ISO 45001 estabelece padrões para saúde e segurança ocupacional. O portal disponibiliza modelos de APR, procedimentos de emergência, registros de treinamentos, monitoramento de SSA e programas de prevenção, tudo gerenciado em tempo real.',
  },
]

export function LandingIsoCards() {
  const [selected, setSelected] = useState<(typeof isoData)[0] | null>(null)

  return (
    <section
      id="certificacoes"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20 scroll-mt-16"
    >
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Normas Atendidas
        </h2>
        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          Metodologia completa e templates prontos para auditoria e conformidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isoData.map((iso) => (
          <div
            key={iso.code}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${iso.bg}`}>
                  <iso.icon className={`h-5 w-5 ${iso.color}`} />
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {iso.code}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{iso.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{iso.desc}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-fit px-2.5 -ml-2 text-xs text-[#0055A4] hover:bg-blue-50 font-semibold"
              onClick={() => setSelected(iso)}
            >
              Ver Detalhes <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className={`inline-flex p-3 rounded-xl ${selected?.bg} mb-2 w-fit`}>
              {selected && <selected.icon className={`h-6 w-6 ${selected.color}`} />}
            </div>
            <DialogTitle className="text-lg">
              {selected?.code} - {selected?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm leading-relaxed pt-2">
              {selected?.long}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
