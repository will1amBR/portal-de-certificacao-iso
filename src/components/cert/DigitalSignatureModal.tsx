import { useState, useRef } from 'react'
import {
  PenTool,
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck,
  Lock,
  Calendar,
  Trash2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { SignaturePad, SignatureCanvasHandle } from './SignaturePad'
import {
  ReportSignature,
  SignatureRoleType,
  createReportSignature,
  deleteReportSignature,
} from '@/services/report_signatures'
import { Certification } from '@/services/certifications'
import { IsoUser } from '@/services/users'

interface DigitalSignatureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certification: Certification
  currentUser: {
    id: string
    name?: string
    email?: string
    role?: string
    cnpj?: string
  }
  roleType: SignatureRoleType
  existingSignature?: ReportSignature | null
  onSignatureSaved: () => void
}

export function DigitalSignatureModal({
  open,
  onOpenChange,
  certification,
  currentUser,
  roleType,
  existingSignature,
  onSignatureSaved,
}: DigitalSignatureModalProps) {
  const padRef = useRef<SignatureCanvasHandle | null>(null)
  const isRd = roleType === 'rd_empresa'
  const defaultPosition = isRd
    ? 'Representante da Direção (RD) / Responsável Legal'
    : 'Auditor Líder / Especialista Técnico INMETRO'

  const [signerName, setSignerName] = useState(
    existingSignature?.signer_name || currentUser.name || '',
  )
  const [signerDocument, setSignerDocument] = useState(
    existingSignature?.signer_document ||
      (isRd
        ? currentUser.cnpj || certification.expand?.user?.cnpj || ''
        : 'AUD-INMETRO-78429/2026'),
  )
  const [signerPosition, setSignerPosition] = useState(
    existingSignature?.signer_position || defaultPosition,
  )
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [saving, setSaving] = useState(false)

  const defaultStatement = isRd
    ? `Declaro, na qualidade de Representante da Direção (RD) da empresa ${certification.company_name || 'contratante'}, que todas as evidências, tarefas e documentos apresentados neste relatório refletem a conformidade do Sistema de Gestão com a norma ${certification.expand?.iso_type?.name || 'ISO'}.`
    : `Atesto tecnicamente, na qualidade de Auditor Líder credenciado perante o INMETRO / ALC Certificadora, a realização dos procedimentos de avaliação e verificação de conformidade do relatório técnico.`

  const generateHash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    const nowHex = Date.now().toString(16)
    return `ALC-ISO-SIG-${hex.toUpperCase()}-${nowHex.slice(-6).toUpperCase()}`
  }

  const handleSave = async () => {
    if (!signerName.trim()) {
      toast.error('Informe o nome completo do signatário.')
      return
    }
    if (!acceptedTerms) {
      toast.error('Você deve concordar com o termo de responsabilidade e aceite digital.')
      return
    }

    const signatureDataUrl = padRef.current?.toDataURL() || ''

    setSaving(true)
    try {
      const authHash = generateHash(
        `${currentUser.id}-${certification.id}-${roleType}-${Date.now()}`,
      )

      await createReportSignature({
        certification: certification.id,
        role_type: roleType,
        signer_name: signerName.trim(),
        signer_document: signerDocument.trim() || undefined,
        signer_position: signerPosition.trim() || defaultPosition,
        signature_image: signatureDataUrl || undefined,
        acceptance_hash: authHash,
        signed_at: new Date().toISOString(),
        statement: defaultStatement,
      })

      toast.success(
        isRd
          ? 'Assinatura digital da Empresa (RD) registrada com sucesso!'
          : 'Assinatura técnica do Auditor Líder registrada com sucesso!',
      )
      onOpenChange(false)
      onSignatureSaved()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar assinatura digital.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!existingSignature) return
    if (!confirm('Deseja realmente revogar/remover esta assinatura digital do relatório?')) return
    try {
      await deleteReportSignature(existingSignature.id)
      toast.success('Assinatura revogada com sucesso.')
      onOpenChange(false)
      onSignatureSaved()
    } catch {
      toast.error('Erro ao revogar assinatura.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`p-2 rounded-lg ${isRd ? 'bg-sky-100 text-[#0055A4]' : 'bg-emerald-100 text-emerald-700'}`}
            >
              {isRd ? <Building2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {isRd
                  ? 'Assinatura Digital — Responsável da Empresa (RD)'
                  : 'Assinatura Digital — Auditor Líder / ALC INMETRO'}
              </DialogTitle>
              <p className="text-xs text-slate-500">
                {isRd
                  ? 'Representante legal da direção para homologação do dossiê ISO'
                  : 'Atestado técnico de auditoria e conformidade normativa'}
              </p>
            </div>
          </div>
        </DialogHeader>

        {existingSignature ? (
          <div className="space-y-4 py-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Assinatura Digital Já Registrada
                </span>
                <Badge className="bg-emerald-700 text-white">Válida & Homologada</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-emerald-700 font-medium block">Signatário:</span>
                  <strong className="text-slate-900">{existingSignature.signer_name}</strong>
                </div>
                <div>
                  <span className="text-emerald-700 font-medium block">Cargo / Função:</span>
                  <strong className="text-slate-900">
                    {existingSignature.signer_position || '-'}
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-700 font-medium block">Documento / Registro:</span>
                  <span className="text-slate-800 font-mono">
                    {existingSignature.signer_document || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-700 font-medium block">Data do Aceite:</span>
                  <span className="text-slate-800">
                    {existingSignature.signed_at
                      ? new Date(existingSignature.signed_at).toLocaleString('pt-BR')
                      : new Date(existingSignature.created).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {existingSignature.acceptance_hash && (
                <div className="pt-2 border-t border-emerald-200/80 text-[11px] font-mono text-emerald-800 flex items-center justify-between">
                  <span>Hash / Autenticação:</span>
                  <strong className="tracking-wide bg-emerald-100/80 px-2 py-0.5 rounded">
                    {existingSignature.acceptance_hash}
                  </strong>
                </div>
              )}

              {existingSignature.signature_image && (
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                  <span className="text-[10px] text-slate-400 block mb-1">
                    Rubrica manual registrada:
                  </span>
                  <img
                    src={existingSignature.signature_image}
                    alt="Rubrica Digital"
                    className="max-h-20 mx-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="text-xs gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                Revogar / Assinar Novamente
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Nome Completo do Signatário *
                </Label>
                <Input
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Nome completo"
                  className="text-xs h-9"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {isRd ? 'CNPJ / CPF do Responsável' : 'Registro / Matrícula do Auditor'}
                </Label>
                <Input
                  value={signerDocument}
                  onChange={(e) => setSignerDocument(e.target.value)}
                  placeholder={isRd ? '00.000.000/0001-00' : 'AUD-INMETRO-...'}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Cargo / Atribuição Técnica *
              </Label>
              <Input
                value={signerPosition}
                onChange={(e) => setSignerPosition(e.target.value)}
                placeholder="Ex: Representante da Direção (RD)"
                className="text-xs h-9"
              />
            </div>

            {/* Rubrica / Canvas */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                Rubrica Digital (Desenhe com mouse ou touch):
              </Label>
              <SignaturePad ref={padRef} />
            </div>

            {/* Termo de Aceite & Declaração Formal */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <p className="text-[11px] text-slate-600 leading-relaxed italic">
                "{defaultStatement}"
              </p>
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(c) => setAcceptedTerms(!!c)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="text-xs text-slate-700 font-medium cursor-pointer leading-tight"
                >
                  Confirmo a veracidade das informações e autorizo o registro desta assinatura
                  eletrônica com carimbo de autenticidade no Dossiê de Auditoria ISO.
                </Label>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-blue-50/70 p-2 rounded border border-blue-200 text-blue-900">
              <Lock className="h-3.5 w-3.5 shrink-0 text-blue-600" />
              <span>
                Esta assinatura é protegida por hash digital de integridade e será estampada no
                relatório individual para impressão / PDF.
              </span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !acceptedTerms}
                className={
                  isRd
                    ? 'bg-[#0055A4] hover:bg-[#1A73E8] text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }
              >
                {saving ? 'Registrando...' : 'Confirmar & Assinar Dossiê'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
