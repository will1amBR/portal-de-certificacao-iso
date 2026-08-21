migrate(
  (app) => {
    // 1. Create pipes collection
    const pipesCol = new Collection({
      name: 'pipes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'code', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' }, // lucide icon name
        { name: 'color', type: 'text' }, // color token/hex/tailwind
        { name: 'order', type: 'number' },
        { name: 'stages', type: 'json' }, // array of stage names/objects e.g. ["Ação Imediata", "Análise da Causa", "Ação Corretiva", "Analisado a Eficácia", "Concluído"]
        {
          name: 'business_model',
          type: 'relation',
          collectionId: app.findCollectionByNameOrId('business_models').id,
          maxSelect: 1,
        },
        {
          name: 'iso_type',
          type: 'relation',
          collectionId: app.findCollectionByNameOrId('iso_types').id,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_pipes_order ON pipes (order)',
        'CREATE INDEX idx_pipes_bm ON pipes (business_model)',
      ],
    })
    app.save(pipesCol)

    // 2. Create pipe_cards collection
    const cardsCol = new Collection({
      name: 'pipe_cards',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'pipe',
          type: 'relation',
          required: true,
          collectionId: pipesCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'certification',
          type: 'relation',
          collectionId: app.findCollectionByNameOrId('certifications').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'user', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'title', type: 'text', required: true }, // e.g. "1395171459" or summary
        { name: 'origin', type: 'text' }, // e.g. "Auditoria Interna", "Inspeção", "VOTORANTIM", etc.
        { name: 'description', type: 'text' },
        { name: 'stage', type: 'text', required: true },
        {
          name: 'priority',
          type: 'select',
          values: ['baixa', 'média', 'alta', 'crítica'],
          maxSelect: 1,
        },
        { name: 'due_date', type: 'date' },
        { name: 'assignee', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'data', type: 'json' }, // dynamic payload
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_pipe_cards_pipe ON pipe_cards (pipe)',
        'CREATE INDEX idx_pipe_cards_stage ON pipe_cards (stage)',
        'CREATE INDEX idx_pipe_cards_cert ON pipe_cards (certification)',
      ],
    })
    app.save(cardsCol)

    // 3. Define standard pipes as requested
    const defaultModules = [
      {
        code: '10.2',
        title: '10.2 Tratamento de Não-Conformidades',
        description:
          'Registro, contenção imediata, análise de causa raiz e ações corretivas para não-conformidades.',
        icon: 'SquarePen',
        color: 'bg-blue-600 text-white',
        order: 1,
        stages: [
          'Ação Imediata',
          'Análise da Causa',
          'Ação Corretiva',
          'Analisado a Eficácia',
          'Concluído',
        ],
        cards: [
          {
            title: '1395171459',
            origin: 'Auditoria Interna',
            description: 'Desvio identificado nos registros de inspeção diária da obra Bloco B.',
            stage: 'Ação Imediata',
            priority: 'alta',
            due_date: '2026-09-10 00:00:00.000Z',
          },
          {
            title: '1403952947',
            origin: 'Auditoria Interna',
            description:
              'Ausência de certificado de calibração para trena a laser na frente de trabalho 02.',
            stage: 'Ação Imediata',
            priority: 'média',
            due_date: '2026-09-12 00:00:00.000Z',
          },
          {
            title: '1403953903',
            origin: 'Auditoria Interna',
            description: 'Falta de evidência de descarte correto de resíduos de tinta no galpão.',
            stage: 'Ação Imediata',
            priority: 'alta',
            due_date: '2026-09-08 00:00:00.000Z',
          },
          {
            title: '1401298411',
            origin: 'Inspeção de Segurança',
            description: 'Guarda-corpo provisório no 4º pavimento fora dos padrões da NR-18.',
            stage: 'Análise da Causa',
            priority: 'crítica',
            due_date: '2026-09-05 00:00:00.000Z',
          },
          {
            title: '1399482104',
            origin: 'Auditoria de Fornecedor',
            description:
              'Entrega de lote de cimento com prazo de validade inferior ao especificado.',
            stage: 'Ação Corretiva',
            priority: 'média',
            due_date: '2026-09-15 00:00:00.000Z',
          },
          {
            title: '932221910',
            origin: 'VOTORANTIM',
            description:
              'Verificação da eficácia da substituição dos lotes de agregados com ensaios laboratoriais.',
            stage: 'Concluído',
            priority: 'baixa',
            due_date: '2026-08-20 00:00:00.000Z',
          },
          {
            title: '138274475',
            origin: 'Inspeção',
            description: 'Treinamento complementar realizado para equipe de armação.',
            stage: 'Concluído',
            priority: 'média',
            due_date: '2026-08-25 00:00:00.000Z',
          },
        ],
      },
      {
        code: '10.3',
        title: '10.3 - Sugestões de Melhoria',
        description:
          'Canal para registro e implantação de melhorias contínuas nos processos operacionais.',
        icon: 'FileText',
        color: 'bg-indigo-600 text-white',
        order: 2,
        stages: [
          'Ideia Enviada',
          'Triagem / Análise',
          'Em Implantação',
          'Homologação',
          'Concluído',
        ],
        cards: [
          {
            title: 'MELH-2026-01',
            origin: 'Equipe de Engenharia',
            description:
              'Digitalização dos checklists de armação e concretagem via tablet no canteiro.',
            stage: 'Triagem / Análise',
            priority: 'alta',
          },
          {
            title: 'MELH-2026-02',
            origin: 'Almoxarifado Central',
            description:
              'Identificação por QR Code nas prateleiras para agilizar conferência de insumos.',
            stage: 'Em Implantação',
            priority: 'média',
          },
        ],
      },
      {
        code: '5.4',
        title: '5.4 Consulta e Participação dos Trabalhadores',
        description:
          'Mecanismos de consulta, diálogo e envolvimento dos colaboradores na qualidade e SST.',
        icon: 'Handshake',
        color: 'bg-purple-600 text-white',
        order: 3,
        stages: [
          'Nova Pauta',
          'Consulta Aberta',
          'Reunião CIPA / Comitê',
          'Plano de Ação',
          'Finalizado',
        ],
        cards: [
          {
            title: 'PAUTA-054-01',
            origin: 'Comitê CIPA',
            description: 'Adequação dos bebedouros e áreas de descanso do canteiro de obras.',
            stage: 'Reunião CIPA / Comitê',
            priority: 'média',
          },
        ],
      },
      {
        code: '6.1',
        title: '6.1 - Gestão de Riscos e Oportunidades',
        description:
          'Identificação, matriz de probabilidade e impacto, planos de mitigação e contingência.',
        icon: 'Compass',
        color: 'bg-sky-600 text-white',
        order: 4,
        stages: [
          'Risco Identificado',
          'Avaliação de Impacto',
          'Plano de Mitigação',
          'Monitoramento',
          'Risco Controlado',
        ],
        cards: [
          {
            title: 'RSK-061-01',
            origin: 'Gestão de Obras',
            description: 'Risco de atraso no fornecimento de aço devido à oscilação de mercado.',
            stage: 'Plano de Mitigação',
            priority: 'crítica',
          },
          {
            title: 'RSK-061-02',
            origin: 'Segurança do Trabalho',
            description:
              'Risco de trabalho em altura nas fachadas externas durante período chuvoso.',
            stage: 'Monitoramento',
            priority: 'alta',
          },
          {
            title: 'RSK-061-03',
            origin: 'Financeiro / Suprimentos',
            description: 'Oportunidade de compra em escala conjunta para insumos estruturais.',
            stage: 'Risco Controlado',
            priority: 'média',
          },
        ],
      },
      {
        code: '6.3',
        title: '6.3 - Planejamento de Mudanças',
        description:
          'Gestão controlada de alterações nos projetos, métodos construtivos e processos.',
        icon: 'Target',
        color: 'bg-blue-700 text-white',
        order: 5,
        stages: [
          'Solicitação',
          'Análise Técnica',
          'Aprovação',
          'Execução da Mudança',
          'Eficácia Avaliada',
        ],
        cards: [
          {
            title: 'MUD-063-01',
            origin: 'Coordenação de Projetos',
            description:
              'Substituição do método de alvenaria convencional por drywall no bloco residencial.',
            stage: 'Execução da Mudança',
            priority: 'alta',
          },
        ],
      },
      {
        code: '7.1.5',
        title: '7.1.5 - Controle de Calibração',
        description:
          'Rastreabilidade e calibração periódica de instrumentos de medição e monitoramento.',
        icon: 'Hammer',
        color: 'bg-blue-600 text-white',
        order: 6,
        stages: [
          'A Vencer (30 dias)',
          'Em Calibração Laboratorial',
          'Certificado em Análise',
          'Calibrado / Liberado',
          'Reprovado / Descarte',
        ],
        cards: [
          {
            title: 'CAL-TRENA-012',
            origin: 'Topografia',
            description: 'Trena Laser Bosch GLM 50C - Calibração anual RBC.',
            stage: 'Calibrado / Liberado',
            priority: 'média',
          },
          {
            title: 'CAL-NIVEL-004',
            origin: 'Topografia',
            description: 'Nível Óptico Leica NA320 - Verificação de precisão e aferição.',
            stage: 'Em Calibração Laboratorial',
            priority: 'alta',
          },
          {
            title: 'CAL-MANOM-018',
            origin: 'Instalações Hidráulicas',
            description: 'Manômetro de teste de estanqueidade 0-25 bar.',
            stage: 'A Vencer (30 dias)',
            priority: 'média',
          },
        ],
      },
      {
        code: '7.2-SOL',
        title: '7.2 - Solicitação de Treinamentos',
        description:
          'Demandas de capacitação para colaboradores, NRs obrigatórias e normas técnicas.',
        icon: 'UserCheck',
        color: 'bg-orange-500 text-white',
        order: 7,
        stages: [
          'Solicitado',
          'Aprovação Gestor',
          'Agendamento',
          'Em Execução',
          'Certificado Emitido',
        ],
        cards: [
          {
            title: 'TREIN-NR35-2026',
            origin: 'Engenharia de Segurança',
            description: 'Reciclagem NR-35 Trabalho em Altura para 12 colaboradores da armação.',
            stage: 'Agendamento',
            priority: 'alta',
          },
          {
            title: 'TREIN-ISO-SGQ',
            origin: 'Garantia da Qualidade',
            description:
              'Treinamento de Interpretação dos Requisitos ISO 9001:2015 para mestres e encarregados.',
            stage: 'Aprovação Gestor',
            priority: 'média',
          },
        ],
      },
      {
        code: '7.2',
        title: '7.2 - Treinamentos',
        description: 'Matriz de competências, execução de treinamentos e avaliação de eficácia.',
        icon: 'User',
        color: 'bg-blue-600 text-white',
        order: 8,
        stages: [
          'Planejado',
          'Lista de Presença Coletada',
          'Avaliação de Reação',
          'Avaliação de Eficácia',
          'Concluído',
        ],
        cards: [
          {
            title: 'TURMA-NR18-08',
            origin: 'SESMT',
            description: 'Treinamento Admissional de Integração NR-18 para novas contratações.',
            stage: 'Concluído',
            priority: 'média',
          },
        ],
      },
      {
        code: '7.5',
        title: '7.5 Informação Documentada',
        description:
          'Elaboração, revisão, aprovação, distribuição e controle de versões de procedimentos.',
        icon: 'Receipt',
        color: 'bg-blue-600 text-white',
        order: 9,
        stages: [
          'Em Elaboração',
          'Revisão Técnica',
          'Aprovação da Direção',
          'Publicado / Vigente',
          'Obsoleto',
        ],
        cards: [
          {
            title: 'POP-ENG-001 Rev.04',
            origin: 'Garantia da Qualidade',
            description: 'Procedimento Operacional Padrão: Controle Tecnológico do Concreto.',
            stage: 'Publicado / Vigente',
            priority: 'alta',
          },
          {
            title: 'MQ-001 Rev.05',
            origin: 'Diretoria Técnica',
            description: 'Manual da Qualidade Integrado Construtora Horizonte.',
            stage: 'Publicado / Vigente',
            priority: 'alta',
          },
          {
            title: 'IT-SST-014 Rev.02',
            origin: 'SESMT',
            description: 'Instrução de Trabalho: Operação de Mini-Grua e Elevador Cremalheira.',
            stage: 'Revisão Técnica',
            priority: 'média',
          },
        ],
      },
      {
        code: '8.2',
        title: '8.2 - Comercial',
        description:
          'Requisitos relativos a produtos e serviços, propostas comerciais e análise crítica de contratos.',
        icon: 'MessageSquare',
        color: 'bg-blue-600 text-white',
        order: 10,
        stages: [
          'Lead / Cotação',
          'Elaboração de Proposta',
          'Análise de Viabilidade',
          'Contrato Fechado',
          'Pós-Venda',
        ],
        cards: [
          {
            title: 'PROP-2026-089',
            origin: 'Comercial Incorporação',
            description: 'Proposta para empreendimento residencial Parque dos Ipês.',
            stage: 'Análise de Viabilidade',
            priority: 'alta',
          },
        ],
      },
      {
        code: '8.5',
        title: '8.5 Operações',
        description:
          'Controle de produção, liberação de etapas construtivas e monitoramento de serviços.',
        icon: 'MapPin',
        color: 'bg-lime-600 text-white',
        order: 11,
        stages: [
          'Frente Liberada',
          'Em Execução',
          'Inspeção FVS (Serviço)',
          'Inspeção FVM (Material)',
          'Etapa Entregue',
        ],
        cards: [
          {
            title: 'FVS-FUND-014',
            origin: 'Engenharia de Obras',
            description: 'Ficha de Verificação de Serviço: Concretagem das sapatas Bloco A.',
            stage: 'Inspeção FVS (Serviço)',
            priority: 'alta',
          },
          {
            title: 'FVS-ESTR-032',
            origin: 'Fiscalização Externa',
            description: 'FVS: Armação da laje do 3º pavimento.',
            stage: 'Em Execução',
            priority: 'alta',
          },
          {
            title: 'FVM-MAT-098',
            origin: 'Controle Tecnológico',
            description: 'Ficha de Verificação de Material: Recebimento de aço CA-50 Gerdau.',
            stage: 'Etapa Entregue',
            priority: 'média',
          },
        ],
      },
      {
        code: '9.1-AN',
        title: '9.1 Análise de dados (Painel de Indicadores)',
        description:
          'Monitoramento e medição do desempenho dos processos, satisfação e auditorias.',
        icon: 'BarChart3',
        color: 'bg-amber-500 text-white',
        order: 12,
        stages: [
          'Coleta de Dados',
          'Consolidação Mensal',
          'Análise Crítica',
          'Ação de Melhoria',
          'Relatório Aprovado',
        ],
        cards: [
          {
            title: 'IND-Q3-2026',
            origin: 'Garantia da Qualidade',
            description:
              'Consolidação dos KPIs de retrabalho, perda de materiais e índice de entrega no prazo.',
            stage: 'Análise Crítica',
            priority: 'alta',
          },
          {
            title: 'PAINEL-SST-AGO',
            origin: 'SESMT',
            description: 'Painel de Taxa de Frequência e Gravidade de Acidentes - Agosto 2026.',
            stage: 'Relatório Aprovado',
            priority: 'média',
          },
        ],
      },
      {
        code: '9.1-SAT',
        title: '9.1 - Pesquisa Satisfação de Clientes',
        description:
          'Métricas de satisfação do cliente, feedbacks de entrega de chaves e assistência técnica.',
        icon: 'BarChart2',
        color: 'bg-blue-600 text-white',
        order: 13,
        stages: [
          'Envio de Questionário',
          'Respostas Recebidas',
          'Tabulação NPS',
          'Tratamento de Críticas',
          'Concluído',
        ],
        cards: [
          {
            title: 'NPS-RES-FLAMBOYANT',
            origin: 'Atendimento ao Cliente',
            description: 'Pesquisa de entrega de chaves Torre 1 - Meta NPS > 85.',
            stage: 'Tabulação NPS',
            priority: 'alta',
          },
          {
            title: 'PESQ-POS-OBRA-2026',
            origin: 'Pós-Venda',
            description: 'Pesquisa de 1 ano de garantia com clientes corporativos.',
            stage: 'Envio de Questionário',
            priority: 'média',
          },
        ],
      },
    ]

    let construtoraBmId = ''
    try {
      const construtoraBm = app.findFirstRecordByData('business_models', 'name', 'Construtora')
      construtoraBmId = construtoraBm.id
    } catch (_) {}

    let iso9001Id = ''
    try {
      const iso9001 = app.findFirstRecordByData('iso_types', 'code', '9001')
      iso9001Id = iso9001.id
    } catch (_) {}

    // Find demo certs if available
    let demoCertId = ''
    try {
      const certs = app.findRecordsByFilter('certifications', '', '-created', 1, 0)
      if (certs.length > 0) demoCertId = certs[0].id
    } catch (_) {}

    // Seed pipes
    for (let i = 0; i < defaultModules.length; i++) {
      const mod = defaultModules[i]
      const pipeRecord = new Record(pipesCol)
      pipeRecord.set('title', mod.title)
      pipeRecord.set('code', mod.code)
      pipeRecord.set('description', mod.description)
      pipeRecord.set('icon', mod.icon)
      pipeRecord.set('color', mod.color)
      pipeRecord.set('order', mod.order)
      pipeRecord.set('stages', mod.stages)
      if (construtoraBmId) pipeRecord.set('business_model', construtoraBmId)
      if (iso9001Id) pipeRecord.set('iso_type', iso9001Id)
      app.save(pipeRecord)

      // Seed cards for this pipe
      if (mod.cards && mod.cards.length > 0) {
        for (let j = 0; j < mod.cards.length; j++) {
          const c = mod.cards[j]
          const cardRecord = new Record(cardsCol)
          cardRecord.set('pipe', pipeRecord.id)
          cardRecord.set('title', c.title)
          cardRecord.set('origin', c.origin || 'Portal ISO')
          cardRecord.set('description', c.description || '')
          cardRecord.set('stage', c.stage)
          cardRecord.set('priority', c.priority || 'média')
          if (c.due_date) cardRecord.set('due_date', c.due_date)
          if (demoCertId) cardRecord.set('certification', demoCertId)
          cardRecord.set('order', j + 1)
          app.save(cardRecord)
        }
      }
    }
  },
  (app) => {
    try {
      const cardsCol = app.findCollectionByNameOrId('pipe_cards')
      app.delete(cardsCol)
    } catch (_) {}
    try {
      const pipesCol = app.findCollectionByNameOrId('pipes')
      app.delete(pipesCol)
    } catch (_) {}
  },
)
