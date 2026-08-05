migrate(
  (app) => {
    var bmCol = app.findCollectionByNameOrId('business_models')
    var construtoraBm
    try {
      construtoraBm = app.findFirstRecordByData('business_models', 'name', 'Construtora')
    } catch (_) {
      construtoraBm = new Record(bmCol)
      construtoraBm.set('name', 'Construtora')
      construtoraBm.set('description', 'Empresas de construcao civil, obras e infraestrutura')
      construtoraBm.set('icon', 'Building2')
      app.save(construtoraBm)
    }

    var usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    var demoUsers = [
      {
        email: 'demo.cliente@portal-iso.com',
        name: 'Construtora Horizonte',
        role: 'cliente',
        cnpj: '33444555000166',
        bm: construtoraBm.id,
      },
      {
        email: 'demo.auditor@portal-iso.com',
        name: 'Ana Costa',
        role: 'consultor',
        cnpj: '44555666000177',
        bm: construtoraBm.id,
      },
      {
        email: 'demo.admin@portal-iso.com',
        name: 'ALC Certificadora',
        role: 'admin',
        cnpj: '55666777000188',
        bm: construtoraBm.id,
      },
    ]
    var uIds = {}
    for (var i = 0; i < demoUsers.length; i++) {
      var u = demoUsers[i]
      try {
        uIds[u.email] = app.findAuthRecordByEmail('_pb_users_auth_', u.email).id
      } catch (_) {
        var r = new Record(usersCol)
        r.setEmail(u.email)
        r.setPassword('Skip@Pass')
        r.setVerified(true)
        r.set('name', u.name)
        r.set('role', u.role)
        r.set('cnpj', u.cnpj)
        r.set('business_model', u.bm)
        app.save(r)
        uIds[u.email] = r.id
      }
    }

    var clientId = uIds['demo.cliente@portal-iso.com']
    var auditorId = uIds['demo.auditor@portal-iso.com']

    var iso9001, iso14001
    try {
      iso9001 = app.findFirstRecordByData('iso_types', 'code', '9001')
    } catch (_) {}
    try {
      iso14001 = app.findFirstRecordByData('iso_types', 'code', '14001')
    } catch (_) {}

    var certsCol = app.findCollectionByNameOrId('certifications')
    var hasDemoCerts
    try {
      app.findFirstRecordByData('certifications', 'user', clientId)
      hasDemoCerts = true
    } catch (_) {
      hasDemoCerts = false
    }

    if (!hasDemoCerts) {
      var cert1 = new Record(certsCol)
      cert1.set('user', clientId)
      if (iso9001) cert1.set('iso_type', iso9001.id)
      cert1.set('status', 'em andamento')
      cert1.set('progress', 60)
      cert1.set('consultant', auditorId)
      cert1.set('company_name', 'Construtora Horizonte Ltda')
      cert1.set('start_date', '2026-02-15 00:00:00.000Z')
      cert1.set('template_applied', true)
      app.save(cert1)

      var cert2 = new Record(certsCol)
      cert2.set('user', clientId)
      if (iso14001) cert2.set('iso_type', iso14001.id)
      cert2.set('status', 'pendente de documentos')
      cert2.set('progress', 30)
      cert2.set('consultant', auditorId)
      cert2.set('company_name', 'Construtora Horizonte Ltda')
      cert2.set('start_date', '2026-04-01 00:00:00.000Z')
      cert2.set('template_applied', true)
      app.save(cert2)

      var docsCol = app.findCollectionByNameOrId('documents')
      var docs = [
        {
          c: cert1.id,
          n: 'Alvara de Funcionamento',
          req: true,
          st: 'aprovado',
          cm: 'Documento verificado e aprovado.',
          cat: 'documentação',
        },
        {
          c: cert1.id,
          n: 'ART (Anotacao de Responsabilidade Tecnica)',
          req: true,
          st: 'enviado',
          cm: 'Em analise pelo consultor.',
          cat: 'documentação',
        },
        {
          c: cert1.id,
          n: 'Manual da Qualidade (MQ-01)',
          req: true,
          st: 'aprovado',
          cm: 'Manual aprovado pelo auditor.',
          cat: 'documentação',
        },
        {
          c: cert1.id,
          n: 'Programa de Gerenciamento de Riscos',
          req: true,
          st: 'pendente',
          cm: 'Aguardando envio do documento.',
          cat: 'formulário',
        },
        {
          c: cert1.id,
          n: 'Plano de Seguranca do Trabalho',
          req: true,
          st: 'rejeitado',
          cm: 'Documento incompleto. Favor revisar secao 4.2.',
          cat: 'evidência',
        },
        {
          c: cert1.id,
          n: 'Procedimento de Auditoria Interna',
          req: false,
          st: 'pendente',
          cm: '',
          cat: 'formulário',
        },
        {
          c: cert2.id,
          n: 'Licenca Ambiental de Operacao',
          req: true,
          st: 'enviado',
          cm: 'Em analise.',
          cat: 'documentação',
        },
        {
          c: cert2.id,
          n: 'Plano de Gestao de Residuos',
          req: true,
          st: 'pendente',
          cm: 'Aguardando envio.',
          cat: 'formulário',
        },
        {
          c: cert2.id,
          n: 'Certificado de Tratamento de Efluentes',
          req: false,
          st: 'aprovado',
          cm: 'Aprovado.',
          cat: 'certificado',
        },
        {
          c: cert2.id,
          n: 'Evidencia de Monitoramento Ambiental',
          req: true,
          st: 'rejeitado',
          cm: 'Dados desatualizados. Atualizar relatorio.',
          cat: 'evidência',
        },
      ]
      for (var i = 0; i < docs.length; i++) {
        var d = docs[i]
        var r = new Record(docsCol)
        r.set('certification', d.c)
        r.set('user', clientId)
        r.set('name', d.n)
        r.set('required', d.req)
        r.set('status', d.st)
        r.set('comment', d.cm)
        r.set('category', d.cat)
        app.save(r)
      }

      var tasksCol = app.findCollectionByNameOrId('tasks')
      var tasks = [
        { c: cert1.id, t: 'Definir escopo do Sistema de Gestao da Qualidade', done: true },
        { c: cert1.id, t: 'Elaborar Politica da Qualidade', done: true },
        {
          c: cert1.id,
          t: 'Realizar primeira auditoria interna',
          done: false,
          dd: '2026-09-15 00:00:00.000Z',
        },
        {
          c: cert1.id,
          t: 'Implementar plano de gestao de residuos na obra',
          done: false,
          dd: '2026-08-30 00:00:00.000Z',
        },
        { c: cert2.id, t: 'Mapear aspectos e impactos ambientais', done: true },
        {
          c: cert2.id,
          t: 'Elaborar procedimento de resposta a emergencias',
          done: false,
          dd: '2026-10-01 00:00:00.000Z',
        },
      ]
      for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i]
        var r = new Record(tasksCol)
        r.set('certification', t.c)
        r.set('title', t.t)
        r.set('description', '')
        r.set('completed', t.done)
        if (t.dd) r.set('due_date', t.dd)
        app.save(r)
      }

      var schedCol = app.findCollectionByNameOrId('schedules')
      var scheds = [
        {
          c: cert1.id,
          tp: 'auditoria',
          dt: '2026-09-20 09:00:00.000Z',
          nt: 'Auditoria Externa Fase 1 - Verificacao de Documentacao.',
          st: 'confirmado',
        },
        {
          c: cert1.id,
          tp: 'reuniao',
          dt: '2026-08-15 14:00:00.000Z',
          nt: 'Reuniao de alinhamento com o consultor.',
          st: 'solicitado',
        },
      ]
      for (var i = 0; i < scheds.length; i++) {
        var s = scheds[i]
        var r = new Record(schedCol)
        r.set('certification', s.c)
        r.set('type', s.tp)
        r.set('date', s.dt)
        r.set('notes', s.nt)
        r.set('status', s.st)
        app.save(r)
      }

      var msgCol = app.findCollectionByNameOrId('messages')
      var msgs = [
        {
          c: cert1.id,
          s: clientId,
          ct: 'Ola Ana, enviamos o Alvara de Funcionamento e a ART. Pode verificar?',
        },
        {
          c: cert1.id,
          s: auditorId,
          ct: 'Ola! Recebi os documentos. O Alvara esta aprovado. A ART esta em analise.',
        },
        {
          c: cert1.id,
          s: clientId,
          ct: 'Perfeito, obrigado! O Plano de Seguranca do Trabalho tambem foi enviado.',
        },
        {
          c: cert1.id,
          s: auditorId,
          ct: 'Vi o Plano de Seguranca, mas esta faltando a secao 4.2. Preciso que revisem e reenviem.',
        },
      ]
      for (var i = 0; i < msgs.length; i++) {
        var m = msgs[i]
        var r = new Record(msgCol)
        r.set('certification', m.c)
        r.set('sender', m.s)
        r.set('content', m.ct)
        r.set('is_read', i < msgs.length - 1)
        app.save(r)
      }

      var notifCol = app.findCollectionByNameOrId('notifications')
      var notifs = [
        {
          tp: 'document_approved',
          ti: 'Documento Aprovado',
          ms: 'Alvara de Funcionamento foi aprovado pelo consultor.',
        },
        {
          tp: 'document_rejected',
          ti: 'Documento Rejeitado',
          ms: 'Plano de Seguranca do Trabalho foi rejeitado. Secao 4.2 incompleta.',
        },
        {
          tp: 'task_assigned',
          ti: 'Nova Tarefa Atribuida',
          ms: 'Realizar primeira auditoria interna ate 15/09.',
        },
        {
          tp: 'audit_scheduled',
          ti: 'Auditoria Agendada',
          ms: 'Auditoria Externa Fase 1 confirmada para 20/09 as 09:00.',
        },
        { tp: 'message_received', ti: 'Nova Mensagem', ms: 'Ana Costa enviou uma nova mensagem.' },
        {
          tp: 'documents_bulk_approved',
          ti: 'Documentos Aprovados em Lote',
          ms: '2 documentos foram aprovados pelo consultor.',
        },
      ]
      for (var i = 0; i < notifs.length; i++) {
        var n = notifs[i]
        var r = new Record(notifCol)
        r.set('user', clientId)
        r.set('certification', cert1.id)
        r.set('type', n.tp)
        r.set('title', n.ti)
        r.set('message', n.ms)
        r.set('is_read', i > 2)
        app.save(r)
      }
    }
  },
  (app) => {
    var emails = [
      'demo.cliente@portal-iso.com',
      'demo.auditor@portal-iso.com',
      'demo.admin@portal-iso.com',
    ]
    for (var i = 0; i < emails.length; i++) {
      try {
        app.delete(app.findAuthRecordByEmail('_pb_users_auth_', emails[i]))
      } catch (_) {}
    }
    try {
      app.delete(app.findFirstRecordByData('business_models', 'name', 'Construtora'))
    } catch (_) {}
  },
)
