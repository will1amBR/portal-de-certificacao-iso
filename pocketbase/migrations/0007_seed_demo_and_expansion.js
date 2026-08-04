migrate(
  (app) => {
    const isoCol = app.findCollectionByNameOrId('iso_types')
    isoCol.createRule = "@request.auth.role = 'admin'"
    isoCol.updateRule = "@request.auth.role = 'admin'"
    isoCol.deleteRule = "@request.auth.role = 'admin'"
    app.save(isoCol)

    const notifCol = app.findCollectionByNameOrId('notifications')
    notifCol.listRule = "@request.auth.id = user || @request.auth.role = 'admin'"
    notifCol.viewRule = "@request.auth.id = user || @request.auth.role = 'admin'"
    app.save(notifCol)

    var newIsos = [
      {
        name: 'ISO 22000:2018',
        code: '22000',
        description:
          'Sistema de Gestão de Segurança de Alimentos - Garantia da segurança dos alimentos em toda a cadeia produtiva.',
        icon: 'UtensilsCrossed',
      },
      {
        name: 'ISO 27001:2022',
        code: '27001',
        description:
          'Sistema de Gestão de Segurança da Informação - Proteção de dados e gestão de riscos de TI.',
        icon: 'Lock',
      },
    ]
    for (var i = 0; i < newIsos.length; i++) {
      var iso = newIsos[i]
      try {
        app.findFirstRecordByData('iso_types', 'code', iso.code)
      } catch (_) {
        var r = new Record(isoCol)
        r.set('name', iso.name)
        r.set('code', iso.code)
        r.set('description', iso.description)
        r.set('icon', iso.icon)
        app.save(r)
      }
    }

    var bmCol = app.findCollectionByNameOrId('business_models')
    var newBms = [
      {
        name: 'Indústria',
        description: 'Empresas industriais, manufatura e produção',
        icon: 'Factory',
      },
      {
        name: 'Saúde/Hospitalar',
        description: 'Hospitais, clínicas e estabelecimentos de saúde',
        icon: 'Stethoscope',
      },
      { name: 'Tecnologia', description: 'Empresas de tecnologia, software e TI', icon: 'Cpu' },
      {
        name: 'Agronegócio',
        description: 'Empresas do agronegócio, agricultura e pecuária',
        icon: 'Wheat',
      },
      {
        name: 'Logística',
        description: 'Empresas de logística, transporte e distribuição',
        icon: 'Truck',
      },
      {
        name: 'Educação',
        description: 'Instituições de ensino, escolas e universidades',
        icon: 'GraduationCap',
      },
    ]
    var bmIds = {}
    for (var i = 0; i < newBms.length; i++) {
      var m = newBms[i]
      try {
        bmIds[m.name] = app.findFirstRecordByData('business_models', 'name', m.name).id
      } catch (_) {
        var r = new Record(bmCol)
        r.set('name', m.name)
        r.set('description', m.description)
        r.set('icon', m.icon)
        app.save(r)
        bmIds[m.name] = r.id
      }
    }

    var tplCol = app.findCollectionByNameOrId('templates')
    var newTpls = [
      {
        m: 'Indústria',
        t: 'task',
        title: 'Implementar plano de manutenção preventiva',
        desc: 'Cronograma de manutenção de equipamentos industriais.',
        dd: 30,
      },
      {
        m: 'Indústria',
        t: 'document',
        title: 'Licença de operação industrial',
        desc: 'Licença ambiental de operação vigente.',
        cat: 'renovação',
        req: true,
      },
      {
        m: 'Indústria',
        t: 'document',
        title: 'Controle de estoque de matéria-prima',
        desc: 'Controle de entrada e saída de matérias-primas.',
        cat: 'controle de estoque',
        req: true,
      },
      {
        m: 'Indústria',
        t: 'schedule',
        title: 'Auditoria interna de processos industriais',
        desc: 'Verificação de conformidade dos processos.',
        dd: 60,
      },
      {
        m: 'Saúde/Hospitalar',
        t: 'task',
        title: 'Estabelecer protocolos de segurança do paciente',
        desc: 'Protocolos clínicos de segurança.',
        dd: 15,
      },
      {
        m: 'Saúde/Hospitalar',
        t: 'document',
        title: 'Licença sanitária vigente',
        desc: 'Alvará sanitário e licença de funcionamento.',
        cat: 'renovação',
        req: true,
      },
      {
        m: 'Saúde/Hospitalar',
        t: 'document',
        title: 'Controle de infecção hospitalar',
        desc: 'Programa de controle de infecção.',
        cat: 'outro',
        req: true,
      },
      {
        m: 'Saúde/Hospitalar',
        t: 'schedule',
        title: 'Reunião com equipe médica',
        desc: 'Alinhamento inicial com equipe.',
        dd: 7,
      },
      {
        m: 'Tecnologia',
        t: 'task',
        title: 'Implementar política de segurança da informação',
        desc: 'Política de segurança de TI.',
        dd: 20,
      },
      {
        m: 'Tecnologia',
        t: 'document',
        title: 'Termo de confidencialidade e LGPD',
        desc: 'Documentos de privacidade e proteção de dados.',
        cat: 'outro',
        req: true,
      },
      {
        m: 'Tecnologia',
        t: 'document',
        title: 'Controle de acesso a sistemas',
        desc: 'Matriz de acesso e privilégios.',
        cat: 'gestão de funcionários',
        req: true,
      },
      {
        m: 'Tecnologia',
        t: 'schedule',
        title: 'Auditoria de segurança de TI',
        desc: 'Auditoria interna de segurança da informação.',
        dd: 45,
      },
      {
        m: 'Agronegócio',
        t: 'task',
        title: 'Mapear processos de produção agrícola',
        desc: 'Documentar o fluxo de produção e pontos de controle.',
        dd: 15,
      },
      {
        m: 'Agronegócio',
        t: 'document',
        title: 'Licença ambiental de operação rural',
        desc: 'Licença ambiental vigente para a propriedade rural.',
        cat: 'renovação',
        req: true,
      },
      {
        m: 'Agronegócio',
        t: 'document',
        title: 'Controle de estoque de insumos agrícolas',
        desc: 'Controle de entrada e saída de insumos e defensivos.',
        cat: 'controle de estoque',
        req: true,
      },
      {
        m: 'Agronegócio',
        t: 'schedule',
        title: 'Inspeção de segurança no campo',
        desc: 'Inspeção periódica de segurança no campo.',
        dd: 30,
      },
      {
        m: 'Logística',
        t: 'task',
        title: 'Implementar plano de gestão de frota',
        desc: 'Cronograma de manutenção e inspeção de veículos.',
        dd: 20,
      },
      {
        m: 'Logística',
        t: 'document',
        title: 'Licença de transporte',
        desc: 'Licenças e autorizações de transporte vigentes.',
        cat: 'renovação',
        req: true,
      },
      {
        m: 'Logística',
        t: 'document',
        title: 'Controle de estoque de mercadorias',
        desc: 'Sistema de controle de entrada e saída de mercadorias.',
        cat: 'controle de estoque',
        req: true,
      },
      {
        m: 'Logística',
        t: 'schedule',
        title: 'Auditoria de segurança logística',
        desc: 'Auditoria interna de processos logísticos.',
        dd: 45,
      },
      {
        m: 'Educação',
        t: 'task',
        title: 'Estabelecer plano pedagógico e de avaliação',
        desc: 'Documentar o plano pedagógico e critérios de avaliação.',
        dd: 30,
      },
      {
        m: 'Educação',
        t: 'document',
        title: 'Autorização de funcionamento da instituição',
        desc: 'Documentos de autorização e credenciamento.',
        cat: 'renovação',
        req: true,
      },
      {
        m: 'Educação',
        t: 'document',
        title: 'Controle de matrículas e frequência',
        desc: 'Registros de matrículas e controle de frequência.',
        cat: 'gestão de funcionários',
        req: true,
      },
      {
        m: 'Educação',
        t: 'schedule',
        title: 'Reunião com corpo docente',
        desc: 'Reunião de alinhamento pedagógico com professores.',
        dd: 15,
      },
    ]
    for (var i = 0; i < newTpls.length; i++) {
      var tp = newTpls[i]
      if (!bmIds[tp.m]) continue
      try {
        app.findFirstRecordByData('templates', 'title', tp.title)
      } catch (_) {
        var r = new Record(tplCol)
        r.set('business_model', bmIds[tp.m])
        r.set('type', tp.t)
        r.set('title', tp.title)
        r.set('description', tp.desc || '')
        if (tp.cat) r.set('category', tp.cat)
        if (tp.req !== undefined) r.set('required', tp.req)
        if (tp.dd !== undefined) r.set('due_days', tp.dd)
        app.save(r)
      }
    }

    var usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    var demoUser
    try {
      demoUser = app.findAuthRecordByEmail('_pb_users_auth_', 'demo@portal-iso.com')
    } catch (_) {
      demoUser = new Record(usersCol)
      demoUser.setEmail('demo@portal-iso.com')
      demoUser.setPassword('Skip@Pass')
      demoUser.setVerified(true)
      demoUser.set('name', 'Usuário Demo')
      demoUser.set('role', 'cliente')
      demoUser.set('cnpj', '11222333000144')
      try {
        demoUser.set(
          'business_model',
          app.findFirstRecordByData('business_models', 'name', 'Mercado').id,
        )
      } catch (_) {}
      app.save(demoUser)
    }

    var iso9001, iso14001
    try {
      iso9001 = app.findFirstRecordByData('iso_types', 'code', '9001')
    } catch (_) {}
    try {
      iso14001 = app.findFirstRecordByData('iso_types', 'code', '14001')
    } catch (_) {}

    var certsCol = app.findCollectionByNameOrId('certifications')
    var docsCol = app.findCollectionByNameOrId('documents')
    var tasksCol = app.findCollectionByNameOrId('tasks')
    var schedCol = app.findCollectionByNameOrId('schedules')

    var demoCert
    try {
      demoCert = app.findFirstRecordByData('certifications', 'user', demoUser.id)
    } catch (_) {
      demoCert = new Record(certsCol)
      demoCert.set('user', demoUser.id)
      if (iso9001) demoCert.set('iso_type', iso9001.id)
      demoCert.set('status', 'em andamento')
      demoCert.set('progress', 60)
      demoCert.set('company_name', 'Empresa Demo Ltda')
      demoCert.set('start_date', '2026-01-20 00:00:00.000Z')
      demoCert.set('template_applied', true)
      app.save(demoCert)

      var cert2 = new Record(certsCol)
      cert2.set('user', demoUser.id)
      if (iso14001) cert2.set('iso_type', iso14001.id)
      cert2.set('status', 'pendente de documentos')
      cert2.set('progress', 25)
      cert2.set('company_name', 'Empresa Demo Ltda')
      cert2.set('start_date', '2026-03-01 00:00:00.000Z')
      cert2.set('template_applied', true)
      app.save(cert2)

      var dDocs = [
        {
          name: 'Manual da Qualidade (MQ-01)',
          required: true,
          status: 'aprovado',
          comment: 'Documento aprovado pelo consultor.',
          category: 'documentação',
        },
        {
          name: 'Política da Qualidade',
          required: true,
          status: 'enviado',
          comment: 'Em análise pelo consultor.',
          category: 'documentação',
        },
        {
          name: 'Procedimento de Auditoria Interna',
          required: true,
          status: 'pendente',
          comment: 'Aguardando envio do documento.',
          category: 'formulário',
        },
      ]
      for (var i = 0; i < dDocs.length; i++) {
        var d = dDocs[i]
        var r = new Record(docsCol)
        r.set('certification', demoCert.id)
        r.set('user', demoUser.id)
        r.set('name', d.name)
        r.set('required', d.required)
        r.set('status', d.status)
        r.set('comment', d.comment)
        r.set('category', d.category)
        app.save(r)
      }

      var dTasks = [
        { title: 'Definir escopo do Sistema de Gestão da Qualidade', completed: true },
        { title: 'Elaborar a Política da Qualidade', completed: true },
        {
          title: 'Realizar primeira auditoria interna',
          completed: false,
          due_date: '2026-09-01 00:00:00.000Z',
        },
      ]
      for (var i = 0; i < dTasks.length; i++) {
        var t = dTasks[i]
        var r = new Record(tasksCol)
        r.set('certification', demoCert.id)
        r.set('title', t.title)
        r.set('completed', t.completed)
        if (t.due_date) r.set('due_date', t.due_date)
        app.save(r)
      }

      var dScheds = [
        {
          type: 'reunião',
          date: '2026-08-15 14:00:00.000Z',
          notes: 'Reunião de alinhamento de documentos.',
          status: 'confirmado',
        },
        {
          type: 'auditoria',
          date: '2026-09-20 09:00:00.000Z',
          notes: 'Auditoria Externa Fase 1 - Verificação de Documentação.',
          status: 'solicitado',
        },
      ]
      for (var i = 0; i < dScheds.length; i++) {
        var s = dScheds[i]
        var r = new Record(schedCol)
        r.set('certification', demoCert.id)
        r.set('type', s.type)
        r.set('date', s.date)
        r.set('notes', s.notes)
        r.set('status', s.status)
        app.save(r)
      }
    }
  },
  (app) => {
    try {
      app.delete(app.findAuthRecordByEmail('_pb_users_auth_', 'demo@portal-iso.com'))
    } catch (_) {}
    var codes = ['22000', '27001']
    for (var i = 0; i < codes.length; i++) {
      try {
        app.delete(app.findFirstRecordByData('iso_types', 'code', codes[i]))
      } catch (_) {}
    }
    var names = [
      'Indústria',
      'Saúde/Hospitalar',
      'Tecnologia',
      'Agronegócio',
      'Logística',
      'Educação',
    ]
    for (var i = 0; i < names.length; i++) {
      try {
        app.delete(app.findFirstRecordByData('business_models', 'name', names[i]))
      } catch (_) {}
    }
  },
)
