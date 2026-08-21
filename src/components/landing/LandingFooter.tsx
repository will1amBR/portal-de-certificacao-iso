import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export function LandingFooter() {
  const { isAuthenticated } = useAuth()

  return (
    <footer id="contato" className="bg-[#002A52] text-blue-100 scroll-mt-16">
      {/* Pre-footer Call to Action */}
      <div className="border-b border-white/10 py-12 bg-gradient-to-r from-[#003B73] to-[#002A52]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Pronto para transformar a qualidade e sustentabilidade da sua empresa?
          </h3>
          <p className="text-blue-200 text-sm md:text-base max-w-xl mx-auto mb-6">
            Inicie agora em menos de 3 minutos ou teste nossa demonstração interativa completa sem
            compromisso.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {!isAuthenticated && (
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-[#00A86B] hover:bg-emerald-600 font-bold text-white"
                >
                  Começar Gratuitamente <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            )}
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {isAuthenticated ? 'Acessar Painel' : 'Acessar Conta'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-white/10 text-white font-black text-sm">ISO</div>
              <span className="font-bold text-white">Portal de Certificação</span>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed">
              Plataforma de automação, diagnóstico e acompanhamento para certificações ISO 9001,
              14001 e 45001.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre a Plataforma
                </a>
              </li>
              <li>
                <a href="#certificacoes" className="hover:text-white transition-colors">
                  Normas ISO
                </a>
              </li>
              <li>
                <a href="#demo-interativa" className="hover:text-white transition-colors">
                  Demonstração Visual
                </a>
              </li>
              <li>
                <a href="#time" className="hover:text-white transition-colors">
                  Consultores Especialistas
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Dúvidas Frequentes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Segurança & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-blue-300/80">Conforme LGPD (Lei 13.709)</span>
              </li>
              <li>
                <span className="text-blue-300/80">Criptografia SSL/TLS</span>
              </li>
              <li>
                <span className="text-blue-300/80">Auditoria & Rastreabilidade</span>
              </li>
              <li>
                <span className="text-blue-300/80">Termos de Uso e SLA 99.9%</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Contato & Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" /> contato@alc.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" /> (11) 4003-8920
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" /> Av. Paulista, São Paulo -
                SP
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/80 gap-3">
          <p>
            © {new Date().getFullYear()} ALC Certificadora & Consultoria ISO. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <span>ISO 9001</span>
            <span>ISO 14001</span>
            <span>ISO 45001</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
