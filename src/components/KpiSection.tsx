import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Leaf,
  HardHat,
  BarChart3,
} from 'lucide-react'
import { getKpisForCertifications, groupKpisByIso, type KpiData } from '@/services/kpi'
import { useRealtime } from '@/hooks/use-realtime'
import type { Certification } from '@/services/certifications'

const ISO_GROUPS = [
  {
    code: '9001',
    label: 'Gestão da Qualidade — ISO 9001',
    icon: Shield,
    accent: 'border-blue-200 bg-blue-50/30',
  },
  {
    code: '14001',
    label: 'Gestão Ambiental — ISO 14001',
    icon: Leaf,
    accent: 'border-emerald-200 bg-emerald-50/30',
  },
  {
    code: '45001',
    label: 'Saúde e Segurança — ISO 45001',
    icon: HardHat,
    accent: 'border-rose-200 bg-rose-50/30',
  },
] as const
const STATUS = {
  atendendo: { icon: CheckCircle2, className: 'text-green-600' },
  'em atenção': { icon: AlertTriangle, className: 'text-yellow-600' },
  'fora do alvo': { icon: XCircle, className: 'text-red-600' },
} as const

export function KpiSection({ certifications }: { certifications: Certification[] }) {
  const [kpis, setKpis] = useState<KpiData[]>([])
  const [loading, setLoading] = useState(true)

  const certIds = useMemo(() => certifications.map((c) => c.id), [certifications])
  const certIdsKey = certIds.join(',')

  const loadKpis = async () => {
    if (certIds.length === 0) {
      setKpis([])
      setLoading(false)
      return
    }
    try {
      setKpis(await getKpisForCertifications(certIds))
    } catch {
      setKpis([])
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    loadKpis()
  }, [certIdsKey])

  useRealtime('tasks', () => {
    loadKpis()
  })

  const grouped = useMemo(() => groupKpisByIso(kpis), [kpis])

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (kpis.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#0055A4]" />
          <h2 className="text-lg font-bold text-slate-900">Indicadores de Desempenho & KPIs</h2>
        </div>
        <span className="text-xs text-slate-500">Monitoramento Contínuo</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {ISO_GROUPS.map((group) => {
          const items = grouped[group.code] || []
          if (items.length === 0) return null
          const Icon = group.icon
          return (
            <Card key={group.code} className={group.accent}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4" />
                  {group.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((kpi) => {
                  const SIcon = STATUS[kpi.status].icon
                  return (
                    <div key={kpi.task.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <SIcon className={`h-4 w-4 shrink-0 ${STATUS[kpi.status].className}`} />
                        <span className="text-sm truncate">{kpi.definition.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-medium">{kpi.currentValue}</span>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {kpi.definition.targetDisplay}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
