import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  Notification,
} from '@/services/notifications'

export function NotificationBell() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  const loadData = async () => {
    try {
      const [list, count] = await Promise.all([getNotifications(), getUnreadCount()])
      setNotifications(list.items)
      setUnread(count)
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('notifications', () => {
    loadData()
  })

  const handleClick = async (n: Notification) => {
    await markAsRead(n.id)
    setOpen(false)
    if (n.certification) navigate(`/certificacoes/${n.certification}`)
    else loadData()
  }

  const handleMarkAll = async () => {
    await markAllAsRead()
    loadData()
  }

  const fmtTime = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'Agora'
    if (m < 60) return `${m}min atrás`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h atrás`
    return `${Math.floor(h / 24)}d atrás`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-600 relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-0.5 right-0.5 h-4 min-w-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm">Notificações</span>
          {unread > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="text-xs text-[#0055A4] hover:underline flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-blue-50 transition-colors"
            >
              <CheckCheck className="h-3 w-3 shrink-0" /> Marcar todas como lidas
            </button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">Sem notificações</div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#0055A4] shrink-0" />
                    )}
                    <div className={n.is_read ? 'pl-4' : ''}>
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{fmtTime(n.created)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
