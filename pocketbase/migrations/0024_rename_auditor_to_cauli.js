migrate(
  (app) => {
    // 1. Atualizar nome do usuário demo auditor para "Cauli"
    try {
      const auditor = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.auditor@alc.com.br')
      auditor.set('name', 'Cauli')
      app.save(auditor)
    } catch (_) {
      // Se não encontrar por e-mail atual, tenta encontrar por nome antigo ou email legado
      try {
        const auditorOld = app.findFirstRecordByData(
          'users',
          'email',
          'demo.auditor@portal-iso.com',
        )
        auditorOld.set('name', 'Cauli')
        app.save(auditorOld)
      } catch (_) {}
    }

    // 2. Atualizar notificações que mencionam Ana Costa
    try {
      const notifs = app.findRecordsByFilter(
        'notifications',
        "message ~ 'Ana Costa' || message ~ 'Ana'",
        '',
        100,
        0,
      )
      for (const n of notifs) {
        let msg = n.getString('message')
        msg = msg.replace(/Consultora Ana Costa/g, 'Auditor Cauli')
        msg = msg.replace(/Ana Costa/g, 'Cauli')
        n.set('message', msg)
        app.save(n)
      }
    } catch (_) {}

    // 3. Atualizar mensagens de chat que mencionam Ana
    try {
      const msgs = app.findRecordsByFilter('messages', "content ~ 'Ana'", '', 100, 0)
      for (const m of msgs) {
        let ct = m.getString('content')
        ct = ct.replace(/Ola Ana,/g, 'Ola Cauli,')
        ct = ct.replace(/Olá Ana,/g, 'Olá Cauli,')
        ct = ct.replace(/Ana Costa/g, 'Cauli')
        m.set('content', ct)
        app.save(m)
      }
    } catch (_) {}
  },
  (app) => {
    try {
      const auditor = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.auditor@alc.com.br')
      auditor.set('name', 'Ana Costa')
      app.save(auditor)
    } catch (_) {}
  },
)
