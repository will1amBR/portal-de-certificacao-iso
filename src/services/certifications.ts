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
  created: string
  updated: string
  expand?: {
    iso_type?: IsoType
    user?: { id: string; name: string; email: string; avatar?: string }
    consultant?: { id: string; name: string; email: string; avatar?: string }
  }
}

export const getCertifications = () =>
  pb.collection('certifications').getFullList<Certification>({
    sort: '-created',
    expand: 'iso_type,consultant',
  })

export const getCertification = (id: string) =>
  pb.collection('certifications').getOne<Certification>(id, {
    expand: 'iso_type,consultant,user',
  })

export const createCertification = (data: {
  iso_type: string
  company_name?: string
  start_date?: string
}) =>
  pb.collection('certifications').create<Certification>({
    user: pb.authStore.record?.id,
    iso_type: data.iso_type,
    status: 'não iniciado',
    progress: 0,
    company_name: data.company_name,
    start_date: data.start_date || new Date().toISOString(),
  })

export const updateCertification = (id: string, data: Partial<Certification>) =>
  pb.collection('certifications').update<Certification>(id, data)

export const deleteCertification = (id: string) => pb.collection('certifications').delete(id)
