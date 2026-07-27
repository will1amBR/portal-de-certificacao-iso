import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  getMessagesByCertification,
  sendMessage,
  markMessagesAsRead,
  getMessageAttachmentUrl,
  IsoMessage,
} from '@/services/messages'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'

export function CertMessages({ certId }: { certId: string }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<IsoMessage[]>([])
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const userId = user?.id || ''

  const load = async () => {
    setMessages(await getMessagesByCertification(certId))
  }
  useEffect(() => {
    load()
  }, [certId])
  useRealtime('messages', () => {
    load()
  })

  useEffect(() => {
    if (messages.length > 0) {
      const unread = messages.filter((m) => m.sender !== userId && !m.is_read)
      if (unread.length > 0) markMessagesAsRead(certId, userId).then(() => load())
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, certId, userId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() && !file) return
    setSending(true)
    try {
      await sendMessage(certId, text.trim(), file || undefined)
      setText('')
      setFile(null)
      load()
    } catch {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const initials = (name?: string) => (name ? name.slice(0, 2).toUpperCase() : 'US')

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => {
          const isMe = m.sender === userId
          return (
            <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src={
                    m.expand?.sender?.avatar
                      ? pb.files.getURL(
                          { id: m.expand.sender.id, collectionName: 'users' } as any,
                          m.expand.sender.avatar,
                        )
                      : undefined
                  }
                />
                <AvatarFallback className="text-[10px] bg-[#0055A4] text-white">
                  {initials(m.expand?.sender?.name)}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${isMe ? 'items-end' : ''}`}>
                <div
                  className={`rounded-lg px-3 py-2 ${isMe ? 'bg-[#0055A4] text-white' : 'bg-white border border-slate-200'}`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold text-[#0055A4] mb-0.5">
                      {m.expand?.sender?.name || 'Usuário'}
                    </p>
                  )}
                  <p className="text-sm">{m.content}</p>
                  {m.attachment && (
                    <a
                      href={getMessageAttachmentUrl(m)}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1 mt-1.5 text-xs ${isMe ? 'text-blue-100' : 'text-[#0055A4]'} hover:underline`}
                    >
                      <Download className="h-3 w-3" /> Anexo
                    </a>
                  )}
                </div>
                <p className={`text-[10px] text-slate-400 mt-0.5 ${isMe ? 'text-right' : ''}`}>
                  {new Date(m.created).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t">
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-4 w-4 text-slate-500" />
          </Button>
        </label>
        {file && <span className="text-xs text-slate-500 truncate max-w-32">{file.name}</span>}
        <Input
          placeholder="Digite sua mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={sending} className="bg-[#0055A4]">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
