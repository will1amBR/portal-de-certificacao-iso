import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AdminSiteContent } from '@/components/admin/AdminSiteContent'

export default function AdminSiteContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conteúdo do Site</h1>
          <p className="text-sm text-slate-500 mt-1">
            Edite os textos da landing page sem programação
          </p>
        </div>
        <Link to="/admin">
          <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap h-10">
            <ArrowLeft className="h-4 w-4 shrink-0" /> Voltar ao Painel
          </Button>
        </Link>
      </div>
      <AdminSiteContent />
    </div>
  )
}
