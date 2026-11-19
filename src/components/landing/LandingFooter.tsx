import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSiteContent } from '@/hooks/use-site-content'

export function LandingFooter() {
  const { isAuthenticated } = useAuth()
  const { branding } = useSiteContent()

  return (
    <footer className="bg-[#0A1F33] text-slate-300">
      {/* Final conversion band */}
      <div className="bg-gradient-to-r from-[#003B73] to-[#0055A4] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Pronto para destravar a certificação da sua empresa?
            </h2>
            <p className="text-blue-100 text-sm mt-1.5">
              Cadastro gratuito, templates prontos e suporte de auditores sêniores do primeiro dia.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white text-[#0055A4] hover:bg-blue-50 font-semibold px-6 h-11 shadow-md rounded-xl text-sm w-full whitespace-nowrap"
              >
                {isAuthenticated ? 'Ir para o Painel' : 'Criar conta gratuita'}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent hover:bg-white/10 text-white border-white/30 font-medium px-5 h-11 rounded-xl text-sm w-full whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 mr-1.5 text-yellow-300" />
                Conhecer as Demos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          {branding.logoUrl && (
            <img
              src={branding.logoUrl}
              alt={branding.orgName}
              className="h-10 rounded object-contain bg-white/95 p-1.5 mb-3"
            />
          )}
          <p className="font-bold text-white text-base mb-2">{branding.orgName}</p>
          <p className="text-slate-400 leading-relaxed">
            Plataforma da {branding.orgName} para gestão completa de certificações ISO 9001, 14001,
            45001 e NRs: onboarding guiado, pipes de não-conformidades e relatórios com assinatura
            digital.
          </p>
        </div>
        <div>
          <p className="font-bold text-white text-base mb-2">Navegar</p>
          <ul className="space-y-2">
            <li>
              <a href="#sobre" className="hover:text-white transition-colors">
                Sobre a plataforma
              </a>
            </li>
            <li>
              <a href="#time" className="hover:text-white transition-colors">
                Nosso time
              </a>
            </li>
            <li>
              <a href="#processo" className="hover:text-white transition-colors">
                Como funciona
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">
                Perguntas frequentes
              </a>
            </li>
            <li>
              <Link to="/demo" className="hover:text-white transition-colors">
                Demos interativas
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white text-base mb-2">Normas cobertas</p>
          <ul className="space-y-2 text-slate-400">
            <li>ISO 9001: Gestão da Qualidade</li>
            <li>ISO 14001: Gestão Ambiental</li>
            <li>ISO 45001: Saúde e Segurança</li>
            <li>ISO 27001 e 22000: Info e Alimentos</li>
            <li>NR-1 e NR-27: Regulamentadoras</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {branding.orgName}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
