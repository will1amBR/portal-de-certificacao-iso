import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function LandingFooter() {
  const { isAuthenticated } = useAuth()

  return (
    <footer id="contato" className="bg-[#002A52] text-blue-100 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-white/10 text-white font-black text-sm">ISO</div>
              <span className="font-bold text-white">Portal de Certificação</span>
            </div>
            <p className="text-sm text-blue-300">
              Simplificando a jornada de certificação ISO para empresas de todos os portes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#time" className="hover:text-white transition-colors">
                  Nosso Time
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> contato@certificacaoiso.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> (11) 4000-0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> São Paulo, Brasil
              </li>
            </ul>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button size="sm" className="mt-4 bg-[#00A86B] hover:bg-emerald-600">
                  Criar Conta <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-blue-300">
          © {new Date().getFullYear()} Portal de Certificação ISO. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
