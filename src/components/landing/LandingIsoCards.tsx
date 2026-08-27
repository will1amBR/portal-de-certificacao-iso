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
    <section id="certificacoes" className="max-w-6xl mx-auto px-4 py-16 md:py-24 scroll-mt-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0055A4] text-xs font-bold mb-3 border border-sky-200">
          <ShieldCheck className="h-3.5 w-3.5" /> Padrões Globais
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Certificações Disponíveis
        </h2>
        <p className="text-slate-600 mt-2 text-base">
          Metodologia completa e validada para as três principais normas exigidas em licitações e
          grandes contratos.
        </p>
      </div>
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
              className="mt-4 p-2 -ml-2 text-[#0055A4] hover:bg-blue-50 hover:text-[#1A73E8] font-semibold"
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
              {selected?.code} - {selected?.title}
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
