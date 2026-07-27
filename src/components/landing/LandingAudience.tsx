import { Users } from 'lucide-react'

const audiences = [
  {
    icon: '🏪',
    name: 'Mercado',
    desc: 'Templates para cotação, controle de estoque, renovação de licenças e gestão de funcionários.',
  },
  {
    icon: '🏗️',
    name: 'Construtora',
    desc: 'Checklists de obras, ARTs, licenciamento e cronogramas automatizados.',
  },
  {
    icon: '🛠️',
    name: 'Prestador de Serviços',
    desc: 'Contratos, registro de funcionários, checklists e documentação fiscal.',
  },
]

const team = [
  {
    name: 'João Silva',
    role: 'Fundador e CEO',
    bio: 'Mais de 20 anos liderando certificações ISO para empresas de todos os portes.',
    img: 'https://img.usecurling.com/ppl/large?gender=male&seed=10',
  },
  {
    name: 'Ana Costa',
    role: 'Consultora Sênior',
    bio: 'Especialista em gestão ambiental com 15 anos de experiência em auditorias ISO 14001.',
    img: 'https://img.usecurling.com/ppl/large?gender=female&seed=20',
  },
  {
    name: 'Roberto Lima',
    role: 'Diretor Técnico',
    bio: 'Engenheiro de segurança com ampla atuação em ISO 45001 e gestão de riscos ocupacionais.',
    img: 'https://img.usecurling.com/ppl/large?gender=male&seed=30',
  },
]

export function LandingAudience() {
  return (
    <>
      <section className="bg-[#F5F7FA] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
            Para quem é?
          </h2>
          <p className="text-slate-500 text-center mb-10">
            Templates personalizados para cada modelo de negócio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a) => (
              <div
                key={a.name}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-[#0055A4] transition-colors"
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3 className="text-lg font-bold text-slate-900">{a.name}</h3>
                <p className="text-sm text-slate-500 mt-2">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="time" className="max-w-6xl mx-auto px-4 py-16 md:py-20 scroll-mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          Nosso Time
        </h2>
        <p className="text-slate-500 text-center mb-10">
          Décadas de experiência em certificações ISO e consultoria ambiental
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src={m.img}
                  alt={m.name}
                  className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <h3 className="font-bold text-slate-900">{m.name}</h3>
              <p className="text-sm font-medium text-[#0055A4]">{m.role}</p>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#0055A4] to-[#007ACC] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-xl bg-white/10 mb-3">
            <Users className="h-8 w-8 text-blue-200" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">Suporte de Consultores Especializados</h2>
          <p className="text-blue-100 mt-2 max-w-2xl mx-auto text-sm">
            Nossa equipe acompanha todo o processo de adequação, resolvendo dúvidas, revisando
            documentos e preparando sua empresa para a auditoria final.
          </p>
        </div>
      </section>
    </>
  )
}
