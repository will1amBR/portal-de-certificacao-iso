import pb from '@/lib/pocketbase/client'

export interface IsoTask {
  id: string
  certification: string
  title: string
  description?: string
  completed: boolean
  due_date?: string
  created: string
  updated: string
}

export const getTasksByCertification = (certificationId: string) =>
  pb.collection('tasks').getFullList<IsoTask>({
    filter: `certification = "${certificationId}"`,
    sort: 'created',
  })

export const createTask = (data: {
  certification: string
  title: string
  description?: string
  due_date?: string
}) =>
  pb.collection('tasks').create<IsoTask>({
    certification: data.certification,
    title: data.title,
    description: data.description || '',
    completed: false,
    due_date: data.due_date || undefined,
  })

export const toggleTaskCompleted = (id: string, completed: boolean) =>
  pb.collection('tasks').update<IsoTask>(id, { completed })

export const deleteTask = (id: string) => pb.collection('tasks').delete(id)
