import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSiteContent } from '@/hooks/use-site-content'

const audiences = [
  {
    icon: '🏪',
    name: 'Comércio e Mercado',
    desc: 'Alvarás, controle de estoque, rastreabilidade de fornecedores e treinamentos obrigatórios organizados sem planilhas paralelas.',
    tag: 'ISO 9001 + 14001',
  },
  {
    icon: '🏗️',
    name: 'Construtora e Engenharia',
    desc: 'Checklists de obra, ARTs, PGR e PCMSO, licenciamento ambiental e cronogramas de auditoria alinhados ao canteiro.',
    tag: 'ISO 9001 + 45001',
  },
  {
    icon: '🛠️',
    name: 'Prestador de Serviços',
    desc: 'Contratos, SLAs, gestão de competências, NPS e evidências de melhoria contínua prontos para a auditoria certificadora.',
    tag: 'ISO 9001',
  },
]

export function LandingAudience() {
  const { isAuthenticated } = useAuth()
  const { team } = useSiteContent()

  return (
    <>
      <section id="segmentos" className="bg-white py-16 md:py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Feito para o seu segmento
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Templates prontos que já nascem adaptados às exigências do seu setor, reduzindo
              semanas de trabalho manual.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a) => (
              <div
                key={a.name}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#0055A4] hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl" aria-hidden="true">
                    {a.icon}
                  </div>
                  <span className="text-[11px] font-bold text-[#0055A4] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    {a.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{a.name}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-1">{a.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-[#00A86B] hover:bg-emerald-600 text-white font-semibold px-6 h-11 shadow-md rounded-xl text-sm whitespace-nowrap"
              >
                Encontrar meu segmento no cadastro
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="time" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Nosso Time
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">{team.headline}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.members.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <h3 className="font-bold text-slate-900">{m.name}</h3>
              <p className="text-sm font-medium text-[#0055A4]">{m.role}</p>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#0055A4] to-[#007ACC] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex p-3 rounded-xl bg-white/10 mb-3">
            <Sparkles className="h-7 w-7 text-blue-200" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            Suporte de Consultores Especializados durante toda a jornada
          </h2>
          <p className="text-blue-100 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
            Nossa equipe acompanha cada etapa da adequação: resolve dúvidas no chat, revisa os
            documentos enviados e prepara sua empresa para a auditoria final sem retrabalho.
          </p>
          <div className="mt-6">
            <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
              <Button
                size="lg"
                className="bg-white text-[#0055A4] hover:bg-blue-50 font-semibold px-6 h-11 shadow-md rounded-xl text-sm whitespace-nowrap"
              >
                {isAuthenticated ? 'Ir para o Painel' : 'Começar com suporte incluso'}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
