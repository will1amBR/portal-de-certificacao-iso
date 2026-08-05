import pb from '@/lib/pocketbase/client'

export interface Notification {
  id: string
  user: string
  certification?: string
  type: string
  title: string
  message: string
  is_read: boolean
  created: string
  updated: string
  expand?: { certification?: { id: string; company_name?: string } }
}

export const getNotifications = () =>
  pb.collection('notifications').getList<Notification>(1, 10, {
    filter: `user = "${pb.authStore.record?.id}"`,
    sort: '-created',
    expand: 'certification',
  })

export const getUnreadCount = async () => {
  const result = await pb.collection('notifications').getList(1, 1, {
    filter: `user = "${pb.authStore.record?.id}" && is_read = false`,
  })
  return result.totalItems
}

export const markAsRead = (id: string) =>
  pb.collection('notifications').update(id, { is_read: true })

export const markAllAsRead = async () => {
  const unread = await pb.collection('notifications').getFullList({
    filter: `user = "${pb.authStore.record?.id}" && is_read = false`,
  })
  await Promise.all(
    unread.map((n) => pb.collection('notifications').update(n.id, { is_read: true })),
  )
}

export const getAllNotifications = () =>
  pb.collection('notifications').getList<Notification>(1, 50, {
    sort: '-created',
    expand: 'certification',
  })
