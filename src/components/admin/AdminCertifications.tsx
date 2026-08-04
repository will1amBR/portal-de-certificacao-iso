import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCertifications, Certification } from '@/services/certifications'
import { getIsoTypes, IsoType } from '@/services/iso_types'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function AdminCertifications() {
  const [certs, setCerts] = useState<Certification[]>([])
  const [isoTypes, setIsoTypes] = useState<IsoType[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [isoFilter, setIsoFilter] = useState('all')

  const load = async () => {
    try {
      const [c, i] = await Promise.all([getCertifications(), getIsoTypes()])
      setCerts(c)
      setIsoTypes(i)
    } catch {
      /* noop */
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('certifications', () => load())
  useRealtime('iso_types', () => load())

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const filtered = certs.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (isoFilter !== 'all' && c.iso_type !== isoFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="não iniciado">Não iniciado</SelectItem>
            <SelectItem value="em andamento">Em andamento</SelectItem>
            <SelectItem value="pendente de documentos">Pendente documentos</SelectItem>
            <SelectItem value="aguardando auditoria">Aguardando auditoria</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={isoFilter} onValueChange={setIsoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo ISO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {isoTypes.map((i) => (
              <SelectItem key={i.id} value={i.id}>
                {i.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-900">
                    {c.expand?.iso_type?.name || 'Certificação'}
                  </p>
                  <p className="text-xs text-slate-500">{c.company_name || '—'}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {c.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={c.progress || 0} className="h-2" />
                <span className="text-xs font-bold text-slate-700">{c.progress || 0}%</span>
              </div>
              <Link
                to={`/certificacoes/${c.id}`}
                className="text-xs text-[#0055A4] hover:underline mt-2 inline-block"
              >
                Ver detalhes
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-8">Nenhuma certificação encontrada.</p>
      )}
    </div>
  )
}
