import pb from '@/lib/pocketbase/client'

export interface IsoDocument {
  id: string
  certification: string
  user: string
  name: string
  required: boolean
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado'
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

export const getDocumentsByCertification = (certificationId: string) =>
  pb.collection('documents').getFullList<IsoDocument>({
    filter: `certification = "${certificationId}"`,
    sort: '-created',
  })

export const getAllDocuments = () =>
  pb.collection('documents').getFullList<IsoDocument>({
    sort: '-created',
    expand: 'certification.iso_type',
  })

export const createDocument = (formData: FormData) =>
  pb.collection('documents').create<IsoDocument>(formData)

export const updateDocument = (id: string, data: Partial<IsoDocument> | FormData) =>
  pb.collection('documents').update<IsoDocument>(id, data)

export const getDocumentUrl = (doc: IsoDocument) => {
  if (!doc.file) return ''
  return pb.files.getURL(doc, doc.file)
}
