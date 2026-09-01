import pb from '@/lib/pocketbase/client'

export type SignatureRoleType = 'rd_empresa' | 'auditor_lider'

export interface ReportSignature {
  id: string
  certification: string
  signer: string
  role_type: SignatureRoleType
  signer_name: string
  signer_document?: string
  signer_position?: string
  signature_image?: string
  acceptance_hash?: string
  signed_at?: string
  ip_address?: string
  statement?: string
  created: string
  updated: string
  expand?: {
    signer?: {
      id: string
      name: string
      email: string
      role: string
      cnpj?: string
    }
  }
}

export const getSignaturesByCertification = async (certificationId: string) => {
  return pb.collection('report_signatures').getFullList<ReportSignature>({
    filter: `certification = "${certificationId}"`,
    sort: 'created',
    expand: 'signer',
  })
}

export const createReportSignature = async (data: {
  certification: string
  role_type: SignatureRoleType
  signer_name: string
  signer_document?: string
  signer_position?: string
  signature_image?: string
  acceptance_hash?: string
  signed_at?: string
  statement?: string
}) => {
  const userId = pb.authStore.record?.id
  if (!userId) throw new Error('Usuário não autenticado para assinar relatório.')

  return pb.collection('report_signatures').create<ReportSignature>({
    ...data,
    signer: userId,
    signed_at: data.signed_at || new Date().toISOString(),
  })
}

export const deleteReportSignature = async (id: string) => {
  return pb.collection('report_signatures').delete(id)
}
