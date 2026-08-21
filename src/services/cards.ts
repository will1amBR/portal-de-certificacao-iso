import pb from '@/lib/pocketbase/client'

export interface PipeCard {
  id: string
  pipe: string
  certification?: string
  user?: string
  title: string
  origin?: string
  description?: string
  stage: string
  priority?: 'baixa' | 'média' | 'alta' | 'crítica'
  due_date?: string
  assignee?: string
  data?: Record<string, any>
  order?: number
  created: string
  updated: string
  expand?: {
    user?: { id: string; name: string; email: string }
    assignee?: { id: string; name: string; email: string; avatar?: string }
    pipe?: { id: string; title: string; code: string }
    certification?: { id: string; company_name: string }
  }
}

export const getCardsByPipe = async (pipeId: string, certId?: string) => {
  let filter = `pipe = "${pipeId}"`
  if (certId) {
    filter += ` && (certification = "${certId}" || certification = "" || certification = null)`
  }
  return pb.collection('pipe_cards').getFullList<PipeCard>({
    filter,
    sort: 'order,created',
    expand: 'assignee,user,certification',
  })
}

export const getAllCards = async () => {
  return pb.collection('pipe_cards').getFullList<PipeCard>({
    sort: '-created',
    expand: 'pipe,assignee',
  })
}

export const createCard = async (data: Partial<PipeCard>) => {
  return pb.collection('pipe_cards').create<PipeCard>({
    ...data,
    user: pb.authStore.record?.id,
  })
}

export const updateCard = async (id: string, data: Partial<PipeCard>) => {
  return pb.collection('pipe_cards').update<PipeCard>(id, data)
}

export const moveCardStage = async (id: string, newStage: string) => {
  return pb.collection('pipe_cards').update<PipeCard>(id, {
    stage: newStage,
  })
}

export const deleteCard = async (id: string) => {
  return pb.collection('pipe_cards').delete(id)
}
