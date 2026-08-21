import pb from '@/lib/pocketbase/client'

export interface Pipe {
  id: string
  title: string
  code?: string
  description?: string
  icon?: string
  color?: string
  order?: number
  stages: string[]
  business_model?: string
  iso_type?: string
  created: string
  updated: string
  expand?: {
    cards_count?: number
    business_model?: { id: string; name: string }
    iso_type?: { id: string; name: string; code: string }
  }
}

export const getPipes = async (filter?: string) => {
  return pb.collection('pipes').getFullList<Pipe>({
    sort: 'order,created',
    filter: filter || '',
    expand: 'business_model,iso_type',
  })
}

export const getPipe = async (id: string) => {
  return pb.collection('pipes').getOne<Pipe>(id, {
    expand: 'business_model,iso_type',
  })
}

export const createPipe = async (data: Partial<Pipe>) => {
  return pb.collection('pipes').create<Pipe>(data)
}

export const updatePipe = async (id: string, data: Partial<Pipe>) => {
  return pb.collection('pipes').update<Pipe>(id, data)
}

export const deletePipe = async (id: string) => {
  return pb.collection('pipes').delete(id)
}
