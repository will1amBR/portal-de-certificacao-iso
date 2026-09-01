import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getCertifications, Certification } from '@/services/certifications'
import { getIsoTypes, IsoType } from '@/services/iso_types'
import { CertificationCard } from '@/components/CertificationCard'
import { NewCertificationDialog } from '@/components/NewCertificationDialog'
import { PipesGrid } from '@/components/pipes/PipesGrid'
import { useRealtime } from '@/hooks/use-realtime'
import { exportToCsv } from '@/lib/export'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function Certifications() {
  const { user } = useAuth()
  const [certs, setCerts] = useState<Certification[]>([])
  const [isoTypes, setIsoTypes] = useState<IsoType[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros gerais (para tela e relatório)
  const [statusFilter, setStatusFilter] = useState('all')
  const [isoFilter, setIsoFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')

  // Modal de Configuração do Relatório PDF / Impressão
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const load = async () => {
    try {
      const [allCerts, allIso] = await Promise.all([
        getCertifications(),
        getIsoTypes().catch(() => [] as IsoType[]),
      ])
      setCerts(
        user?.role === 'cliente' && user?.id
          ? allCerts.filter((c) => c.user === user.id)
          : allCerts,
      )
      setIsoTypes(allIso)
    } catch {
      setCerts([])
      setIsoTypes([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user?.id, user?.role])

  useRealtime('certifications', () => {
    load()
  })

  // Lista única de clientes para o filtro
  const uniqueClients = useMemo(() => {
    const map = new Map<string, string>()
    certs.forEach((c) => {
      const id = c.user || c.id
      const name = c.company_name || c.expand?.user?.name || 'Cliente'
      if (!map.has(id)) {
        map.set(id, name)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [certs])

  // Filtragem combinada por status, norma, cliente e período de data
  const filtered = useMemo(() => {
    return certs.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (
        isoFilter !== 'all' &&
        c.iso_type !== isoFilter &&
        c.expand?.iso_type?.code !== isoFilter
      ) {
        return false
      }
      if (clientFilter !== 'all' && c.user !== clientFilter) return false

      if (startDateFilter) {
        const certDate = c.start_date || c.created
        if (certDate && certDate.slice(0, 10) < startDateFilter) return false
      }
      if (endDateFilter) {
        const certDate = c.start_date || c.created
        if (certDate && certDate.slice(0, 10) > endDateFilter) return false
      }

      return true
    })
  }, [certs, statusFilter, isoFilter, clientFilter, startDateFilter, endDateFilter])

  const isAuditorOrAdmin = user?.role === 'admin' || user?.role === 'consultor'

  const resetFilters = () => {
    setStatusFilter('all')
    setIsoFilter('all')
    setClientFilter('all')
    setStartDateFilter('')
    setEndDateFilter('')
  }

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      toast.error('Nenhuma certificação visível para exportar')
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    const rows = filtered.map((c) => ({
      'Código / Referência': c.expand?.iso_type?.code || c.id || 'N/A',
      'Norma ISO':
        c.expand?.iso_type?.name ||
        (c.expand?.iso_type?.code ? `ISO ${c.expand.iso_type.code}` : 'ISO'),
      'Empresa / Razão Social': c.company_name || c.expand?.user?.name || 'Não informada',
      Status: c.status,
      'Progresso (%)': `${c.progress || 0}%`,
      'Consultor / Auditor': c.expand?.consultant?.name || 'Não atribuído',
      'Órgão Regulador': 'ALC Certificadora / INMETRO',
    }))

    exportToCsv(`relatorio-certificacoes-iso-${today}.csv`, rows, [
      'Código / Referência',
      'Norma ISO',
      'Empresa / Razão Social',
      'Status',
      'Progresso (%)',
      'Consultor / Auditor',
      'Órgão Regulador',
    ])
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
            variant="default"
            size="sm"
            onClick={() => setReportModalOpen(true)}
            className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs font-semibold shadow-xs"
          >
            <Printer className="h-4 w-4 mr-1.5 shrink-0" />
            Gerar Relatório PDF / Imprimir
          </Button>
          <NewCertificationDialog onCreated={load} />
        </div>
      </div>

      {/* Cabeçalho exclusivo para Impressão / PDF */}
      <div className="hidden print:block border-b-2 border-[#003B73] pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#003B73] text-white font-black text-2xl tracking-wider">
              ISO
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Relatório Oficial de Auditoria e Certificações ISO
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Homologação e Conformidade Técnica • Órgãos Reguladores: ALC Certificadora / INMETRO
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-0.5 bg-slate-50 p-2.5 rounded border border-slate-200">
            <p>
              <strong>Data/Hora de Emissão:</strong> {new Date().toLocaleString('pt-BR')}
            </p>
            <p>
              <strong>Responsável pela Emissão:</strong>{' '}
              {user?.name || user?.email || 'Consultor / Auditor Líder'}
            </p>
            <p>
              <strong>Perfil de Acesso:</strong>{' '}
              {user?.role === 'cliente'
                ? 'Cliente (Visualização Restrita da Empresa)'
                : user?.role === 'admin'
                  ? 'Administrador Geral / ALC Certificadora'
                  : 'Auditor Técnico / Consultor'}
            </p>
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
          {/* Barra de Filtros Completa (Norma, Cliente, Período e Status) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Filter className="h-3.5 w-3.5 text-[#0055A4]" />
                <span>Filtros de Certificações</span>
                <Badge variant="secondary" className="text-[10px] ml-1">
                  {filtered.length} de {certs.length} registros
                </Badge>
              </div>

              {(statusFilter !== 'all' ||
                isoFilter !== 'all' ||
                clientFilter !== 'all' ||
                startDateFilter ||
                endDateFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs h-7 text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Filtro Status */}
              <div>
                <Label className="text-[11px] font-medium text-slate-500 mb-1 block">
                  Status da Certificação:
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full text-xs bg-white h-8">
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

              {/* Filtro Norma ISO */}
              <div>
                <Label className="text-[11px] font-medium text-slate-500 mb-1 block">
                  Norma ISO:
                </Label>
                <Select value={isoFilter} onValueChange={setIsoFilter}>
                  <SelectTrigger className="w-full text-xs bg-white h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as normas</SelectItem>
                    {isoTypes.map((iso) => (
                      <SelectItem key={iso.id} value={iso.id}>
                        {iso.name} ({iso.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Cliente (se auditor/admin ou tiver múltiplos clientes) */}
              {isAuditorOrAdmin ? (
                <div>
                  <Label className="text-[11px] font-medium text-slate-500 mb-1 block">
                    Cliente / Empresa:
                  </Label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-full text-xs bg-white h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todas as empresas ({uniqueClients.length})
                      </SelectItem>
                      {uniqueClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label className="text-[11px] font-medium text-slate-500 mb-1 block">
                    Período De:
                  </Label>
                  <Input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              )}

              {/* Filtro Período (Até / De) */}
              {isAuditorOrAdmin ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] font-medium text-slate-500 mb-1 block">De:</Label>
                    <Input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-medium text-slate-500 mb-1 block">
                      Até:
                    </Label>
                    <Input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="text-[11px] font-medium text-slate-500 mb-1 block">
                    Período Até:
                  </Label>
                  <Input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={handleExportCsv} className="text-xs h-8">
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                CSV
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setReportModalOpen(true)}
                className="bg-[#0055A4] hover:bg-[#1A73E8] text-white text-xs h-8"
              >
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Imprimir / PDF com Filtros
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

      {/* Modal de Configuração do Relatório PDF */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Printer className="h-5 w-5 text-[#0055A4]" />
              Gerar Relatório Filtrado (PDF / Impressão)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <p className="text-xs text-slate-500">
              Personalize os parâmetros antes de emitir o relatório oficial para auditoria ALC /
              INMETRO.
            </p>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {/* Filtro Norma ISO */}
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Norma ISO:
                </Label>
                <Select value={isoFilter} onValueChange={setIsoFilter}>
                  <SelectTrigger className="w-full text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as normas</SelectItem>
                    {isoTypes.map((iso) => (
                      <SelectItem key={iso.id} value={iso.id}>
                        {iso.name} ({iso.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Cliente (apenas consultor/admin) */}
              {isAuditorOrAdmin && (
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Cliente / Empresa:
                  </Label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-full text-xs bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todas as empresas ({uniqueClients.length})
                      </SelectItem>
                      {uniqueClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtro Período de Datas */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Período De:
                  </Label>
                  <Input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="text-xs bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Período Até:
                  </Label>
                  <Input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="text-xs bg-white"
                  />
                </div>
              </div>

              {/* Filtro Status */}
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full text-xs bg-white">
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
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded text-xs text-blue-800 flex items-center justify-between">
              <span>Certificações correspondentes:</span>
              <strong className="text-sm font-bold">{filtered.length} registro(s)</strong>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-[#0055A4] hover:bg-[#1A73E8] text-white"
              onClick={() => {
                setReportModalOpen(false)
                setTimeout(() => {
                  window.print()
                }, 200)
              }}
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Imprimir / Salvar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Layout Estruturado e Estilizado para Impressão / Auditoria / ALC / INMETRO */}
      <div className="hidden print:block space-y-6">
        {/* Sumário dos Filtros Aplicados no Cabeçalho do Relatório */}
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-100 p-2.5 rounded border border-slate-200">
          <div>
            <span className="text-slate-500 block text-[10px]">Total Listado:</span>
            <strong className="font-semibold text-slate-900">
              {filtered.length} Certificação(ões)
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Norma ISO / Status:</span>
            <span className="font-semibold text-slate-900">
              {isoFilter === 'all'
                ? 'Todas as normas'
                : isoTypes.find((i) => i.id === isoFilter)?.name || isoFilter}{' '}
              • {statusFilter === 'all' ? 'Todos os status' : statusFilter}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Período / Cliente:</span>
            <span className="font-semibold text-slate-900">
              {startDateFilter || endDateFilter
                ? `${startDateFilter ? new Date(startDateFilter + 'T00:00:00').toLocaleDateString('pt-BR') : 'Início'} até ${endDateFilter ? new Date(endDateFilter + 'T00:00:00').toLocaleDateString('pt-BR') : 'Atual'}`
                : 'Todo o histórico'}{' '}
              {clientFilter !== 'all' && (
                <span className="block text-[10px] text-slate-600">
                  Cliente: {uniqueClients.find((c) => c.id === clientFilter)?.name || clientFilter}
                </span>
              )}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center border border-slate-300 rounded text-slate-600 text-sm">
            Nenhuma certificação encontrada para os parâmetros de auditoria selecionados.
          </div>
        ) : (
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-300 font-bold">
                <th className="p-2.5 border-r border-slate-300">Código / Ref.</th>
                <th className="p-2.5 border-r border-slate-300">Norma ISO</th>
                <th className="p-2.5 border-r border-slate-300">Empresa / Razão Social</th>
                <th className="p-2.5 border-r border-slate-300">Status da Auditoria</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Progresso</th>
                <th className="p-2.5 border-r border-slate-300">Consultor / Auditor</th>
                <th className="p-2.5">Data Início</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c) => (
                <tr key={c.id} className="text-slate-800">
                  <td className="p-2.5 font-mono text-[11px] font-semibold border-r border-slate-200">
                    {c.expand?.iso_type?.code || c.id.slice(0, 8)}
                  </td>
                  <td className="p-2.5 font-bold border-r border-slate-200">
                    {c.expand?.iso_type?.name || `ISO ${c.expand?.iso_type?.code || ''}`}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-medium">
                    {c.company_name || c.expand?.user?.name || 'Sua Empresa'}
                    {c.expand?.user?.cnpj && (
                      <span className="block text-[10px] text-slate-500 font-normal">
                        CNPJ: {c.expand.user.cnpj}
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 capitalize">
                    <span className="font-semibold">{c.status}</span>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold">
                    {c.progress || 0}%
                  </td>
                  <td className="p-2.5 border-r border-slate-200">
                    {c.expand?.consultant?.name || 'Não atribuído'}
                  </td>
                  <td className="p-2.5 font-medium text-slate-700">
                    {c.start_date
                      ? new Date(c.start_date).toLocaleDateString('pt-BR')
                      : new Date(c.created).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Bloco de Assinaturas Formais para Auditoria */}
        <div className="pt-8 mt-10 border-t border-slate-300 grid grid-cols-2 gap-12 text-center text-xs">
          <div>
            <div className="border-t border-slate-700 w-64 mx-auto mb-2"></div>
            <p className="font-bold text-slate-900 text-sm">Responsável da Empresa / RD</p>
            <p className="text-slate-600 text-xs">Representante da Direção (RD)</p>
            <p className="text-slate-400 text-[10px] mt-1">Carimbo e Assinatura</p>
          </div>
          <div>
            <div className="border-t border-slate-700 w-64 mx-auto mb-2"></div>
            <p className="font-bold text-slate-900 text-sm">
              Auditor Líder / ALC Acreditação INMETRO
            </p>
            <p className="text-slate-600 text-xs">Acreditação Técnica INMETRO</p>
            <p className="text-slate-400 text-[10px] mt-1">Reg. Auditor / Assinatura Digital</p>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center pt-6 border-t border-slate-100 flex items-center justify-between">
          <span>Portal de Certificação ISO • Sistema de Gestão e Conformidade</span>
          <span>Documento homologado eletronicamente para fins de auditoria externa</span>
        </div>
      </div>
    </div>
  )
}
