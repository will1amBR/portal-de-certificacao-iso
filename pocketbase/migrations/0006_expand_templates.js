migrate(
  (app) => {
    const bmCol = app.findCollectionByNameOrId('business_models')
    bmCol.deleteRule = "@request.auth.role = 'admin'"
    app.save(bmCol)

    const tplCol = app.findCollectionByNameOrId('templates')
    tplCol.deleteRule = "@request.auth.role = 'admin'"
    app.save(tplCol)

    const modelIds = {}
    const modelNames = ['Mercado', 'Construtora', 'Prestador de Serviços']
    for (const name of modelNames) {
      try {
        modelIds[name] = app.findFirstRecordByData('business_models', 'name', name).id
      } catch (_) {}
    }

    const newTemplates = [
      {
        model: 'Mercado',
        type: 'document',
        title: 'Modelo de Contrato de Renovação Anual',
        description: 'Contrato padrão para renovação anual de serviços e fornecimentos.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Mercado',
        type: 'task',
        title: 'Renovação de Alvará de Funcionamento',
        description: 'Verificar e renovar o alvará de funcionamento municipal.',
        category: 'renovação',
        due_days: 30,
      },
      {
        model: 'Mercado',
        type: 'document',
        title: 'Renovação de Contrato de Locação do Ponto Comercial',
        description: 'Documento de renovação do contrato de locação do estabelecimento.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Construtora',
        type: 'document',
        title: 'Modelo de Contrato de Renovação de Obra',
        description: 'Contrato para renovação e extensão de prazos de obra.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Construtora',
        type: 'task',
        title: 'Renovação de Licença Ambiental',
        description: 'Iniciar processo de renovação da licença ambiental de operação.',
        category: 'renovação',
        due_days: 45,
      },
      {
        model: 'Construtora',
        type: 'document',
        title: 'Renovação de Apólice de Seguro de Obra',
        description: 'Documento de renovação do seguro de responsabilidade civil da obra.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Prestador de Serviços',
        type: 'document',
        title: 'Modelo de Contrato de Renovação de Prestação de Serviços',
        description: 'Contrato padrão para renovação de contratos de prestação de serviços.',
        category: 'renovação',
        required: true,
      },
      {
        model: 'Prestador de Serviços',
        type: 'task',
        title: 'Renovação de Registro Profissional',
        description: 'Verificar e renovar registros profissionais dos técnicos responsáveis.',
        category: 'renovação',
        due_days: 60,
      },
      {
        model: 'Prestador de Serviços',
        type: 'document',
        title: 'Renovação de Certificação Técnica',
        description: 'Documento comprobatório de renovação de certificações técnicas da equipe.',
        category: 'renovação',
        required: true,
      },
    ]

    for (const t of newTemplates) {
      if (!modelIds[t.model]) continue
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
  (app) => {
    const titles = [
      'Modelo de Contrato de Renovação Anual',
      'Renovação de Alvará de Funcionamento',
      'Renovação de Contrato de Locação do Ponto Comercial',
      'Modelo de Contrato de Renovação de Obra',
      'Renovação de Licença Ambiental',
      'Renovação de Apólice de Seguro de Obra',
      'Modelo de Contrato de Renovação de Prestação de Serviços',
      'Renovação de Registro Profissional',
      'Renovação de Certificação Técnica',
    ]
    for (const title of titles) {
      try {
        const rec = app.findFirstRecordByData('templates', 'title', title)
        app.delete(rec)
      } catch (_) {}
    }
  },
)
