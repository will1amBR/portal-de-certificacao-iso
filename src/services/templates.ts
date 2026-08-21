import pb from '@/lib/pocketbase/client'

export interface Template {
  id: string
  business_model: string
  type: 'task' | 'document' | 'schedule'
  title: string
  description: string
  category: string
  required: boolean
  due_days: number
  created: string
  updated: string
  expand?: {
    business_model?: { id: string; name: string; icon: string }
  }
}

export const getTemplates = () =>
  pb.collection('templates').getFullList<Template>({
    sort: 'type,title',
    expand: 'business_model',
  })

export const getTemplatesByBusinessModel = (businessModelId: string) =>
  pb.collection('templates').getFullList<Template>({
    filter: `business_model = "${businessModelId}"`,
    sort: 'type,title',
  })

export const createTemplate = (data: {
  business_model: string
  type: 'task' | 'document' | 'schedule'
  title: string
  description?: string
  category?: string
  required?: boolean
  due_days?: number
}) => pb.collection('templates').create<Template>(data)

export const updateTemplate = (
  id: string,
  data: Partial<{
    type: string
    title: string
    description: string
    category: string
    required: boolean
    due_days: number
  }>,
) => pb.collection('templates').update<Template>(id, data)

export const deleteTemplate = (id: string) => pb.collection('templates').delete(id)

export const instantiateTemplatesForCertification = async (
  certId: string,
  businessModelId: string,
  userId: string,
  startDate?: string,
) => {
  const templates = await getTemplatesByBusinessModel(businessModelId)
  const start = startDate ? new Date(startDate) : new Date()

  for (const tpl of templates) {
    const dueDate = tpl.due_days
      ? new Date(start.getTime() + tpl.due_days * 86400000).toISOString()
      : undefined

    // Map template category to allowed documents category
    // Allowed categories in documents: 'documentação' | 'evidência' | 'formulário' | 'certificado' | 'outro'
    let docCategory: 'documentação' | 'evidência' | 'formulário' | 'certificado' | 'outro' =
      'documentação'
    const cat = (tpl.category || '').toLowerCase()
    if (cat === 'outro') {
      docCategory = 'outro'
    } else if (
      cat === 'cotação' ||
      cat === 'controle de estoque' ||
      cat === 'gestão de funcionários' ||
      cat === 'qualidade' ||
      cat === 'meio ambiente' ||
      cat === 'saúde e segurança' ||
      cat === 'indicadores'
    ) {
      docCategory = 'evidência'
    } else if (cat === 'renovação' || cat === 'licenças e documentos' || cat === 'documentação') {
      docCategory = 'documentação'
    } else if (cat === 'formulário') {
      docCategory = 'formulário'
    } else if (cat === 'certificado') {
      docCategory = 'certificado'
    }

    if (tpl.type === 'task') {
      await pb.collection('tasks').create({
        certification: certId,
        title: tpl.title,
        description: tpl.description || '',
        completed: false,
        due_date: dueDate,
      })
    } else if (tpl.type === 'document') {
      await pb.collection('documents').create({
        certification: certId,
        user: userId,
        name: tpl.title,
        required: tpl.required ?? false,
        status: 'pendente',
        category: docCategory,
        comment: tpl.description || '',
      })
    } else if (tpl.type === 'schedule') {
      await pb.collection('schedules').create({
        certification: certId,
        type: 'reunião',
        date: dueDate || new Date().toISOString(),
        notes: tpl.description || '',
        status: 'solicitado',
      })
    }
  }

  await pb.collection('certifications').update(certId, { template_applied: true })
}

export const instantiateTemplatesForUser = async (userId: string, businessModelId: string) => {
  const certs = await pb.collection('certifications').getFullList({
    filter: `user = "${userId}" && template_applied = false`,
  })
  for (const cert of certs) {
    await instantiateTemplatesForCertification(cert.id, businessModelId, userId, cert.start_date)
  }
}
