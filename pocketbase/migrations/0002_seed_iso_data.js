migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let adminUser
    try {
      adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
    } catch (_) {
      adminUser = new Record(users)
      adminUser.setEmail('william@korenambiental.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'William Koren')
      app.save(adminUser)
    }

    const isoTypesCol = app.findCollectionByNameOrId('iso_types')
    const isoList = [
      {
        name: 'ISO 9001:2015',
        code: '9001',
        description:
          'Sistema de Gestão da Qualidade - Foco na satisfação do cliente e na melhoria contínua dos processos.',
        icon: 'ShieldCheck',
      },
      {
        name: 'ISO 14001:2015',
        code: '14001',
        description:
          'Sistema de Gestão Ambiental - Minimização de impactos ambientais e sustentabilidade corporativa.',
        icon: 'Leaf',
      },
      {
        name: 'ISO 45001:2018',
        code: '45001',
        description:
          'Sistema de Gestão de Saúde e Segurança Ocupacional - Prevenção de acidentes e bem-estar no trabalho.',
        icon: 'HeartPulse',
      },
    ]

    const isoTypeRecords = {}
    for (const iso of isoList) {
      try {
        const existing = app.findFirstRecordByData('iso_types', 'code', iso.code)
        isoTypeRecords[iso.code] = existing
      } catch (_) {
        const rec = new Record(isoTypesCol)
        rec.set('name', iso.name)
        rec.set('code', iso.code)
        rec.set('description', iso.description)
        rec.set('icon', iso.icon)
        app.save(rec)
        isoTypeRecords[iso.code] = rec
      }
    }

    const certsCol = app.findCollectionByNameOrId('certifications')
    let cert9001
    try {
      cert9001 = app.findFirstRecordByData('certifications', 'user', adminUser.id)
    } catch (_) {
      cert9001 = new Record(certsCol)
      cert9001.set('user', adminUser.id)
      cert9001.set('iso_type', isoTypeRecords['9001'].id)
      cert9001.set('status', 'em andamento')
      cert9001.set('progress', 45)
      cert9001.set('company_name', 'Koren Ambiental Ltda')
      cert9001.set('start_date', '2026-01-15 00:00:00.000Z')
      app.save(cert9001)

      const cert14001 = new Record(certsCol)
      cert14001.set('user', adminUser.id)
      cert14001.set('iso_type', isoTypeRecords['14001'].id)
      cert14001.set('status', 'pendente de documentos')
      cert14001.set('progress', 20)
      cert14001.set('company_name', 'Koren Ambiental Ltda')
      cert14001.set('start_date', '2026-02-01 00:00:00.000Z')
      app.save(cert14001)
    }

    if (cert9001) {
      const docsCol = app.findCollectionByNameOrId('documents')
      const sampleDocs = [
        {
          name: 'Manual da Qualidade (MQ-01)',
          required: true,
          status: 'aprovado',
          comment: 'Aprovado pelo consultor em 10/02/2026.',
        },
        {
          name: 'Política de Qualidade e Objetivos',
          required: true,
          status: 'aprovado',
          comment: 'Documentação clara e bem estruturada.',
        },
        {
          name: 'Mapeamento de Processos e Riscos',
          required: true,
          status: 'enviado',
          comment: 'Em análise pelo consultor responsável.',
        },
        {
          name: 'Procedimento de Auditoria Interna',
          required: true,
          status: 'pendente',
          comment: 'Aguardando envio do documento preenchido.',
        },
        {
          name: 'Relatório de Não Conformidades (RNC)',
          required: false,
          status: 'pendente',
          comment: 'Opcional para a fase inicial.',
        },
      ]

      for (const d of sampleDocs) {
        try {
          app.findFirstRecordByData('documents', 'name', d.name)
        } catch (_) {
          const docRec = new Record(docsCol)
          docRec.set('certification', cert9001.id)
          docRec.set('user', adminUser.id)
          docRec.set('name', d.name)
          docRec.set('required', d.required)
          docRec.set('status', d.status)
          docRec.set('comment', d.comment)
          app.save(docRec)
        }
      }

      const tasksCol = app.findCollectionByNameOrId('tasks')
      const sampleTasks = [
        { title: 'Definir escopo do Sistema de Gestão da Qualidade', completed: true },
        { title: 'Elaborar a Política da Qualidade', completed: true },
        { title: 'Identificar riscos e oportunidades dos processos', completed: true },
        {
          title: 'Treinar colaboradores nos procedimentos operacionais',
          completed: false,
          due_date: '2026-08-15 00:00:00.000Z',
        },
        {
          title: 'Realizar primeira auditoria interna',
          completed: false,
          due_date: '2026-09-01 00:00:00.000Z',
        },
        {
          title: 'Análise crítica pela Alta Direção',
          completed: false,
          due_date: '2026-09-20 00:00:00.000Z',
        },
      ]

      for (const t of sampleTasks) {
        try {
          app.findFirstRecordByData('tasks', 'title', t.title)
        } catch (_) {
          const taskRec = new Record(tasksCol)
          taskRec.set('certification', cert9001.id)
          taskRec.set('title', t.title)
          taskRec.set('completed', t.completed)
          if (t.due_date) taskRec.set('due_date', t.due_date)
          app.save(taskRec)
        }
      }

      const schedCol = app.findCollectionByNameOrId('schedules')
      try {
        app.findFirstRecordByData('schedules', 'certification', cert9001.id)
      } catch (_) {
        const sched1 = new Record(schedCol)
        sched1.set('certification', cert9001.id)
        sched1.set('type', 'reunião')
        sched1.set('date', '2026-08-10 14:00:00.000Z')
        sched1.set('notes', 'Alinhamento inicial dos documentos e status das tarefas de qualidade.')
        sched1.set('status', 'confirmado')
        app.save(sched1)

        const sched2 = new Record(schedCol)
        sched2.set('certification', cert9001.id)
        sched2.set('type', 'auditoria')
        sched2.set('date', '2026-09-15 09:00:00.000Z')
        sched2.set('notes', 'Auditoria Externa Fase 1 - Verificação de Documentação.')
        sched2.set('status', 'solicitado')
        app.save(sched2)
      }
    }
  },
  (app) => {},
)
