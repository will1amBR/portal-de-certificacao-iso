import pb from '@/lib/pocketbase/client'

export interface IsoUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  created: string
  updated: string
}

export const getConsultants = () =>
  pb.collection('users').getFullList<IsoUser>({
    filter: 'role = "consultor" || role = "admin"',
  })

export const getAllUsers = () => pb.collection('users').getFullList<IsoUser>({ sort: 'name' })

export const updateUser = (
  id: string,
  data: Partial<{ name: string; avatar: File; role: string }>,
) => pb.collection('users').update<IsoUser>(id, data)
