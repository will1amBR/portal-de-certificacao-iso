import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ShieldCheck, Leaf, HeartPulse, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function Index() {
  const { isAuthenticated, loading } = useAuth()

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003B73] to-[#0055A4] text-white">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur text-white font-black text-3xl mb-6">
          ISO
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Portal de Certificação ISO</h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          Gestão completa de certificações ISO 9001, 14001 e 45001. Documentos, tarefas,
          agendamentos e consultoria em um só lugar.
        </p>
        <Link to="/login">
          <Button
            size="lg"
            className="bg-white text-[#0055A4] hover:bg-blue-50 gap-2 font-semibold"
          >
            Acessar Portal <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: ShieldCheck,
              title: 'ISO 9001',
              desc: 'Gestão da Qualidade',
              color: 'text-sky-300',
            },
            { icon: Leaf, title: 'ISO 14001', desc: 'Gestão Ambiental', color: 'text-emerald-300' },
            {
              icon: HeartPulse,
              title: 'ISO 45001',
              desc: 'Saúde e Segurança',
              color: 'text-rose-300',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white/10 backdrop-blur rounded-xl p-6 text-left">
              <f.icon className={`h-8 w-8 ${f.color} mb-3`} />
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-blue-200">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-blue-200">
          {['Documentos online', 'Consultoria dedicada', 'Agendamentos', 'Relatórios'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
