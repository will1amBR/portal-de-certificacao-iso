import pb from '@/lib/pocketbase/client'

export interface SiteMetric {
  value: string
  label: string
}

export interface SiteTestimonial {
  quote: string
  name: string
  role: string
}

export interface SiteTeamMember {
  name: string
  role: string
  bio: string
  img: string
}

export interface SiteTeamContent {
  headline: string
  members: SiteTeamMember[]
}

export interface SiteBranding {
  orgName: string
  logoUrl: string
  /** Nome do arquivo de logo enviado ao backend (campo file da coleção). */
  logoFile?: string
}

export interface SiteContent {
  metrics: SiteMetric[]
  testimonials: SiteTestimonial[]
  team: SiteTeamContent
  branding: SiteBranding
}

/* Fallbacks: mesmos valores dos seeds da migração 0026. A landing usa estes
   valores quando o banco está inacessível ou a seção ainda não foi criada. */
export const SITE_CONTENT_FALLBACK: SiteContent = {
  metrics: [
    { value: '-60%', label: 'Tempo de Adequação' },
    { value: '100%', label: 'Conformidade Normativa' },
    { value: '3 Normas', label: '9001 • 14001 • 45001' },
  ],
  testimonials: [
    {
      quote:
        'Conseguimos organizar toda a documentação da obra em uma semana. Na auditoria, não faltou um único documento.',
      name: 'Marcos T.',
      role: 'Diretor, Construtora Horizonte',
    },
    {
      quote:
        'O portal eliminou as planilhas paralelas. Cada cláusula vira um card no Kanban, com responsável e prazo claros.',
      name: 'Fernanda L.',
      role: 'Coordenadora de Qualidade, Varejo',
    },
    {
      quote:
        'Como certificadora, ganhamos visibilidade total do pipeline de clientes e das não conformidades em aberto.',
      name: 'Ricardo M.',
      role: 'Auditor Líder, ALC Certificadora',
    },
  ],
  team: {
    headline:
      'Décadas de experiência em certificações ISO, auditorias e consultoria técnica. Quem responde você dentro do portal é gente que já conduziu centenas de auditorias.',
    members: [
      {
        name: 'João Silva',
        role: 'Fundador e CEO',
        bio: 'Mais de 20 anos liderando certificações ISO para empresas de todos os portes.',
        img: 'https://img.usecurling.com/ppl/large?gender=male&seed=10',
      },
      {
        name: 'Cauli',
        role: 'Auditor Líder e Consultor Sênior',
        bio: 'Especialista em auditoria e conformidade com ampla experiência em auditorias ISO 9001, 14001 e 45001.',
        img: 'https://img.usecurling.com/ppl/large?gender=male&seed=20',
      },
      {
        name: 'Roberto Lima',
        role: 'Diretor Técnico',
        bio: 'Engenheiro de segurança com ampla atuação em ISO 45001, NRs e gestão de riscos ocupacionais.',
        img: 'https://img.usecurling.com/ppl/large?gender=male&seed=30',
      },
    ],
  },
  branding: {
    orgName: 'ALC Certificadora',
    logoUrl: '',
  },
}

type SiteContentRecord = {
  id: string
  section: string
  data: string | Record<string, unknown> | null
  logo?: string
  collectionId?: string
  collectionName?: string
}

const parseData = (raw: string | Record<string, unknown> | null | undefined): unknown => {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return raw
}

