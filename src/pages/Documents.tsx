import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react'
import {
  getAllDocuments,
  getDocumentUrl,
  bulkDocumentAction,
  IsoDocument,
} from '@/services/documents'
import { getCertifications, Certification } from '@/services/certifications'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { exportToCsv } from '@/lib/export'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import { UploadDocumentDialog } from '@/components/UploadDocumentDialog'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<IsoDocument[]>([])
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectComment, setRejectComment] = useState('')

  const loadData = async () => {
    try {
      const [allDocs, allCerts] = await Promise.all([getAllDocuments(), getCertifications()])

      if (user?.role === 'cliente') {
        const userCertIds = new Set(allCerts.filter((c) => c.user === user.id).map((c) => c.id))
        setDocs(allDocs.filter((d) => userCertIds.has(d.certification) || d.user === user.id))
        setCerts(allCerts.filter((c) => c.user === user.id))
      } else {
        setDocs(allDocs)
        setCerts(allCerts)
      }
    } catch {
      toast.error('Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  useRealtime('documents', () => loadData())

  const canManage = user?.role === 'admin' || user?.role === 'consultor'

  const filteredDocs = docs.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const matchName = d.name?.toLowerCase().includes(q)
      const matchCompany = d.expand?.certification?.company_name?.toLowerCase().includes(q)
      const matchComment = d.comment?.toLowerCase().includes(q)
      if (!matchName && !matchCompany && !matchComment) return false
    }
    return true
  })

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleAll = () => {
    setSelected(
      selected.size === filteredDocs.length ? new Set() : new Set(filteredDocs.map((d) => d.id)),
    )
  }

  const handleBulk = async (action: 'approve' | 'reject') => {
    const ids = Array.from(selected)
    const comment = action === 'reject' ? rejectComment : ''
    try {
      await bulkDocumentAction(ids, action, comment)
      toast.success(
        `${ids.length} documento(s) ${action === 'approve' ? 'aprovado(s)' : 'rejeitado(s)'}`,
      )
      setSelected(new Set())
      setRejectOpen(false)
      setRejectComment('')
      loadData()
    } catch {
      toast.error('Erro ao processar ação')
    }
  }

  const handleCsv = () => {
    exportToCsv(
      `todos-documentos-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredDocs.map((d) => ({
        Documento: d.name,
        Status: d.status,
        Categoria: d.category,
        Empresa: d.expand?.certification?.company_name || 'N/A',
        Norma: d.expand?.certification?.expand?.iso_type?.name || 'ISO',
        Obrigatório: d.required ? 'Sim' : 'Não',
        Comentário: d.comment || '',
        Data: new Date(d.created).toLocaleDateString('pt-BR'),
      })),
    )
  }

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; className: string }> = {
      aprovado: { label: 'Aprovado', className: 'bg-emerald-600 text-white' },
      rejeitado: { label: 'Rejeitado', className: 'bg-red-500 text-white' },
      enviado: { label: 'Em Análise', className: 'bg-blue-600 text-white' },
      pendente: { label: 'Pendente', className: 'bg-slate-400 text-white' },
    }
    const info = map[s] || { label: s, className: 'bg-slate-400 text-white' }
    return <Badge className={info.className}>{info.label}</Badge>
  }

  const stats = {
    total: docs.length,
    aprovados: docs.filter((d) => d.status === 'aprovado').length,
    enviados: docs.filter((d) => d.status === 'enviado').length,
    pendentes: docs.filter((d) => d.status === 'pendente').length,
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  const defaultCertId = certs[0]?.id || ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#0055A4]" /> Gestão Central de Documentos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consulte, envie e gerencie o status de evidências, manuais, procedimentos e relatórios
            ISO
          </p>
        </div>

        <div className="flex items-center gap-2">
          {defaultCertId && (
            <UploadDocumentDialog certificationId={defaultCertId} onUploaded={loadData} />
          )}
          <Button variant="outline" size="sm" onClick={handleCsv}>
            <FileSpreadsheet className="h-4 w-4 mr-1.5 text-emerald-600" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total de Documentos</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Aprovados</p>
              <p className="text-2xl font-bold text-slate-900">{stats.aprovados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-50 text-[#0055A4]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Em Análise</p>
              <p className="text-2xl font-bold text-slate-900">{stats.enviados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pendentes / Atrasados</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendentes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por nome, empresa ou observação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="enviado">Em Análise (Enviados)</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="rejeitado">Rejeitados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="documentação">Documentação</SelectItem>
                <SelectItem value="evidência">Evidência</SelectItem>
                <SelectItem value="formulário">Formulário</SelectItem>
                <SelectItem value="certificado">Certificado</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-12 text-center text-slate-500">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Nenhum documento encontrado</p>
            <p className="text-xs text-slate-400 mt-1">
              Ajuste os filtros ou envie um novo arquivo acima.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {canManage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-600">
              <Checkbox
                checked={selected.size === filteredDocs.length && filteredDocs.length > 0}
                onCheckedChange={toggleAll}
              />
              <span className="font-medium">Selecionar todos ({filteredDocs.length})</span>
            </div>
          )}

          {filteredDocs.map((doc) => {
            const certInfo = doc.expand?.certification
            const isoName = certInfo?.expand?.iso_type?.name || 'Norma ISO'
            const company = certInfo?.company_name || 'Geral'
            const downloadUrl = getDocumentUrl(doc)

            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex-wrap sm:flex-nowrap"
              >
                {canManage && (
                  <Checkbox checked={selected.has(doc.id)} onCheckedChange={() => toggle(doc.id)} />
                )}

                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 shrink-0">
                  <FileText className="h-5 w-5 text-[#0055A4]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {doc.category || 'Geral'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="font-medium text-slate-700">{company}</span>
                    <span>•</span>
                    <span>{isoName}</span>
                    <span>•</span>
                    <span>{new Date(doc.created).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {doc.comment && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-1.5 rounded mt-1.5 border border-amber-200">
                      <strong>Nota do Auditor:</strong> {doc.comment}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {statusBadge(doc.status)}

                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#0055A4] hover:text-[#1A73E8] bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Baixar
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Floating bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-slate-300 rounded-xl shadow-2xl px-5 py-3">
          <span className="text-sm font-semibold text-slate-800">
            {selected.size} selecionado(s)
          </span>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            onClick={() => handleBulk('approve')}
          >
            <CheckCircle2 className="h-4 w-4" /> Aprovar em Lote
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-1"
            onClick={() => setRejectOpen(true)}
          >
            <XCircle className="h-4 w-4" /> Rejeitar
          </Button>
        </div>
      )}

      {/* Reject reason modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Rejeitar Documentos Selecionados</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-xs text-slate-500">
              Descreva o motivo ou orientação para que o cliente realize a correção necessária.
            </p>
            <Textarea
              placeholder="Ex: Documento sem assinatura do responsável técnico..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleBulk('reject')}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
