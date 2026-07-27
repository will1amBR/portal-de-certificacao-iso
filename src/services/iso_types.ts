import pb from '@/lib/pocketbase/client'

export interface IsoType {
  id: string
  name: string
  code: string
  description: string
  icon: string
  created: string
  updated: string
}

export const getIsoTypes = () => pb.collection('iso_types').getFullList<IsoType>({ sort: 'code' })
export const getIsoType = (id: string) => pb.collection('iso_types').getOne<IsoType>(id)
