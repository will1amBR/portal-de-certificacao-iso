import pb from '@/lib/pocketbase/client'
import { IsoType } from './iso_types'

export interface Certification {
  id: string
  user: string
  iso_type: string
  status:
    | 'não iniciado'
    | 'em andamento'
    | 'pendente de documentos'
    | 'aguardando auditoria'
    | 'concluído'
  progress: number
  consultant?: string
  start_date?: string
  company_name?: string
  template_applied?: boolean
  created: string
  updated: string
  expand?: {
    iso_type?: IsoType
    user?: {
      id: string
      name: string
      email: string
      avatar?: string
      business_model?: string
      cnpj?: string
    }
    consultant?: { id: string; name: string; email: string; avatar?: string }
  }
}

export const getCertifications = () => {
  const isClient = pb.authStore.record?.['role'] === 'cliente'
  const filter =
    isClient && pb.authStore.record?.id ? `user = "${pb.authStore.record.id}"` : undefined
  return pb.collection('certifications').getFullList<Certification>({
    filter,
    sort: '-created',
    expand: 'iso_type,consultant,user',
  })
}

export const getCertification = (id: string) =>
  pb.collection('certifications').getOne<Certification>(id, {
    expand: 'iso_type,consultant,user',
  })

export const createCertification = async (data: {
  iso_type: string
  company_name?: string
  start_date?: string
}) => {
  const cert = await pb.collection('certifications').create<Certification>({
    user: pb.authStore.record?.id,
    iso_type: data.iso_type,
    status: 'não iniciado',
    progress: 0,
    company_name: data.company_name,
    start_date: data.start_date || new Date().toISOString(),
  })

  const businessModel = pb.authStore.record?.['business_model'] as string | undefined
  if (businessModel) {
    try {
      const { instantiateTemplatesForCertification } = await import('./templates')
      await instantiateTemplatesForCertification(
        cert.id,
        businessModel,
        pb.authStore.record!.id,
        cert.start_date,
      )
    } catch {
      /* templates failed - cert still created */
    }
  }

  return cert
}

export const updateCertification = (id: string, data: Partial<Certification>) =>
  pb.collection('certifications').update<Certification>(id, data)

export const deleteCertification = (id: string) => pb.collection('certifications').delete(id)
