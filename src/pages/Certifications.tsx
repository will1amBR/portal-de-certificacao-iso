import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, Certification } from '@/services/certifications'
import { CertificationCard } from '@/components/CertificationCard'
import { NewCertificationDialog } from '@/components/NewCertificationDialog'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { useRealtime } from '@/hooks/use-realtime'
import { exportToCsv } from '@/lib/export'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  LayoutGrid,
  ShieldCheck,
  FileSpreadsheet,
  Printer,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function Certifications() {
  const { user } = useAuth()
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const load = async () => {
    try {
      const all = await getCertifications()
      setCerts(user?.role === 'cliente' && user?.id ? all.filter((c) => c.user === user.id) : all)
    } catch {
      setCerts([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user?.id, user?.role])

  useRealtime('certifications', () => {
    load()
  })

  const filtered = statusFilter === 'all' ? certs : certs.filter((c) => c.status === statusFilter)

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      toast.error('Nenhuma certificação para exportar')
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    const rows = filtered.map((c) => ({
      'Código ISO': c.expand?.iso_type?.code || 'N/A',
      'Norma / Certificação': c.expand?.iso_type?.name || 'ISO',
      'Empresa / Razão Social': c.company_name || c.expand?.user?.name || 'N/A',
      CNPJ: c.expand?.user?.cnpj || 'N/A',
      Status: c.status,
      'Progresso (%)': `${c.progress || 0}%`,
      'Consultor / Auditor': c.expand?.consultant?.name || 'Não atribuído',
      'Data de Início': c.start_date ? new Date(c.start_date).toLocaleDateString('pt-BR') : 'N/A',
      'Data de Cadastro': new Date(c.created).toLocaleDateString('pt-BR'),
      'Órgão / Auditoria': 'ALC / INMETRO',
    }))

    exportToCsv(`relatorio-certificacoes-iso-${today}.csv`, rows)
    toast.success('Lista de certificações exportada em CSV com sucesso!')
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )

  return (
    <div className="space-y-6">
      {/* Cabeçalho Interativo na Tela (oculto na impressão padrão de relatório) */}
      <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulos & Pipes ISO</h1>
          <p className="text-sm text-slate-500">
            Gerencie os fluxos operacionais, não-conformidades, riscos e processos no padrão ALC /
            INMETRO
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5 text-emerald-600 shrink-0" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            <Printer className="h-4 w-4 mr-1.5 text-[#0055A4] shrink-0" />
            Exportar PDF / Imprimir
          </Button>
          <NewCertificationDialog onCreated={load} />
        </div>
      </div>

      {/* Cabeçalho exclusivo para Impressão / PDF */}
      <div className="hidden print:block border-b-2 border-[#003B73] pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#003B73] text-white font-black text-xl">ISO</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Relatório de Auditoria e Certificações ISO
              </h1>
              <p className="text-xs text-slate-500">
                Homologação e Conformidade Técnica • Órgãos Reguladores: ALC Certificadora / INMETRO
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>
              <strong>Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>
            <p>
              <strong>Usuário:</strong> {user?.name || 'Consultor / Auditor'}
            </p>
            {user?.role === 'cliente' && (
              <p className="font-semibold text-slate-800">Visualização Restrita da Empresa</p>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="pipes" className="space-y-6 print:hidden">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList className="bg-slate-100 p-1 border border-slate-200">
            <TabsTrigger value="pipes" className="gap-2 text-xs md:text-sm font-semibold">
              <LayoutGrid className="h-4 w-4 text-blue-600" />
              Pipes e Processos ISO
            </TabsTrigger>
            <TabsTrigger value="certifications" className="gap-2 text-xs md:text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-sky-700" />
              Visão Geral por Norma ({filtered.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pipes" className="space-y-6">
          <PipesGrid />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-slate-600">Filtrar por status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-56 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="não iniciado">Não iniciado</SelectItem>
                  <SelectItem value="em andamento">Em andamento</SelectItem>
                  <SelectItem value="pendente de documentos">Pendente de documentos</SelectItem>
                  <SelectItem value="aguardando auditoria">Aguardando auditoria</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCsv} className="text-xs h-8">
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs h-8">
                <Printer className="h-3.5 w-3.5 mr-1.5 text-[#0055A4]" />
                PDF / Imprimir
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 text-center py-12 text-slate-500">
              <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Nenhuma certificação encontrada.</p>
              <p className="text-xs text-slate-400 mt-1">
                Ajuste os filtros de busca ou crie uma nova certificação acima.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((c) => (
                <CertificationCard key={c.id} cert={c} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Layout Estruturado e Estilizado para Impressão / Auditoria / ALC / INMETRO */}
      <div className="hidden print:block space-y-4">
        <div className="text-sm font-semibold text-slate-700 mb-2">
          Total de Normas Auditadas / Acompanhadas: {filtered.length}
        </div>
        <table className="w-full text-left text-xs border border-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
              <th className="p-2.5 border-r border-slate-300">Norma ISO</th>
              <th className="p-2.5 border-r border-slate-300">Empresa / Razão Social</th>
              <th className="p-2.5 border-r border-slate-300">Status da Auditoria</th>
              <th className="p-2.5 border-r border-slate-300 text-center">Progresso</th>
              <th className="p-2.5 border-r border-slate-300">Consultor / Auditor</th>
              <th className="p-2.5">Início</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((c) => (
              <tr key={c.id} className="text-slate-800">
                <td className="p-2.5 font-bold border-r border-slate-200">
                  {c.expand?.iso_type?.name || `ISO ${c.expand?.iso_type?.code || ''}`}
                </td>
                <td className="p-2.5 border-r border-slate-200 font-medium">
                  {c.company_name || c.expand?.user?.name || 'Sua Empresa'}
                </td>
                <td className="p-2.5 border-r border-slate-200 capitalize">{c.status}</td>
                <td className="p-2.5 border-r border-slate-200 text-center font-bold">
                  {c.progress || 0}%
                </td>
                <td className="p-2.5 border-r border-slate-200">
                  {c.expand?.consultant?.name || 'Auditoria Geral'}
                </td>
                <td className="p-2.5">
                  {c.start_date ? new Date(c.start_date).toLocaleDateString('pt-BR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-6 mt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
            <p className="font-semibold text-slate-800">Responsável pela Empresa</p>
            <p className="text-slate-500 text-[10px]">Representante da Direção (RD)</p>
          </div>
          <div>
            <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
            <p className="font-semibold text-slate-800">Auditor Líder / ALC Certificadora</p>
            <p className="text-slate-500 text-[10px]">Acreditação INMETRO</p>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center pt-4">
          Documento gerado eletronicamente através do Portal de Certificação ISO • Válido para
          verificação de conformidade
        </div>
      </div>
    </div>
  )
}
