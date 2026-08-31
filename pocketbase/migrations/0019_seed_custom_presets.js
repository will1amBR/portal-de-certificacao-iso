migrate(
  (app) => {
    const customPresetsCol = app.findCollectionByNameOrId('custom_presets')
    let auditorUser = null
    try {
      auditorUser = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.consultor@alc.com.br')
    } catch (_) {
      try {
        auditorUser = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      } catch (_) {}
    }

    const defaultAuditorId = auditorUser ? auditorUser.id : null

    const presetsToSeed = [
      {
        name: 'ISO 9001:2015 SGQ - Engenharia e Construção',
        subtitle: 'Pre-set customizado para construtoras e obras civis',
        standardCode: '9001',
        badge: 'Construção Civil',
        color: 'from-blue-600 to-indigo-800',
        icon: 'ShieldCheck',
        summary:
          'Fluxos operacionais adaptados com FVS/FVM, controle de RNCs de canteiro, calibração de topografia/laboratório e auditorias internas periódicas.',
        pipes: [
          {
            code: '10.2',
            title: '10.2 Tratamento de Não-Conformidades de Canteiro',
            description:
              'Desvios de armação, concretagem e acabamentos com 5 Porquês e contenção imediata.',
            icon: 'SquarePen',
            color: 'bg-blue-600 text-white',
            order: 1,
            stages: [
              'Ação Imediata',
              'Análise de Causa (5P)',
              'Plano Corretivo',
              'Validação Engenheiro',
              'Concluído',
            ],
            suggestedDepartmentKeywords: ['engenharia', 'obras', 'qualidade'],
            sampleCards: [
              {
                title: 'RNC-OBRA-01 (Segregação de Concreto)',
                origin: 'Inspeção FVS Laje 4',
                description:
                  'Ninho de concretagem identificado no pilar P12. Tratamento com graute estrutural homologado.',
                stage: 'Ação Imediata',
                priority: 'alta',
                departmentKeyword: 'obras',
              },
            ],
          },
          {
            code: '8.5-FVS',
            title: '8.5 Fichas de Verificação de Serviço e Material (FVS / FVM)',
            description:
              'Inspeção sistemática de frentes de serviço (alvenaria, hidráulica, elétrica e pintura).',
            icon: 'FileCheck2',
            color: 'bg-indigo-600 text-white',
            order: 2,
            stages: [
              'Frente Liberada',
              'Execução Monitorada',
              'Inspeção FVS Concluída',
              'Liberação pelo Fiscal',
            ],
            suggestedDepartmentKeywords: ['obras', 'engenharia'],
            sampleCards: [
              {
                title: 'FVS-ALVENARIA-TORRE-B',
                origin: 'Fiscalização de Campo',
                description:
                  'Verificação de prumo, nível e amarração de alvenaria estrutural no 6º pavimento.',
                stage: 'Execução Monitorada',
                priority: 'média',
                departmentKeyword: 'obras',
              },
            ],
          },
          {
            code: '7.1.5',
            title: '7.1.5 Calibração de Equipamentos Topográficos e Laboratoriais',
            description:
              'Controle de calibração de estações totais, níveis a laser, prensas de rompimento e trenas.',
            icon: 'Hammer',
            color: 'bg-emerald-600 text-white',
            order: 3,
            stages: [
              'A Vencer (30d)',
              'Em Calibração RBC',
              'Laudo em Análise',
              'Liberado para Campo',
            ],
            suggestedDepartmentKeywords: ['suprimentos', 'obras'],
            sampleCards: [
              {
                title: 'CAL-TOPOGRAFIA-01',
                origin: 'Laboratório RBC',
                description:
                  'Calibração anual da estação total e nível óptico de precisão com certificado rastreável.',
                stage: 'Liberado para Campo',
                priority: 'alta',
                departmentKeyword: 'suprimentos',
              },
            ],
          },
          {
            code: '9.2',
            title: '9.2 Auditorias Internas de Qualidade da Obra',
            description:
              'Verificação periódica dos procedimentos de qualidade e registros de rastreabilidade.',
            icon: 'Compass',
            color: 'bg-sky-600 text-white',
            order: 4,
            stages: [
              'Planejamento & Escopo',
              'Checklist em Campo',
              'Relatório Técnico',
              'Ações de Follow-up Concluídas',
            ],
            suggestedDepartmentKeywords: ['qualidade', 'diretoria'],
            sampleCards: [
              {
                title: 'AUD-INT-OBRA-2026',
                origin: 'Auditor Líder ALC',
                description:
                  'Auditoria de conformidade dos processos de compras, inspeções FVS e treinamento de operários.',
                stage: 'Planejamento & Escopo',
                priority: 'alta',
                departmentKeyword: 'qualidade',
              },
            ],
          },
        ],
      },
      {
        name: 'ISO 14001:2015 SGA - Gestão de Resíduos e Obras Sustentáveis',
        subtitle: 'Pre-set direcionado para controle ambiental de obras e indústrias',
        standardCode: '14001',
        badge: 'Sustentabilidade',
        color: 'from-emerald-600 to-teal-800',
        icon: 'Leaf',
        summary:
          'Enfoque em PGRCC (Resíduos da Construção Civil), licenças de supressão/operação, medições de ruído e resposta a emergências.',
        pipes: [
          {
            code: '6.1.2-LAIA',
            title: '6.1.2 Matriz de Aspectos e Impactos Ambientais (LAIA Canteiro)',
            description:
              'Identificação de efluentes, ruídos, geração de poeira e resíduos perigosos.',
            icon: 'Compass',
            color: 'bg-emerald-600 text-white',
            order: 1,
            stages: [
              'Aspecto Mapeado',
              'Avaliação de Severidade',
              'Controle Operacional',
              'Monitoramento',
            ],
            suggestedDepartmentKeywords: ['meio ambiente', 'sesmt', 'obras'],
            sampleCards: [
              {
                title: 'LAIA-POEIRA-TERRAPLENAGEM',
                origin: 'SESMT / Meio Ambiente',
                description:
                  'Umectação constante das vias de circulação de caminhões para redução de poeira suspensa.',
                stage: 'Controle Operacional',
                priority: 'média',
                departmentKeyword: 'sesmt',
              },
            ],
          },
          {
            code: '8.1-PGRCC',
            title: '8.1 Controle de Resíduos da Construção Civil (PGRCC & MTR)',
            description:
              'Segregação de Classe A (alvenaria), B (recicláveis), C (gesso) e D (perigosos) com emissão de MTR.',
            icon: 'Layers',
            color: 'bg-emerald-700 text-white',
            order: 2,
            stages: [
              'Caçamba Acondicionada',
              'MTR Emitido',
              'Transporte Homologado',
              'CDF Anexado',
            ],
            suggestedDepartmentKeywords: ['suprimentos', 'almoxarifado', 'obras'],
            sampleCards: [
              {
                title: 'MTR-CACAMBA-CLASSE-A',
                origin: 'Almoxarifado / Pátio',
                description:
                  'Destinação de 15m³ de entulho de concreto para usina de reciclagem de agregados com CDF.',
                stage: 'CDF Anexado',
                priority: 'média',
                departmentKeyword: 'suprimentos',
              },
            ],
          },
          {
            code: '6.1.3-LIC',
            title: '6.1.3 Gestão de Licenças e Condicionantes Ambientais',
            description:
              'Acompanhamento de alvarás de supressão vegetal, outorga de poço e licença de instalação.',
            icon: 'Receipt',
            color: 'bg-teal-600 text-white',
            order: 3,
            stages: [
              'A Vencer (60d)',
              'Protocolo Órgão',
              'Condicionante Atendida',
              'Licença Vigente',
            ],
            suggestedDepartmentKeywords: ['jurídico', 'diretoria', 'meio ambiente'],
            sampleCards: [
              {
                title: 'OUTORGA-POCO-CANTEIRO',
                origin: 'Jurídico Ambiental',
                description:
                  'Relatório semestral de vazão e análise físico-química da água para o DAEE/Órgão Gestor.',
                stage: 'Licença Vigente',
                priority: 'alta',
                departmentKeyword: 'diretoria',
              },
            ],
          },
        ],
      },
    ]

    for (let i = 0; i < presetsToSeed.length; i++) {
      const p = presetsToSeed[i]
      try {
        app.findFirstRecordByData('custom_presets', 'name', p.name)
        // Already exists, skip
      } catch (_) {
        const record = new Record(customPresetsCol)
        record.set('name', p.name)
        record.set('subtitle', p.subtitle)
        record.set('standardCode', p.standardCode)
        record.set('badge', p.badge)
        record.set('color', p.color)
        record.set('icon', p.icon)
        record.set('summary', p.summary)
        record.set('pipes', p.pipes)
        record.set('pipesCount', p.pipes.length)
        if (defaultAuditorId) {
          record.set('author', defaultAuditorId)
        }
        record.set('is_public', true)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const names = [
        'ISO 9001:2015 SGQ - Engenharia e Construção',
        'ISO 14001:2015 SGA - Gestão de Resíduos e Obras Sustentáveis',
      ]
      for (let i = 0; i < names.length; i++) {
        try {
          const rec = app.findFirstRecordByData('custom_presets', 'name', names[i])
          app.delete(rec)
        } catch (_) {}
      }
    } catch (_) {}
  },
)
