import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Maria Oliveira',
    company: 'Supermercado Nova Esperança',
    quote:
      'O portal transformou completamente nosso processo de certificação. Em poucas semanas tínhamos todos os documentos organizados e prontos para auditoria. Revolucionário!',
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=40',
  },
  {
    name: 'Carlos Mendes',
    company: 'Construtora Forte Engenharia',
    quote:
      'Os templates automáticos para construtora nos economizaram meses de trabalho. O suporte do consultor foi fundamental para aprovação sem retrabalho.',
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=50',
  },
  {
    name: 'Patrícia Santos',
    company: 'Serviços Premium Ltda',
    quote:
      'Nunca imaginei que certificação ISO pudesse ser tão simples. A plataforma guiou cada passo e o chat com o consultor resolveu todas as dúvidas rapidamente.',
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=60',
  },
]

export function LandingTestimonials() {
  return (
    <section className="bg-[#003B73] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
          O que dizem nossos clientes
        </h2>
        <p className="text-blue-200 text-center mb-10">
          Histórias reais de empresas que simplificaram sua certificação
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <Quote className="h-8 w-8 text-blue-300 mb-3" />
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-blue-300">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
