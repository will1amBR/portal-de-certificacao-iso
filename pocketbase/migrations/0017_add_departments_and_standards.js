migrate(
  (app) => {
    // 1. Add departments/sectors JSON field and onboarding_answers JSON field to users collection
    const usersCol = app.findCollectionByNameOrId('users')
    if (!usersCol.fields.getByName('departments')) {
      usersCol.fields.add(
        new JSONField({
          name: 'departments',
          maxSize: 524288,
        }),
      )
    }
    if (!usersCol.fields.getByName('onboarding_completed')) {
      usersCol.fields.add(
        new BoolField({
          name: 'onboarding_completed',
        }),
      )
    }
    app.save(usersCol)

    // 2. Ensure ISO / Norm types include NR-1, NR-27, ISO 27001, etc.
    const isoTypesCol = app.findCollectionByNameOrId('iso_types')
    const normasToAdd = [
      {
        name: 'NR-1: Disposições Gerais e Gerenciamento de Riscos Ocupacionais (GRO/PGR)',
        code: 'NR1',
        description:
          'Gerenciamento de Riscos Ocupacionais (GRO), Programa de Gerenciamento de Riscos (PGR) e inventário de riscos.',
        icon: 'ShieldAlert',
      },
      {
        name: 'NR-27: Registro Profissional e Segurança Operacional',
        code: 'NR27',
        description:
          'Diretrizes de qualificação técnica, registros profissionais e conformidade de operações regulamentadas.',
        icon: 'FileCheck2',
      },
      {
        name: 'ISO 27001:2022',
        code: '27001',
        description:
          'Sistema de Gestão de Segurança da Informação, privacidade de dados e gestão de incidentes de TI.',
        icon: 'Lock',
      },
    ]

    for (let i = 0; i < normasToAdd.length; i++) {
      const item = normasToAdd[i]
      try {
        app.findFirstRecordByData('iso_types', 'code', item.code)
      } catch (_) {
        const rec = new Record(isoTypesCol)
        rec.set('name', item.name)
        rec.set('code', item.code)
        rec.set('description', item.description)
        rec.set('icon', item.icon)
        app.save(rec)
      }
    }

    // 3. Seed demo Construtora Horizonte with realistic departments and contacts
    try {
      const demoCliente = app.findFirstRecordByData('users', 'email', 'demo.cliente@alc.com.br')
      const demoSectors = [
        {
          id: 'sec-1',
          name: 'Diretoria Executiva & Operações',
          manager: 'Carlos Eduardo Mendes',
          phone: '(11) 98452-1100',
          email: 'diretoria@construtorahorizonte.com.br',
          notes: 'Aprovações finais de políticas e alocação de investimentos.',
        },
        {
          id: 'sec-2',
          name: 'Garantia da Qualidade & SGQ',
          manager: 'Mariana Duarte Souza',
          phone: '(11) 97321-4455',
          email: 'qualidade@construtorahorizonte.com.br',
          notes: 'Responsável principal pela condução das auditorias e RNCs.',
        },
        {
          id: 'sec-3',
          name: 'Segurança do Trabalho & SESMT',
          manager: 'Eng. Roberto Albuquerque',
          phone: '(11) 99182-7766',
          email: 'sesmt@construtorahorizonte.com.br',
          notes: 'Coordenação de NR-1 (GRO/PGR), EPIs, treinamentos e CIPA.',
        },
        {
          id: 'sec-4',
          name: 'Engenharia de Obras & Produção',
          manager: 'Eng. Felipe Guimarães',
          phone: '(11) 98844-3322',
          email: 'obras@construtorahorizonte.com.br',
          notes: 'Acompanhamento de FVS, FVM e execução de canteiro.',
        },
        {
          id: 'sec-5',
          name: 'Suprimentos & Almoxarifado',
          manager: 'Patrícia Rocha',
          phone: '(11) 97109-8833',
          email: 'suprimentos@construtorahorizonte.com.br',
          notes: 'Qualificação de fornecedores e controle de certificados de materiais.',
        },
        {
          id: 'sec-6',
          name: 'Recursos Humanos & DHO',
          manager: 'Juliana Castro',
          phone: '(11) 98234-9900',
          email: 'rh@construtorahorizonte.com.br',
          notes: 'Matriz de competências, integrações e controle de NR-27.',
        },
      ]
      demoCliente.set('departments', demoSectors)
      demoCliente.set('onboarding_completed', true)
      app.save(demoCliente)
    } catch (_) {}

    // 4. Seed demo BioTec Soluções Médicas with realistic departments
    try {
      const bioTec = app.findFirstRecordByData('users', 'email', 'operacoes@biotecmed.com.br')
      const bioSectors = [
        {
          id: 'sec-b1',
          name: 'Tecnologia da Informação & Cibersegurança',
          manager: 'Lucas Silveira',
          phone: '(11) 99455-8811',
          email: 'ti@biotecmed.com.br',
          notes: 'Gestão de acessos, backup e controles ISO 27001.',
        },
        {
          id: 'sec-b2',
          name: 'Controle de Qualidade Laboratorial',
          manager: 'Dra. Vanessa Prado',
          phone: '(11) 98122-3344',
          email: 'qualidade@biotecmed.com.br',
          notes: 'Rastreabilidade de laudos e calibrações de equipamentos.',
        },
        {
          id: 'sec-b3',
          name: 'Operações & Logística Fracionada',
          manager: 'Rodrigo Brandão',
          phone: '(11) 97655-2211',
          email: 'operacoes@biotecmed.com.br',
          notes: 'Controle de temperatura e expedição.',
        },
      ]
      bioTec.set('departments', bioSectors)
      bioTec.set('onboarding_completed', true)
      app.save(bioTec)
    } catch (_) {}
  },
  (app) => {
    try {
      const usersCol = app.findCollectionByNameOrId('users')
      if (usersCol.fields.getByName('departments')) {
        usersCol.fields.removeByName('departments')
      }
      if (usersCol.fields.getByName('onboarding_completed')) {
        usersCol.fields.removeByName('onboarding_completed')
      }
      app.save(usersCol)
    } catch (_) {}
  },
)
