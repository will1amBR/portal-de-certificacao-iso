import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function LandingFooter() {
  const { isAuthenticated } = useAuth()

  return (
    <footer id="contato" className="bg-slate-900 text-slate-300 scroll-mt-16">
      {/* Clean Call to Action */}
      <div className="border-b border-slate-800 py-12 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Inicie sua jornada de certificação hoje
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            Acelere a adequação da sua empresa com processos claros e suporte especializado.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {!isAuthenticated && (
              <Link to="/signup">
                <Button
                  size="default"
                  className="bg-[#00A86B] hover:bg-emerald-600 font-semibold text-white px-5 h-10 rounded-lg text-xs sm:text-sm"
                >
                  Criar Conta Gratuita <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            )}
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button
                size="default"
                variant="outline"
                className="bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white px-5 h-10 rounded-lg text-xs sm:text-sm"
              >
                {isAuthenticated ? 'Painel de Gestão' : 'Entrar na Conta'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-[#0055A4] text-white font-bold text-xs">ISO</div>
              <span className="font-bold text-white text-sm">Portal de Certificação</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Automação e conformidade para ISO 9001, ISO 14001 e ISO 45001.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2.5">Atalhos</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#certificacoes" className="hover:text-white transition-colors">
                  Normas ISO
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#demo-interativa" className="hover:text-white transition-colors">
                  Demonstração
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2.5">Contato & Suporte</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-sky-400 shrink-0" /> contato@alc.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-sky-400 shrink-0" /> (11) 4003-8920
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" /> São Paulo - SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} ALC Certificadora ISO. Todos os direitos reservados.</p>
          <span>Conforme LGPD • ISO 9001, 14001, 45001</span>
        </div>
      </div>
    </footer>
  )
}
