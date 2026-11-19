import { useEffect, useState } from 'react'
import { SiteContent, getSiteContent, SITE_CONTENT_FALLBACK } from '@/services/site_content'

/* Cache de sessão: evita refazer a busca do conteúdo a cada seção da landing.
   O admin invalida via reload ao salvar. */
let cached: SiteContent | null = null

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(cached ?? SITE_CONTENT_FALLBACK)

  useEffect(() => {
    if (cached) return
    let active = true
    getSiteContent().then((c) => {
      cached = c
      if (active) setContent(c)
    })
    return () => {
      active = false
    }
  }, [])

  return content
}

/** Recarrega o conteúdo ignorando o cache de sessão (usado pelo admin ao salvar). */
export function invalidateSiteContentCache() {
  cached = null
}
