migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const businessModels = app.findCollectionByNameOrId('business_models')
    const isoTypes = app.findCollectionByNameOrId('iso_types')
    const certs = app.findCollectionByNameOrId('certifications')

    // Find business model for Indústria / Mercado / Construtora
    let bmIndustria = null
    let bmServicos = null
    try {
      bmIndustria = app.findFirstRecordByData('business_models', 'name', 'Indústria')
    } catch (_) {}
    try {
      bmServicos = app.findFirstRecordByData('business_models', 'name', 'Prestador de Serviços')
    } catch (_) {}

    let iso9001 = null
    let iso14001 = null
    try {
      iso9001 = app.findFirstRecordByData('iso_types', 'code', '9001')
    } catch (_) {}
    try {
      iso14001 = app.findFirstRecordByData('iso_types', 'code', '14001')
    } catch (_) {}

    // 1. Lead 1: Recém cadastrado (sem CNPJ nem modelo)
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'contato@novafibra.ind.br')
    } catch (_) {
      const u1 = new Record(users)
      u1.setEmail('contato@novafibra.ind.br')
      u1.setPassword('Skip@Pass')
      u1.setVerified(true)
      u1.set('name', 'Nova Fibra Materiais')
      u1.set('role', 'cliente')
      app.save(u1)
    }

    // 2. Lead 2: Preencheu CNPJ mas não escolheu modelo (Onboarding iniciado)
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'diretoria@logtransp.com.br')
    } catch (_) {
      const u2 = new Record(users)
      u2.setEmail('diretoria@logtransp.com.br')
      u2.setPassword('Skip@Pass')
      u2.setVerified(true)
      u2.set('name', 'LogTransp Logística Express')
      u2.set('role', 'cliente')
      u2.set('cnpj', '12345678000199')
      app.save(u2)
    }

    // 3. Lead 3: Onboarding completo (CNPJ + Modelo), mas ainda sem certificação iniciada
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'operacoes@biotecmed.com.br')
    } catch (_) {
      const u3 = new Record(users)
      u3.setEmail('operacoes@biotecmed.com.br')
      u3.setPassword('Skip@Pass')
      u3.setVerified(true)
      u3.set('name', 'BioTec Soluções Médicas')
      u3.set('role', 'cliente')
      u3.set('cnpj', '98765432000111')
      if (bmServicos) {
        u3.set('business_model', bmServicos.id)
      }
      app.save(u3)
    }

    // 4. Lead 4: Onboarding completo e já iniciou 1ª certificação
    let u4 = null
    try {
      u4 = app.findAuthRecordByEmail('_pb_users_auth_', 'contato@metalurgicaprecisao.com.br')
    } catch (_) {
      u4 = new Record(users)
      u4.setEmail('contato@metalurgicaprecisao.com.br')
      u4.setPassword('Skip@Pass')
      u4.setVerified(true)
      u4.set('name', 'Metalúrgica Precisão')
      u4.set('role', 'cliente')
      u4.set('cnpj', '45678912000133')
      if (bmIndustria) {
        u4.set('business_model', bmIndustria.id)
      }
      app.save(u4)

      // Criar certificação para Metalúrgica Precisão se iso9001 existir
      if (iso9001 && u4) {
        const c = new Record(certs)
        c.set('user', u4.id)
        c.set('iso_type', iso9001.id)
        c.set('status', 'em andamento')
        c.set('progress', 15)
        c.set('company_name', 'Metalúrgica Precisão Ltda')
        c.set('template_applied', true)
        c.set('start_date', '2026-08-01 00:00:00.000Z')
        app.save(c)
      }
    }
  },
  (app) => {
    const emails = [
      'contato@novafibra.ind.br',
      'diretoria@logtransp.com.br',
      'operacoes@biotecmed.com.br',
      'contato@metalurgicaprecisao.com.br',
    ]
    for (const email of emails) {
      try {
        const u = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(u)
      } catch (_) {}
    }
  },
)
