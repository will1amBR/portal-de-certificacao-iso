import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const steps = [
  {
    title: 'Cadastre sua empresa',
    desc: 'Em poucos minutos: informe o segmento e as normas que você busca. O portal monta seu plano de adequação automaticamente.',
    n: '01',
  },
  {
    title: 'Siga o plano guiado',
    desc: 'Checklists, documentos e templates aparecem prontos para o seu segmento. Você marca o que já tem e o que falta.',
    n: '02',
  },
  {
    title: 'Auditoria final e certificado',
    desc: 'Com a conformidade validada, a ALC Certificadora conduz a auditoria e emite o certificado oficial com selo digital.',
    n: '03',
  },
]

export function LandingProcess() {
  const { isAuthenticated } = useAuth()
  return (
    <section id="processo" className="py-16 md:py-20 bg-white scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Do cadastro ao certificado em 3 etapas
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Sem planilhas avulsas, sem e-mail perdido, sem retrabalho: o portal guia cada etapa e
            conecta você ao auditor responsável.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:border-sky-300 hover:shadow-sm transition-all"
            >
              <span className="absolute top-5 right-5 text-4xl font-black text-slate-200 select-none">
                {s.n}
              </span>
              <h3 className="font-bold text-slate-900 pr-10">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
            <Button
              size="lg"
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white font-semibold px-6 h-11 shadow-md rounded-xl text-sm whitespace-nowrap"
            >
              {isAuthenticated ? 'Ir para o Painel' : 'Começar agora, é gratuito'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-5 h-11 rounded-xl text-sm whitespace-nowrap"
              >
                Prefiro ver as demos primeiro
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
