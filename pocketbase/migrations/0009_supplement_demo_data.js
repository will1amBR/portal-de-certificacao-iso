migrate(
  (app) => {
    var clientId, auditorId, adminId
    try {
      clientId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.cliente@portal-iso.com').id
    } catch (_) {
      return
    }
    try {
      auditorId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.auditor@portal-iso.com').id
    } catch (_) {
      return
    }
    try {
      adminId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.admin@portal-iso.com').id
    } catch (_) {
      return
    }

    var certs
    try {
      certs = app.findRecordsByFilter(
        'certifications',
        'user = "' + clientId + '"',
        '-created',
        10,
        0,
      )
    } catch (_) {
      return
    }
    if (certs.length === 0) return

    var cert1 = certs[0]

    var notifCol = app.findCollectionByNameOrId('notifications')

    var existingAuditorNotifs = []
    try {
      existingAuditorNotifs = app.findRecordsByFilter(
        'notifications',
        'user = "' + auditorId + '"',
        '-created',
        1,
        0,
      )
    } catch (_) {}

    if (existingAuditorNotifs.length === 0) {
      var auditorNotifs = [
        {
          type: 'message_received',
          title: 'Nova Mensagem',
          message: 'Construtora Horizonte enviou uma mensagem sobre os documentos enviados.',
          is_read: false,
        },
        {
          type: 'task_assigned',
          title: 'Documento Aguardando Análise',
          message: 'ART (Anotação de Responsabilidade Técnica) aguarda sua análise.',
          is_read: false,
        },
        {
          type: 'document_rejected',
          title: 'Documento Rejeitado',
          message: 'Plano de Segurança do Trabalho rejeitado. Seção 4.2 incompleta.',
          is_read: true,
        },
        {
          type: 'audit_scheduled',
          title: 'Auditoria Confirmada',
          message: 'Auditoria Externa Fase 1 confirmada para 20/09 às 09:00.',
          is_read: true,
        },
        {
          type: 'task_completed',
          title: 'Tarefa Concluída pelo Cliente',
          message: 'Construtora Horizonte concluiu: Definir escopo do SGQ.',
          is_read: true,
        },
      ]

      for (var i = 0; i < auditorNotifs.length; i++) {
        var n = auditorNotifs[i]
        var r = new Record(notifCol)
        r.set('user', auditorId)
        r.set('certification', cert1.id)
        r.set('type', n.type)
        r.set('title', n.title)
        r.set('message', n.message)
        r.set('is_read', n.is_read)
        app.save(r)
      }
    }

    var existingAdminNotifs = []
    try {
      existingAdminNotifs = app.findRecordsByFilter(
        'notifications',
        'user = "' + adminId + '"',
        '-created',
        1,
        0,
      )
    } catch (_) {}

    if (existingAdminNotifs.length === 0) {
      var adminNotifs = [
        {
          type: 'task_assigned',
          title: 'Novo Cliente Onboarding',
          message: 'Construtora Horizonte iniciou certificação ISO 9001 e ISO 14001.',
          is_read: false,
        },
        {
          type: 'audit_scheduled',
          title: 'Auditoria Agendada',
          message: 'Auditoria Externa Fase 1 agendada para ISO 9001 - Construtora Horizonte.',
          is_read: true,
        },
        {
          type: 'documents_bulk_approved',
          title: 'Documentos Aprovados',
          message: 'Consultora Ana Costa aprovou 2 documentos da Construtora Horizonte.',
          is_read: true,
        },
      ]

      for (var j = 0; j < adminNotifs.length; j++) {
        var an = adminNotifs[j]
        var ar = new Record(notifCol)
        ar.set('user', adminId)
        ar.set('certification', cert1.id)
        ar.set('type', an.type)
        ar.set('title', an.title)
        ar.set('message', an.message)
        ar.set('is_read', an.is_read)
        app.save(ar)
      }
    }
  },
  (app) => {
    var auditorId, adminId
    try {
      auditorId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.auditor@portal-iso.com').id
      var notifs = app.findRecordsByFilter(
        'notifications',
        'user = "' + auditorId + '"',
        '-created',
        50,
        0,
      )
      for (var i = 0; i < notifs.length; i++) {
        app.delete(notifs[i])
      }
    } catch (_) {}
    try {
      adminId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.admin@portal-iso.com').id
      var adminNotifs = app.findRecordsByFilter(
        'notifications',
        'user = "' + adminId + '"',
        '-created',
        50,
        0,
      )
      for (var j = 0; j < adminNotifs.length; j++) {
        app.delete(adminNotifs[j])
      }
    } catch (_) {}
  },
)
