import pb from '@/lib/pocketbase/client'

export interface IsoMessage {
  id: string
  certification: string
  sender: string
  content: string
  is_read: boolean
  attachment?: string
  created: string
  updated: string
  expand?: {
    sender?: { id: string; name: string; avatar?: string; email: string }
  }
}

export const getMessageAttachmentUrl = (msg: IsoMessage) => {
  if (!msg.attachment) return ''
  return pb.files.getURL(msg, msg.attachment)
}

export const markMessagesAsRead = async (certificationId: string, currentUserId: string) => {
  const unread = await pb.collection('messages').getFullList<IsoMessage>({
    filter: `certification = "${certificationId}" && sender != "${currentUserId}" && is_read = false`,
  })
  await Promise.all(unread.map((m) => pb.collection('messages').update(m.id, { is_read: true })))
}

export const getMessagesByCertification = (certificationId: string) =>
  pb.collection('messages').getFullList<IsoMessage>({
    filter: `certification = "${certificationId}"`,
    sort: 'created',
    expand: 'sender',
  })

export const sendMessage = (certificationId: string, content: string, file?: File) => {
  if (file) {
    const formData = new FormData()
    formData.append('certification', certificationId)
    formData.append('sender', pb.authStore.record?.id || '')
    formData.append('content', content)
    formData.append('is_read', 'false')
    formData.append('attachment', file)
    return pb.collection('messages').create<IsoMessage>(formData)
  }
  return pb.collection('messages').create<IsoMessage>({
    certification: certificationId,
    sender: pb.authStore.record?.id,
    content,
    is_read: false,
  })
}
