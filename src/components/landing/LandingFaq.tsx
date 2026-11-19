import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const faqs = [
  {
    q: 'Quanto tempo leva para obter a certificação?',
    a: 'Depende do tamanho da empresa e da norma escolhida. Com os templates prontos por segmento, a adequação costuma levar semanas em vez de meses. O plano gerado no cadastro mostra prazos realistas para o seu caso.',
  },
  {
    q: 'Preciso ter um consultor externo contratado?',
    a: 'Não. O portal já inclui o suporte de auditores e consultores sêniores durante toda a jornada: dúvidas normativas, revisão de documentos e preparação para a auditoria final.',
  },
  {
    q: 'Quais normas o portal cobre?',
    a: 'ISO 9001 (Qualidade), ISO 14001 (Meio Ambiente), ISO 45001 (Saúde e Segurança), além de ISO 27001, ISO 22000 e NRs regulamentadoras como NR-1 e NR-27.',
  },
  {
    q: 'Meus dados ficam seguros e separados de outras empresas?',
    a: 'Sim. Cada empresa tem seus dados isolados: certificações, documentos e mensagens são visíveis apenas para os perfis autorizados daquela operação.',
  },
  {
    q: 'Existe uma demonstração antes de contratar?',
    a: 'Sim. Temos demos interativas com três perfis reais: o de uma empresa cliente, o de um auditor e o da certificadora. Acesse pelo botão "Conhecer as Demos".',
  },
]

export function LandingFaq() {
  const { isAuthenticated } = useAuth()
  return (
    <section id="faq" className="py-16 md:py-20 bg-white scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Perguntas frequentes
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Ficou com alguma dúvida? O suporte do portal responde durante toda a jornada.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group bg-slate-50 rounded-xl border border-slate-200 open:border-sky-300 open:bg-blue-50/30 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none p-4 text-sm font-semibold text-slate-800 select-none">
                {f.q}
                <span className="text-[#0055A4] group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
            <Button
              size="lg"
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white font-semibold px-6 h-11 shadow-md rounded-xl text-sm whitespace-nowrap"
            >
              {isAuthenticated ? 'Ir para o Painel' : 'Começar minha certificação'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
