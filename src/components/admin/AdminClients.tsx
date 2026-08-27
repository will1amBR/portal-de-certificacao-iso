import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers, IsoUser } from '@/services/users'
import { getCertifications, Certification } from '@/services/certifications'
import { getBusinessModels, BusinessModel } from '@/services/business_models'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AdminClients() {
  const [users, setUsers] = useState<IsoUser[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [models, setModels] = useState<BusinessModel[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [u, c, m] = await Promise.all([getAllUsers(), getCertifications(), getBusinessModels()])
      setUsers(u)
      setCerts(c)
      setModels(m)
    } catch {
      /* noop */
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('users', () => load())
  useRealtime('certifications', () => load())

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const getModelName = (id?: string) => models.find((m) => m.id === id)?.name || 'Não definido'
  const userCerts = (userId: string) => certs.filter((c) => c.user === userId)

  return (
    <div className="space-y-3">
      {users.map((u) => {
        const uc = userCerts(u.id)
        return (
          <Card key={u.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{u.name || u.email}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {u.role}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {uc.length} certs
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span>CNPJ: {u.cnpj || 'Não informado'}</span>
                <span>Modelo: {getModelName(u.business_model)}</span>
              </div>
              {uc.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-50 flex flex-wrap gap-2">
                  {uc.map((c) => (
                    <Link key={c.id} to={`/certificacoes/${c.id}`}>
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-slate-50">
                        {c.expand?.iso_type?.name || 'Cert'}: {c.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
      {users.length === 0 && (
        <p className="text-center text-slate-500 py-8">Nenhum usuário encontrado.</p>
      )}
    </div>
  )
}
