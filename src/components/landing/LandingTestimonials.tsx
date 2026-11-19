import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const testimonials = [
  {
    quote:
      'Conseguimos organizar toda a documentação da obra em uma semana. Na auditoria, não faltou um único documento.',
    name: 'Marcos T.',
    role: 'Diretor, Construtora Horizonte',
  },
  {
    quote:
      'O portal eliminou as planilhas paralelas. Cada cláusula vira um card no Kanban, com responsável e prazo claros.',
    name: 'Fernanda L.',
    role: 'Coordenadora de Qualidade, Varejo',
  },
  {
    quote:
      'Como certificadora, ganhamos visibilidade total do pipeline de clientes e das não-conformidades em aberto.',
    name: 'Ricardo M.',
    role: 'Auditor Líder, ALC Certificadora',
  },
]

export function LandingTestimonials() {
  const { isAuthenticated } = useAuth()
  return (
    <section id="depoimentos" className="bg-[#F5F7FA] py-16 md:py-20 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Quem usa, certifica
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Empresas de diferentes segmentos já concluíram sua adequação com o portal.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm"
            >
              <blockquote className="text-sm text-slate-700 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0055A4] to-sky-400 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
            <Button
              size="lg"
              className="bg-[#00A86B] hover:bg-emerald-600 text-white font-semibold px-6 h-11 shadow-md rounded-xl text-sm whitespace-nowrap"
            >
              {isAuthenticated ? 'Abrir o Painel' : 'Quero certificar minha empresa'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
