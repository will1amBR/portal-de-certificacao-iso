import pb from '@/lib/pocketbase/client'

export interface BusinessModel {
  id: string
  name: string
  description: string
  icon: string
  created: string
  updated: string
}

export const getBusinessModels = () =>
  pb.collection('business_models').getFullList<BusinessModel>({ sort: 'name' })

export const getBusinessModel = (id: string) =>
  pb.collection('business_models').getOne<BusinessModel>(id)

export const createBusinessModel = (data: Partial<BusinessModel>) =>
  pb.collection('business_models').create<BusinessModel>(data)

export const updateBusinessModel = (id: string, data: Partial<BusinessModel>) =>
  pb.collection('business_models').update<BusinessModel>(id, data)

export const deleteBusinessModel = (id: string) => pb.collection('business_models').delete(id)
