migrate(
  (app) => {
    const bmCol = app.findCollectionByNameOrId('business_models')
    const tplCol = app.findCollectionByNameOrId('templates')

    const models = [
      {
        name: 'Mercado',
        description: 'Estabelecimentos de varejo, supermercados e mercearias',
        icon: 'ShoppingCart',
      },
      {
        name: 'Construtora',
        description: 'Empresas de construção civil, obras e engenharia',
        icon: 'Building2',
      },
      {
        name: 'Prestador de Serviços',
        description: 'Empresas prestadoras de serviços em geral',
        icon: 'Briefcase',
      },
    ]

    const modelIds = {}
    for (const m of models) {
      try {
        modelIds[m.name] = app.findFirstRecordByData('business_models', 'name', m.name).id
      } catch (_) {
        const rec = new Record(bmCol)
        rec.set('name', m.name)
        rec.set('description', m.description)
        rec.set('icon', m.icon)
        app.save(rec)
        modelIds[m.name] = rec.id
      }
    }

    const templates = [
      {
        model: 'Mercado',
        type: 'task',
        title: 'Checklist de cotação de fornecedores',
        description: 'Levantar e comparar cotações de fornecedores recorrentes.',
        due_days: 15,
      },
      {
        model: 'Mercado',
        type: 'document',
        title: 'Controle de estoque – planilha',
        description: 'Planilha de controle de entrada e saída de produtos.',
        category: 'controle de estoque',
        required: true,
      },
      {
        model: 'Mercado',
        type: 'document',
        title: 'Documento de renovação de licenças',
        description: 'Licenças municipais e estaduais para operação.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Mercado',
        type: 'task',
        title: 'Ficha de funcionários – benefícios',
        description: 'Cadastro de benefícios dos colaboradores.',
        due_days: 30,
      },
      {
        model: 'Mercado',
        type: 'schedule',
        title: 'Agenda de auditoria interna',
        description: 'Auditoria interna programada para verificação de processos.',
        due_days: 60,
      },
      {
        model: 'Mercado',
        type: 'document',
        title: 'Cotação de fornecedores',
        description: 'Registro formal de cotações obtidas.',
        category: 'cotação',
        required: true,
      },
      {
        model: 'Construtora',
        type: 'task',
        title: 'Elaborar plano de gestão de obra',
        description: 'Definir cronograma, recursos e indicadores da obra.',
        due_days: 10,
      },
      {
        model: 'Construtora',
        type: 'document',
        title: 'Licença de construção',
        description: 'Alvará e licença de construção vigente.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Construtora',
        type: 'document',
        title: 'Controle de estoque de materiais',
        description: 'Controle de entrada e saída de materiais de construção.',
        category: 'controle de estoque',
        required: true,
      },
      {
        model: 'Construtora',
        type: 'task',
        title: 'Gestão de funcionários – EPI e treinamentos',
        description: 'Controle de EPIs entregues e treinamentos realizados.',
        due_days: 20,
      },
      {
        model: 'Construtora',
        type: 'schedule',
        title: 'Reunião de alinhamento de obra',
        description: 'Reunião inicial de alinhamento com equipe e cliente.',
        due_days: 7,
      },
      {
        model: 'Construtora',
        type: 'document',
        title: 'Cotação de materiais de construção',
        description: 'Registro de cotações de fornecedores de material.',
        category: 'cotação',
        required: false,
      },
      {
        model: 'Prestador de Serviços',
        type: 'task',
        title: 'Mapear processos de prestação de serviço',
        description: 'Documentar o fluxo de prestação de serviços da empresa.',
        due_days: 10,
      },
      {
        model: 'Prestador de Serviços',
        type: 'document',
        title: 'Contratos de prestação de serviços',
        description: 'Modelos e contratos vigentes com clientes.',
        category: 'cotação',
        required: true,
      },
      {
        model: 'Prestador de Serviços',
        type: 'document',
        title: 'Renovação de certificações técnicas',
        description: 'Certificações técnicas e profissionais da equipe.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Prestador de Serviços',
        type: 'task',
        title: 'Cadastro de funcionários e qualificações',
        description: 'Registrar qualificações e certificações dos funcionários.',
        due_days: 15,
      },
      {
        model: 'Prestador de Serviços',
        type: 'schedule',
        title: 'Auditoria de qualidade de serviços',
        description: 'Auditoria interna focada na qualidade dos serviços prestados.',
        due_days: 45,
      },
      {
        model: 'Prestador de Serviços',
        type: 'document',
        title: 'Controle de estoque de insumos',
        description: 'Controle de insumos utilizados na prestação de serviços.',
        category: 'controle de estoque',
        required: false,
      },
    ]

    for (const t of templates) {
      try {
        app.findFirstRecordByData('templates', 'title', t.title)
      } catch (_) {
        const rec = new Record(tplCol)
        rec.set('business_model', modelIds[t.model])
        rec.set('type', t.type)
        rec.set('title', t.title)
        rec.set('description', t.description || '')
        if (t.category) rec.set('category', t.category)
        if (t.required !== undefined) rec.set('required', t.required)
        if (t.due_days !== undefined) rec.set('due_days', t.due_days)
        app.save(rec)
      }
    }
  },
  (app) => {},
)
