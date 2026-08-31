import pb from '@/lib/pocketbase/client'

export interface CompanyDepartment {
  id: string
  name: string
  manager: string
  phone: string
  email: string
  notes?: string
}

export interface IsoUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  cnpj?: string
  business_model?: string
  departments?: CompanyDepartment[]
  onboarding_completed?: boolean
  created: string
  updated: string
  expand?: {
    business_model?: { id: string; name: string }
  }
}

export const getConsultants = () =>
  pb.collection('users').getFullList<IsoUser>({
    filter: 'role = "consultor" || role = "admin"',
  })

export const getAllUsers = () =>
  pb.collection('users').getFullList<IsoUser>({
    sort: 'name',
    expand: 'business_model',
  })

export const getUserById = (id: string) =>
  pb.collection('users').getOne<IsoUser>(id, {
    expand: 'business_model',
  })

export const updateUser = (
  id: string,
  data: Partial<{
    name: string
    avatar: File
    role: string
    cnpj: string
    business_model: string
    departments: CompanyDepartment[]
    onboarding_completed: boolean
  }>,
) => pb.collection('users').update<IsoUser>(id, data)
