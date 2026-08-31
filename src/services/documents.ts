import pb from '@/lib/pocketbase/client'

export interface IsoDocument {
  id: string
  certification: string
  user: string
  name: string
  required: boolean
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado'
  category: 'documentação' | 'evidência' | 'formulário' | 'certificado' | 'outro'
  file?: string
  comment?: string
  created: string
  updated: string
  expand?: {
    certification?: {
      id: string
      company_name?: string
      expand?: { iso_type?: { code: string; name: string } }
    }
  }
}

export const bulkDocumentAction = (ids: string[], action: 'approve' | 'reject', comment?: string) =>
  pb.send('/backend/v1/documents/bulk-action', {
    method: 'POST',
    body: JSON.stringify({ ids, action, comment }),
    headers: { 'Content-Type': 'application/json' },
  })

export const getDocumentsByCertification = (certificationId: string) =>
  pb.collection('documents').getFullList<IsoDocument>({
    filter: `certification = "${certificationId}"`,
    sort: '-created',
  })

export const getAllDocuments = () => {
  const isClient = pb.authStore.record?.['role'] === 'cliente'
  const filter =
    isClient && pb.authStore.record?.id
      ? `user = "${pb.authStore.record.id}" || certification.user = "${pb.authStore.record.id}"`
      : undefined
  return pb.collection('documents').getFullList<IsoDocument>({
    filter,
    sort: '-created',
    expand: 'certification.iso_type',
  })
}

export const createDocument = (formData: FormData) =>
  pb.collection('documents').create<IsoDocument>(formData)

export const updateDocument = (id: string, data: Partial<IsoDocument> | FormData) =>
  pb.collection('documents').update<IsoDocument>(id, data)

export const getDocumentUrl = (doc: IsoDocument) => {
  if (!doc.file) return ''
  return pb.files.getURL(doc, doc.file)
}
