import pb from '@/lib/pocketbase/client'

export interface IsoMessage {
  id: string
  certification: string
  sender: string
  content: string
  created: string
  updated: string
  expand?: {
    sender?: { id: string; name: string; avatar?: string; email: string }
  }
}

export const getMessagesByCertification = (certificationId: string) =>
  pb.collection('messages').getFullList<IsoMessage>({
    filter: `certification = "${certificationId}"`,
    sort: 'created',
    expand: 'sender',
  })

export const sendMessage = (certificationId: string, content: string) =>
  pb.collection('messages').create<IsoMessage>({
    certification: certificationId,
    sender: pb.authStore.record?.id,
    content,
  })
