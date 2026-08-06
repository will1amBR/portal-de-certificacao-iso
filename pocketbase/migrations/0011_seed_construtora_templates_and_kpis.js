migrate(
  (app) => {
    var tplCol = app.findCollectionByNameOrId('templates')
    var catField = tplCol.fields.getByName('category')
    if (catField) {
      tplCol.fields.remove(catField)
    }
    tplCol.fields.add(
      new SelectField({
        name: 'category',
        values: [
          'cotação',
          'controle de estoque',
          'renovação',
          'gestão de funcionários',
          'outro',
          'qualidade',
          'meio ambiente',
          'saúde e segurança',
          'indicadores',
          'licenças e documentos',
        ],
        maxSelect: 1,
      }),
    )
    app.save(tplCol)

    var construtoraBm
    try {
      construtoraBm = app.findFirstRecordByData('business_models', 'name', 'Construtora')
    } catch (_) {
      return
    }

    var templates = [
      [
        'document',
        'Política de Qualidade (ISO 9001)',
        'Documento formal que define a política da qualidade e os compromissos da construtora com a melhoria contínua.',
        'qualidade',
        true,
        0,
      ],
      [
        'document',
        'Política Ambiental (ISO 14001)',
        'Política ambiental estabelecendo compromissos com a prevenção de poluição e uso sustentável de recursos.',
        'meio ambiente',
        true,
        0,
      ],
      [
        'document',
        'Política de SST (ISO 45001)',
        'Política de saúde e segurança no trabalho promovendo ambiente seguro e livre de riscos.',
        'saúde e segurança',
        true,
        0,
      ],
      [
        'document',
        'Mapeamento de Aspectos e Impactos Ambientais',
        'Levantamento dos aspectos ambientais das atividades da obra e seus impactos no meio ambiente.',
        'meio ambiente',
        true,
        30,
      ],
      [
        'document',
        'Programa de Gerenciamento de Riscos (PGR)',
        'Documento que identifica, avalia e estabelece medidas de controle para os riscos ocupacionais da obra.',
        'saúde e segurança',
        true,
        15,
      ],
      [
        'document',
        'PPRA / PCMSO',
        'Programa de Prevenção de Riscos Ambientais e Programa de Controle Médico de Saúde Ocupacional.',
        'saúde e segurança',
        true,
        20,
      ],
      [
        'document',
        'Plano de Segurança do Trabalho',
        'Plano detalhado de segurança para a obra, incluindo procedimentos, EPIs e medidas preventivas.',
        'saúde e segurança',
        true,
        10,
      ],
      [
        'document',
        'Certificado de Treinamento de Brigada',
        'Certificados de treinamento da brigada de emergência da construtora.',
        'saúde e segurança',
        false,
        45,
      ],
      [
        'document',
        'ART (Anotação de Responsabilidade Técnica)',
        'ART emitida pelo engenheiro responsável pela obra.',
        'licenças e documentos',
        true,
        0,
      ],
      [
        'document',
        'Alvará de Funcionamento',
        'Alvará de funcionamento municipal da construtora.',
        'licenças e documentos',
        true,
        0,
      ],
      [
        'document',
        'Licença Ambiental de Operação (LO)',
        'Licença ambiental de operação emitida pelo órgão ambiental competente.',
        'licenças e documentos',
        true,
        0,
      ],
      [
        'task',
        'Registrar indicador de não conformidade (ISO 9001)',
        'Registrar o número de não conformidades abertas no período para acompanhamento do SGQ.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Coletar índice de satisfação do cliente (ISO 9001)',
        'Aplicar pesquisa de satisfação e registrar o índice obtido no período.',
        'indicadores',
        true,
        60,
      ],
      [
        'task',
        'Registrar taxa de entrega no prazo (ISO 9001)',
        'Calcular e registrar o percentual de entregas realizadas no prazo contratual.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Medir consumo de energia da obra (ISO 14001)',
        'Registrar o consumo mensal de energia elétrica da obra para monitoramento ambiental.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Registrar geração e destinação de resíduos (ISO 14001)',
        'Registrar volume de resíduos gerados e percentual destinado corretamente.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Monitorar consumo de água (ISO 14001)',
        'Registrar o consumo mensal de água da obra.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Registrar taxa de frequência de acidentes - TFA (ISO 45001)',
        'Calcular e registrar a Taxa de Frequência de Acidentes do período.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Registrar taxa de gravidade de acidentes - TG (ISO 45001)',
        'Calcular e registrar a Taxa de Gravidade de Acidentes do período.',
        'indicadores',
        true,
        30,
      ],
      [
        'task',
        'Registrar quase-acidentes (avulsos) (ISO 45001)',
        'Registrar o número de quase-acidentes reportados no período.',
        'indicadores',
        false,
        30,
      ],
      [
        'task',
        'Concluir treinamento de segurança (ISO 45001)',
        'Verificar e registrar o percentual de treinamentos de segurança concluídos pela equipe.',
        'indicadores',
        true,
        45,
      ],
      [
        'task',
        'Verificar conformidade com requisitos legais',
        'Verificar conformidade da obra com os requisitos legais aplicáveis.',
        'indicadores',
        true,
        60,
      ],
      [
        'schedule',
        'Auditoria interna de qualidade (ISO 9001)',
        'Auditoria interna do Sistema de Gestão da Qualidade.',
        'qualidade',
        false,
        60,
      ],
      [
        'schedule',
        'Auditoria interna ambiental (ISO 14001)',
        'Auditoria interna do Sistema de Gestão Ambiental.',
        'meio ambiente',
        false,
        60,
      ],
      [
        'schedule',
        'Auditoria interna de SST (ISO 45001)',
        'Auditoria interna do Sistema de Gestão de SST.',
        'saúde e segurança',
        false,
        60,
      ],
      [
        'schedule',
        'Auditoria externa de certificação (ISO 9001)',
        'Auditoria externa de certificação ISO 9001.',
        'qualidade',
        false,
        90,
      ],
      [
        'schedule',
        'Reunião de análise crítica pela direção',
        'Reunião de análise crítica do sistema de gestão pela alta direção.',
        'qualidade',
        false,
        90,
      ],
    ]

    for (var i = 0; i < templates.length; i++) {
      var t = templates[i]
      try {
        app.findFirstRecordByData('templates', 'title', t[1])
      } catch (_) {
        var r = new Record(tplCol)
        r.set('business_model', construtoraBm.id)
        r.set('type', t[0])
        r.set('title', t[1])
        r.set('description', t[2] || '')
        r.set('category', t[3])
        r.set('required', t[4] || false)
        if (t[5]) r.set('due_days', t[5])
        app.save(r)
      }
    }

    var clientId
    try {
      clientId = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.cliente@portal-iso.com').id
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
    var cert2Id = certs.length > 1 ? certs[1].id : cert1.id

    var tasksCol = app.findCollectionByNameOrId('tasks')
    var cert1Tasks = []
    var cert2Tasks = []
    try {
      cert1Tasks = app.findRecordsByFilter(
        'tasks',
        'certification = "' + cert1.id + '"',
        '-created',
        200,
        0,
      )
    } catch (_) {}
    try {
      cert2Tasks = app.findRecordsByFilter(
        'tasks',
        'certification = "' + cert2Id + '"',
        '-created',
        200,
        0,
      )
    } catch (_) {}

    function taskExists(tasks, title) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].getString('title') === title) return true
      }
      return false
    }

    var kpiTasks = [
      {
        c: cert1.id,
        t: 'Registrar indicador de não conformidade (ISO 9001)',
        d: 'Não conformidades abertas: 3',
        done: false,
        dd: '2026-09-30 00:00:00.000Z',
      },
      {
        c: cert1.id,
        t: 'Coletar índice de satisfação do cliente (ISO 9001)',
        d: 'Satisfação do cliente: 87%',
        done: true,
        dd: '2026-08-15 00:00:00.000Z',
      },
      {
        c: cert1.id,
        t: 'Registrar taxa de entrega no prazo (ISO 9001)',
        d: 'Entregas no prazo: 94%',
        done: true,
        dd: '2026-08-20 00:00:00.000Z',
      },
      {
        c: cert1.id,
        t: 'Registrar taxa de frequência de acidentes - TFA (ISO 45001)',
        d: 'TFA: 2,1',
        done: false,
        dd: '2026-09-15 00:00:00.000Z',
      },
      {
        c: cert1.id,
        t: 'Registrar taxa de gravidade de acidentes - TG (ISO 45001)',
        d: 'TG: 0,8',
        done: false,
        dd: '2026-09-15 00:00:00.000Z',
      },
      {
        c: cert1.id,
        t: 'Registrar quase-acidentes (avulsos) (ISO 45001)',
        d: 'Quase-acidentes registrados: 7',
        done: true,
        dd: '2026-08-10 00:00:00.000Z',
      },
      {
        c: cert1.id,
        t: 'Concluir treinamento de segurança (ISO 45001)',
        d: 'Treinamentos concluídos: 85% da equipe',
        done: false,
        dd: '2026-09-20 00:00:00.000Z',
      },
      {
        c: cert2Id,
        t: 'Medir consumo de energia da obra (ISO 14001)',
        d: 'Consumo de energia: 4.250 kWh/mês',
        done: true,
        dd: '2026-08-01 00:00:00.000Z',
      },
      {
        c: cert2Id,
        t: 'Registrar geração e destinação de resíduos (ISO 14001)',
        d: 'Resíduos destinados corretamente: 92%',
        done: false,
        dd: '2026-09-30 00:00:00.000Z',
      },
      {
        c: cert2Id,
        t: 'Monitorar consumo de água (ISO 14001)',
        d: 'Consumo de água: 320 m³/mês',
        done: true,
        dd: '2026-08-05 00:00:00.000Z',
      },
      {
        c: cert2Id,
        t: 'Verificar conformidade com requisitos legais',
        d: 'Conformidade legal: 95%',
        done: false,
        dd: '2026-10-15 00:00:00.000Z',
      },
    ]

    for (var j = 0; j < kpiTasks.length; j++) {
      var k = kpiTasks[j]
      var existing = k.c === cert1.id ? cert1Tasks : cert2Tasks
      if (taskExists(existing, k.t)) continue
      var tr = new Record(tasksCol)
      tr.set('certification', k.c)
      tr.set('title', k.t)
      tr.set('description', k.d)
      tr.set('completed', k.done)
      tr.set('due_date', k.dd)
      app.save(tr)
    }
  },
  (app) => {
    var tplTitles = [
      'Política de Qualidade (ISO 9001)',
      'Política Ambiental (ISO 14001)',
      'Política de SST (ISO 45001)',
      'Mapeamento de Aspectos e Impactos Ambientais',
      'Programa de Gerenciamento de Riscos (PGR)',
      'PPRA / PCMSO',
      'Plano de Segurança do Trabalho',
      'Certificado de Treinamento de Brigada',
      'ART (Anotação de Responsabilidade Técnica)',
      'Alvará de Funcionamento',
      'Licença Ambiental de Operação (LO)',
      'Registrar indicador de não conformidade (ISO 9001)',
      'Coletar índice de satisfação do cliente (ISO 9001)',
      'Registrar taxa de entrega no prazo (ISO 9001)',
      'Medir consumo de energia da obra (ISO 14001)',
      'Registrar geração e destinação de resíduos (ISO 14001)',
      'Monitorar consumo de água (ISO 14001)',
      'Registrar taxa de frequência de acidentes - TFA (ISO 45001)',
      'Registrar taxa de gravidade de acidentes - TG (ISO 45001)',
      'Registrar quase-acidentes (avulsos) (ISO 45001)',
      'Concluir treinamento de segurança (ISO 45001)',
      'Verificar conformidade com requisitos legais',
      'Auditoria interna de qualidade (ISO 9001)',
      'Auditoria interna ambiental (ISO 14001)',
      'Auditoria interna de SST (ISO 45001)',
      'Auditoria externa de certificação (ISO 9001)',
      'Reunião de análise crítica pela direção',
    ]
    for (var i = 0; i < tplTitles.length; i++) {
      try {
        app.delete(app.findFirstRecordByData('templates', 'title', tplTitles[i]))
      } catch (_) {}
    }
    var kpiTitles = [
      'Registrar indicador de não conformidade (ISO 9001)',
      'Coletar índice de satisfação do cliente (ISO 9001)',
      'Registrar taxa de entrega no prazo (ISO 9001)',
      'Registrar taxa de frequência de acidentes - TFA (ISO 45001)',
      'Registrar taxa de gravidade de acidentes - TG (ISO 45001)',
      'Registrar quase-acidentes (avulsos) (ISO 45001)',
      'Concluir treinamento de segurança (ISO 45001)',
      'Medir consumo de energia da obra (ISO 14001)',
      'Registrar geração e destinação de resíduos (ISO 14001)',
      'Monitorar consumo de água (ISO 14001)',
      'Verificar conformidade com requisitos legais',
    ]
    for (var j = 0; j < kpiTitles.length; j++) {
      try {
        var tasks = app.findRecordsByFilter(
          'tasks',
          'title = "' + kpiTitles[j] + '"',
          '-created',
          50,
          0,
        )
        for (var k = 0; k < tasks.length; k++) {
          app.delete(tasks[k])
        }
      } catch (_) {}
    }
  },
)
