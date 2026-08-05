migrate(
  (app) => {
    var emailMap = {
      'demo.cliente@portal-iso.com': 'demo.cliente@alc.com.br',
      'demo.auditor@portal-iso.com': 'demo.auditor@alc.com.br',
      'demo.admin@portal-iso.com': 'demo.admin@alc.com.br',
    }

    for (var oldEmail in emailMap) {
      var newEmail = emailMap[oldEmail]
      try {
        var record = app.findAuthRecordByEmail('_pb_users_auth_', oldEmail)
        record.setEmail(newEmail)
        app.save(record)
      } catch (_) {
        try {
          app.findAuthRecordByEmail('_pb_users_auth_', newEmail)
        } catch (__) {}
      }
    }

    var clientId, auditorId
    try {
      clientId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.cliente@alc.com.br').id
    } catch (_) {}
    try {
      auditorId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.auditor@alc.com.br').id
    } catch (_) {}

    if (clientId && auditorId) {
      var certs = []
      try {
        certs = app.findRecordsByFilter(
          'certifications',
          'user = "' + clientId + '"',
          '-created',
          10,
          0,
        )
      } catch (_) {}

      for (var i = 0; i < certs.length; i++) {
        var cert = certs[i]
        if (!cert.get('consultant') || cert.get('consultant') === '') {
          cert.set('consultant', auditorId)
          app.save(cert)
        }
      }
    }
  },
  (app) => {
    var emailMap = {
      'demo.cliente@alc.com.br': 'demo.cliente@portal-iso.com',
      'demo.auditor@alc.com.br': 'demo.auditor@portal-iso.com',
      'demo.admin@alc.com.br': 'demo.admin@portal-iso.com',
    }

    for (var newEmail in emailMap) {
      var oldEmail = emailMap[newEmail]
      try {
        var record = app.findAuthRecordByEmail('_pb_users_auth_', newEmail)
        record.setEmail(oldEmail)
        app.save(record)
      } catch (_) {}
    }
  },
)
