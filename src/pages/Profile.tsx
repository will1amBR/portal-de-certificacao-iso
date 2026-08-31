import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Building2, FileDown, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { getBusinessModel, BusinessModel } from '@/services/business_models'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Profile() {
  const { user } = useAuth()
  const [userRecord, setUserRecord] = useState<any>(null)
  const [model, setModel] = useState<BusinessModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      try {
        const record = await pb.collection('users').getOne(user.id, { expand: 'business_model' })
        setUserRecord(record)
        const bmId = record.business_model || record.expand?.business_model?.id
        if (bmId) {
          setModel(await getBusinessModel(bmId))
        }
      } catch {
        /* noop */
      }
      setLoading(false)
    }
    load()
  }, [user?.id])

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  const initials = (userRecord?.name || user?.name || 'US').slice(0, 2).toUpperCase()
  const roleLabel =
    userRecord?.role === 'admin'
      ? 'Administrador'
      : userRecord?.role === 'consultor'
        ? 'Consultor'
        : 'Cliente'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="h-6 w-6 text-[#0055A4]" /> Meu Perfil
        </h1>
        <p className="text-sm text-slate-500 mt-1">Suas informações de conta</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-slate-200">
              <AvatarImage src={userRecord?.avatar} />
              <AvatarFallback className="bg-[#0055A4] text-white text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{userRecord?.name || user?.name}</h2>
              <Badge className="mt-1 bg-[#0055A4]">{roleLabel}</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">E-mail</span>
              <span className="text-sm font-medium text-slate-900 ml-auto">
                {userRecord?.email || user?.email}
              </span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <Shield className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">CNPJ</span>
              <span className="text-sm font-medium text-slate-900 ml-auto">
                {userRecord?.cnpj || 'Não informado'}
              </span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">Modelo de Negócio</span>
              <span className="text-sm font-medium text-slate-900 ml-auto">
                {model?.name || 'Não definido'}
              </span>
            </div>
          </div>
          {/* Departments & Managers list if exists */}
          {userRecord?.departments && userRecord.departments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#0055A4]" />
                  Setores & Responsáveis Cadastrados ({userRecord.departments.length})
                </h3>
                <Link to="/onboarding?edit=true">
                  <Button variant="ghost" size="sm" className="text-xs text-[#0055A4] h-7 px-2">
                    Editar Setores
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {userRecord.departments.map((dept: any, idx: number) => (
                  <div
                    key={dept.id || idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1"
                  >
                    <p className="font-bold text-slate-900">{dept.name}</p>
                    <p className="text-slate-600">
                      <strong>Responsável:</strong> {dept.manager || 'Não informado'}
                    </p>
                    {dept.phone && <p className="text-[11px] text-slate-500">Tel: {dept.phone}</p>}
                    {dept.email && (
                      <p className="text-[11px] text-slate-500">Email: {dept.email}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {userRecord?.business_model && (
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
              <Link to="/relatorio-onboarding" className="flex-1">
                <Button variant="outline" className="w-full text-xs">
                  <FileDown className="h-4 w-4 mr-1.5" /> Baixar Relatório de Onboarding
                </Button>
              </Link>
              <Link to="/onboarding?edit=true" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full text-xs text-[#0055A4] border-blue-200 hover:bg-blue-50"
                >
                  Atualizar Dados / Setores
                </Button>
              </Link>
            </div>
          )}{' '}
        </CardContent>
      </Card>
    </div>
  )
}
