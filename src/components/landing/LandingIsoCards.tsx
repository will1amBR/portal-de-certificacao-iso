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
    long: 'A ISO 9001 é a norma mais reconhecida mundialmente para sistemas de gestão da qualidade. Nosso portal simplifica a conformidade com templates automatizados de procedimentos, registros de não conformidades, auditorias internas e indicadores de desempenho — tudo em um só lugar.',
  },
  {
    icon: Leaf,
    code: 'ISO 14001',
    title: 'Gestão Ambiental',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-300',
    desc: 'Reduza impactos ambientais, garanta conformidade legal e promova sustentabilidade.',
    long: 'A ISO 14001 define requisitos para sistemas de gestão ambiental. O portal oferece checklists de aspectos e impactos ambientais, modelos de procedimentos de gestão de resíduos, monitoramento de consumo e conformidade legal — automatizado e adaptado ao seu segmento.',
  },
  {
    icon: HeartPulse,
    code: 'ISO 45001',
    title: 'Saúde e Segurança',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-300',
    desc: 'Proteja seus colaboradores com gestão de riscos ocupacionais e prevenção de acidentes.',
    long: 'A ISO 45001 estabelece padrões para saúde e segurança ocupacional. O portal disponibiliza modelos de APR, procedimentos de emergência, registros de treinamentos, monitoramento de SSA e programas de prevenção — tudo gerenciado em tempo real.',
  },
]

export function LandingIsoCards() {
  const [selected, setSelected] = useState<(typeof isoData)[0] | null>(null)

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
        Certificações Disponíveis
      </h2>
      <p className="text-slate-500 text-center mb-10">
        As três normas mais demandadas pelo mercado
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isoData.map((iso) => (
          <div
            key={iso.code}
            className={`rounded-2xl border-2 border-slate-200 p-6 transition-all ${iso.border} hover:shadow-lg`}
          >
            <div className={`inline-flex p-3 rounded-xl ${iso.bg} mb-4`}>
              <iso.icon className={`h-7 w-7 ${iso.color}`} />
            </div>
            <p className="text-sm font-bold text-slate-400">{iso.code}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{iso.title}</h3>
            <p className="text-sm text-slate-500 mt-2">{iso.desc}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 p-0 h-auto text-[#0055A4] hover:bg-transparent hover:text-[#1A73E8]"
              onClick={() => setSelected(iso)}
            >
              Saiba Mais <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className={`inline-flex p-3 rounded-xl ${selected?.bg} mb-2 w-fit`}>
              {selected && <selected.icon className={`h-7 w-7 ${selected.color}`} />}
            </div>
            <DialogTitle>
              {selected?.code} — {selected?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-600 leading-relaxed pt-2">
              {selected?.long}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