/** Carrega o conteúdo gerenciável do site. Nunca lança: em erro devolve o fallback. */
export async function getSiteContent(): Promise<SiteContent> {
  const result: SiteContent = {
    metrics: SITE_CONTENT_FALLBACK.metrics,
    testimonials: SITE_CONTENT_FALLBACK.testimonials,
    team: SITE_CONTENT_FALLBACK.team,
    branding: SITE_CONTENT_FALLBACK.branding,
  }
  try {
    const rows = await pb.collection('site_content').getFullList<SiteContentRecord>({
      sort: 'section',
    })
    for (const row of rows) {
      const data = parseData(row.data)
      if (!data) continue
      if (row.section === 'metrics') {
        const list = (data as { metrics?: unknown }).metrics ?? data
        if (Array.isArray(list) && list.length > 0) {
          result.metrics = list as SiteMetric[]
        }
      } else if (row.section === 'testimonials') {
        const list = (data as { testimonials?: unknown }).testimonials ?? data
        if (Array.isArray(list) && list.length > 0) {
          result.testimonials = list as SiteTestimonial[]
        }
      } else if (row.section === 'team') {
        const team = data as Partial<SiteTeamContent>
        if (team && typeof team.headline === 'string' && Array.isArray(team.members)) {
          result.team = {
            headline: team.headline,
            members: team.members,
          }
        }
      } else if (row.section === 'branding') {
        const branding = data as Partial<SiteBranding>
        if (branding && typeof branding.orgName === 'string' && branding.orgName.trim() !== '') {
          // O arquivo enviado tem prioridade sobre uma URL externa.
          const fileUrl = row.logo ? pb.files.getURL(row, row.logo) : ''
          result.branding = {
            orgName: branding.orgName,
            logoUrl: fileUrl || (typeof branding.logoUrl === 'string' ? branding.logoUrl : ''),
            logoFile: row.logo || '',
          }
        }
      }
    }
  } catch {
    /* banco indisponível ou coleção ausente: usa fallback completo */
  }
  return result
}

const SITE_CONTENT_SECTIONS = ['metrics', 'testimonials', 'team', 'branding'] as const
export type SiteContentSection = (typeof SITE_CONTENT_SECTIONS)[number]

/** Salva (cria ou atualiza) o conteúdo de uma seção. Uso exclusivo do admin. */
export async function saveSiteContentSection(
  section: SiteContentSection,
  data: unknown,
): Promise<void> {
  const payload = JSON.stringify(data)
  const existing = await pb.collection('site_content').getList<SiteContentRecord>(1, 1, {
    filter: `section = "${section}"`,
  })
  if (existing.items.length > 0) {
    await pb.collection('site_content').update(existing.items[0].id, { data: payload })
  } else {
    await pb.collection('site_content').create({ section, data: payload })
  }
}

/** Salva o conteúdo completo (todas as seções) de uma vez. */
export async function saveSiteContent(content: SiteContent): Promise<void> {
  await Promise.all([
    saveSiteContentSection('metrics', { metrics: content.metrics }),
    saveSiteContentSection('testimonials', { testimonials: content.testimonials }),
    saveSiteContentSection('team', content.team),
    saveSiteContentSection('branding', content.branding),
  ])
}

/** Garante que exista o registro da seção "branding" e o retorna. */
async function ensureBrandingRecord(): Promise<SiteContentRecord> {
  const existing = await pb.collection('site_content').getList<SiteContentRecord>(1, 1, {
    filter: 'section = "branding"',
  })
  if (existing.items.length > 0) return existing.items[0]
  return pb.collection('site_content').create<SiteContentRecord>({
    section: 'branding',
    data: JSON.stringify(SITE_CONTENT_FALLBACK.branding),
  })
}

/** Envia o arquivo de logo ao backend e retorna a URL pública gerada. */
export async function uploadSiteLogo(file: File): Promise<string> {
  const record = await ensureBrandingRecord()
  const fd = new FormData()
  fd.append('logo', file)
  const updated = await pb.collection('site_content').update<SiteContentRecord>(record.id, fd)
  const uploaded = updated.logo
  return uploaded ? pb.files.getURL(updated, uploaded) : ''
}

/** Remove o arquivo de logo do registro de branding. */
export async function removeSiteLogo(): Promise<void> {
  const record = await ensureBrandingRecord()
  await pb.collection('site_content').update(record.id, { logo: null })
}
