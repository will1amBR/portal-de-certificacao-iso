migrate(
  (app) => {
    // 1. Atualizar regras de acesso para permitir consultores e admins gerenciarem templates
    const tplCol = app.findCollectionByNameOrId('templates')
    tplCol.listRule = "@request.auth.id != ''"
    tplCol.viewRule = "@request.auth.id != ''"
    tplCol.createRule = "@request.auth.role = 'admin' || @request.auth.role = 'consultor'"
    tplCol.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'consultor'"
    tplCol.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = 'consultor'"
    app.save(tplCol)

    // Também permitir consultores e admins criarem modelos se necessário
    const bmCol = app.findCollectionByNameOrId('business_models')
    bmCol.listRule = "@request.auth.id != ''"
    bmCol.viewRule = "@request.auth.id != ''"
    bmCol.createRule = "@request.auth.role = 'admin' || @request.auth.role = 'consultor'"
    bmCol.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'consultor'"
    bmCol.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = 'consultor'"
    app.save(bmCol)

    // 2. Mapeamento dos Modelos de Negócio existentes
    const getBmId = (name) => {
      try {
        const record = app.findFirstRecordByData('business_models', 'name', name)
        return record.id
      } catch (_) {
        return null
      }
    }

    const bmMap = {
      mercado: getBmId('Mercado'),
      construtora: getBmId('Construtora'),
      servicos: getBmId('Prestador de Serviços'),
      industria: getBmId('Indústria'),
      saude: getBmId('Saúde/Hospitalar'),
      tecnologia: getBmId('Tecnologia'),
      agronegocio: getBmId('Agronegócio'),
      logistica: getBmId('Logística'),
      educacao: getBmId('Educação'),
    }

    // 3. Lista completa de novos templates essenciais cobrindo ISO 9001, 14001, 45001, 22000, 27001 e normas técnicas
    const newTemplates = [
      // === MERCADO / VAREJO ===
      {
        bm: bmMap.mercado,
        type: 'document',
        title: 'Política de Qualidade e Atendimento (ISO 9001)',
        description:
          'Manual de diretrizes de qualidade, foco no cliente e padrões de atendimento no varejo.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.mercado,
        type: 'document',
        title: 'Manual de Boas Práticas de Manipulação (ISO 22000)',
        description:
          'Manual e POPs para recebimento, estocagem, manipulação e exposição de alimentos perecíveis.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.mercado,
        type: 'document',
        title: 'Plano de Gerenciamento de Resíduos Sólidos - PGRS (ISO 14001)',
        description:
          'Procedimento para separação de recicláveis, descarte de orgânicos e logística reversa de embalagens.',
        category: 'meio ambiente',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.mercado,
        type: 'document',
        title: 'Programa de Gerenciamento de Riscos no Varejo - PGR (ISO 45001 / NR-1)',
        description:
          'Inventário de riscos ergonômicos (operadores de caixa, reposição) e mecânicos nas lojas.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.mercado,
        type: 'task',
        title: 'Auditar controle de temperatura de câmaras e gôndolas (ISO 22000)',
        description:
          'Realizar checagem diária e registro em planilha das temperaturas dos equipamentos de refrigeração.',
        category: 'indicadores',
        required: true,
        due_days: 7,
      },
      {
        bm: bmMap.mercado,
        type: 'task',
        title: 'Coletar NPS e índice de satisfação do cliente no PDV (ISO 9001)',
        description: 'Apurar avaliações de clientes e compilar indicadores mensais de atendimento.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.mercado,
        type: 'schedule',
        title: 'Auditoria Externa de Higiene e Segurança de Alimentos',
        description:
          'Auditoria técnica periódica para validação de conformidade sanitária e boas práticas.',
        category: 'qualidade',
        required: false,
        due_days: 60,
      },

      // === PRESTADOR DE SERVIÇOS ===
      {
        bm: bmMap.servicos,
        type: 'document',
        title: 'Política do Sistema Integrado de Gestão (ISO 9001 / 14001 / 45001)',
        description:
          'Declaração formal da diretoria estabelecendo o compromisso com qualidade de serviços e segurança.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.servicos,
        type: 'document',
        title: 'Procedimento de Gestão de Riscos e Oportunidades em Serviços',
        description:
          'Matriz SWOT e análise de riscos nos contratos e operações de campo com clientes.',
        category: 'qualidade',
        required: true,
        due_days: 10,
      },
      {
        bm: bmMap.servicos,
        type: 'document',
        title: 'Plano de Gestão Ambiental para Atividades em Clientes (ISO 14001)',
        description:
          'Controle de descarte de resíduos gerados na prestação de serviços externos e uso consciente de recursos.',
        category: 'meio ambiente',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.servicos,
        type: 'document',
        title: 'PGR e PCMSO para Equipes Técnicas e Operacionais (ISO 45001 / NR-1)',
        description:
          'Identificação de perigos e controle médico ocupacional para colaboradores em campo.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.servicos,
        type: 'task',
        title: 'Avaliar SLA e satisfação de clientes nos contratos (ISO 9001)',
        description:
          'Calcular o percentual de chamados e ordens de serviço atendidas dentro do prazo pactuado.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.servicos,
        type: 'task',
        title: 'Verificar matriz de competências e treinamentos de técnicos (NR-27)',
        description:
          'Checar validade de certificados, NRs obrigatórias e capacitações de toda a equipe técnica.',
        category: 'gestão de funcionários',
        required: true,
        due_days: 20,
      },
      {
        bm: bmMap.servicos,
        type: 'schedule',
        title: 'Reunião de Análise Crítica pela Direção (ISO 9001)',
        description:
          'Reunião periódica da liderança para avaliação de metas, indicadores e eficácia do SGQ.',
        category: 'qualidade',
        required: false,
        due_days: 90,
      },

      // === INDÚSTRIA ===
      {
        bm: bmMap.industria,
        type: 'document',
        title: 'Manual do Sistema de Gestão Integrado da Planta Industrial',
        description:
          'Estrutura dos processos fabris, controle de qualidade, aspectos ambientais e SST.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.industria,
        type: 'document',
        title: 'Plano de Resposta a Emergências e Brigada de Incêndio (ISO 45001 / 14001)',
        description:
          'Procedimento detalhado para evacuação, combate a princípios de incêndio e vazamentos químicos.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.industria,
        type: 'document',
        title: 'Mapeamento de Aspectos e Emissões Industriais (ISO 14001)',
        description:
          'Inventário de efluentes, emissões atmosféricas, ruído perimetral e destinação de resíduos perigosos (Classe I).',
        category: 'meio ambiente',
        required: true,
        due_days: 20,
      },
      {
        bm: bmMap.industria,
        type: 'document',
        title: 'Matriz de Calibração e Manutenção de Instrumentos de Medição',
        description:
          'Controle metrológico e certificados de calibração RBC de equipamentos de inspeção.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.industria,
        type: 'task',
        title: 'Calcular OEE e índice de refugo na linha de produção (ISO 9001)',
        description:
          'Consolidar indicadores de eficiência produtiva e percentual de peças conformes na primeira passagem.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.industria,
        type: 'task',
        title: 'Registrar consumo energético e índice de reuso de água fabril (ISO 14001)',
        description: 'Medir kwh por tonelada produzida e volume de efluentes tratados para reuso.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.industria,
        type: 'schedule',
        title: 'Auditoria de Processos e Conformidade de Produto no Chão de Fábrica',
        description:
          'Auditoria in loco das etapas de montagem, ensaios não-destrutivos e liberação de lotes.',
        category: 'qualidade',
        required: false,
        due_days: 45,
      },

      // === SAÚDE / HOSPITALAR ===
      {
        bm: bmMap.saude,
        type: 'document',
        title: 'Manual da Qualidade Hospitalar e Segurança do Paciente (ONA / ISO 9001)',
        description:
          'Políticas assistenciais, metas internacionais de segurança do paciente e gestão por processos.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.saude,
        type: 'document',
        title:
          'Plano de Gerenciamento de Resíduos de Serviços de Saúde - PGRSS (ISO 14001 / ANVISA)',
        description:
          'Classificação e protocolo de descarte para resíduos infectantes (Grupo A), químicos (B) e perfurocortantes (E).',
        category: 'meio ambiente',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.saude,
        type: 'document',
        title: 'PGR e PCMSO Hospitalar - Foco em Riscos Biológicos e Radiação (ISO 45001 / NR-32)',
        description:
          'Proteção à saúde dos profissionais de saúde, controle vacinal, acidentes com perfurocortantes e dosimetria.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.saude,
        type: 'task',
        title: 'Monitorar taxas de infecção hospitalar e eventos adversos (CCIH / SGQ)',
        description:
          'Compilar relatórios mensais de densidade de incidência de infecções e notificações Notivisa.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.saude,
        type: 'task',
        title: 'Verificar calibração e manutenção preventiva de equipamentos biomédicos',
        description:
          'Checar laudos técnicos de respiradores, monitores multiparamétricos e autoclaves.',
        category: 'qualidade',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.saude,
        type: 'schedule',
        title: 'Auditoria Clínica e de Prontuários com a Comissão de Óbito e Prontuário',
        description:
          'Auditoria periódica por amostragem de preenchimento de prontuários e termos de consentimento.',
        category: 'qualidade',
        required: false,
        due_days: 45,
      },

      // === TECNOLOGIA / TI ===
      {
        bm: bmMap.tecnologia,
        type: 'document',
        title: 'Declaração de Aplicabilidade - SoA (ISO 27001:2022)',
        description:
          'Mapeamento formal de todos os 93 controles de segurança da informação aplicáveis à organização.',
        category: 'qualidade',
        required: true,
        due_days: 10,
      },
      {
        bm: bmMap.tecnologia,
        type: 'document',
        title: 'Plano de Continuidade de Negócios e Recuperação de Desastres (BCP/DRP)',
        description:
          'Procedimentos de contingência, RTO, RPO e testes periódicos de restore de dados.',
        category: 'qualidade',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.tecnologia,
        type: 'document',
        title: 'Inventário de Ativos de Informação e Avaliação de Riscos Cibernéticos',
        description:
          'Classificação de dados sensíveis, bancos de dados, chaves de API e repositórios de código.',
        category: 'qualidade',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.tecnologia,
        type: 'document',
        title: 'PGR para Atividades de TI e Ergonomia de Home Office (ISO 45001 / NR-17)',
        description:
          'Avaliação ergonômica de postos de trabalho, saúde mental e pausas em atividades com telas.',
        category: 'saúde e segurança',
        required: false,
        due_days: 20,
      },
      {
        bm: bmMap.tecnologia,
        type: 'task',
        title: 'Executar teste de invasão (Pentest) e varredura de vulnerabilidades (ISO 27001)',
        description:
          'Auditar portas, dependências desatualizadas e pontos de injeção em APIs e infraestrutura de nuvem.',
        category: 'qualidade',
        required: true,
        due_days: 45,
      },
      {
        bm: bmMap.tecnologia,
        type: 'task',
        title: 'Medir Uptime e Tempo Médio de Resolução de Incidentes - MTTR (ISO 9001)',
        description:
          'Consolidar métricas de disponibilidade de sistemas e cumprimento de SLA de tickets.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.tecnologia,
        type: 'schedule',
        title: 'Auditoria Externa de Certificação ISO 27001 / ISO 9001',
        description:
          'Auditoria de conformidade documental e verificação técnica dos controles de segurança de TI.',
        category: 'qualidade',
        required: false,
        due_days: 90,
      },

      // === AGRONEGÓCIO ===
      {
        bm: bmMap.agronegocio,
        type: 'document',
        title:
          'Manual de Boas Práticas Agrícolas e Rastreabilidade de Safra (ISO 9001 / GlobalGAP)',
        description:
          'Controle de sementes, talhões, registro de aplicações e histórico de colheita.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.agronegocio,
        type: 'document',
        title:
          'Cadastro Ambiental Rural (CAR) e Plano de Recuperação de Áreas Degradadas (ISO 14001)',
        description:
          'Documentação fundiária ambiental, Reserva Legal, APPs e outorga de uso de água.',
        category: 'meio ambiente',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.agronegocio,
        type: 'document',
        title: 'PGRTR - Programa de Gerenciamento de Riscos no Trabalho Rural (ISO 45001 / NR-31)',
        description:
          'Controle de segurança no manuseio de defensivos agrícolas, operação de tratores e colheitadeiras.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.agronegocio,
        type: 'document',
        title: 'Receituário Agronômico e Comprovantes de Devolução de Embalagens Vazias',
        description:
          'Controle de destinação final de embalagens tríplice lavadas em postos autorizados InpEV.',
        category: 'licenças e documentos',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.agronegocio,
        type: 'task',
        title: 'Monitorar análises físico-químicas de solo e qualidade da água (ISO 14001)',
        description:
          'Registrar laudos de fertilidade e ausência de contaminação em mananciais da propriedade.',
        category: 'indicadores',
        required: true,
        due_days: 60,
      },
      {
        bm: bmMap.agronegocio,
        type: 'schedule',
        title: 'Auditoria de Safra e Conformidade de Boas Práticas no Campo',
        description: 'Inspeção in loco nos galpões de defensivos, alojamentos e áreas de cultivo.',
        category: 'qualidade',
        required: false,
        due_days: 45,
      },

      // === LOGÍSTICA ===
      {
        bm: bmMap.logistica,
        type: 'document',
        title: 'Manual de Gestão da Qualidade e Segurança no Transporte (ISO 9001 / SASSMAQ)',
        description:
          'Políticas de transporte de cargas, qualificação de motoristas e gerenciamento de riscos de viagem.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.logistica,
        type: 'document',
        title: 'Plano de Controle de Emissões de Frota e Descarte de Pneus/Óleos (ISO 14001)',
        description:
          'Controle de fumaça preta (escala Ringelmann), consumo de diesel e logística reversa de sucatas.',
        category: 'meio ambiente',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.logistica,
        type: 'document',
        title:
          'PGR para Operações de Armazenagem e Transporte Rodoviário (ISO 45001 / NR-1 / NR-11)',
        description:
          'Medidas preventivas para empilhadeiras, trabalho em altura em carretas e fadiga de motoristas.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.logistica,
        type: 'document',
        title:
          'Licenças para Transporte de Cargas Especiais e Químicos (ANTT / IBAMA / Polícia Federal)',
        description:
          'Certificados de registro nacional e licenças ambientais para produtos perigosos.',
        category: 'licenças e documentos',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.logistica,
        type: 'task',
        title: 'Calcular índice On-Time In-Full (OTIF) e avarias de carga (ISO 9001)',
        description:
          'Apurar taxa de entregas realizadas no prazo sem ocorrência de danos às mercadorias.',
        category: 'indicadores',
        required: true,
        due_days: 30,
      },
      {
        bm: bmMap.logistica,
        type: 'schedule',
        title: 'Auditoria de Centros de Distribuição e Inspeção Veicular',
        description:
          'Checagem física de tacógrafos, checklist diário de veículos e condições do armazém.',
        category: 'qualidade',
        required: false,
        due_days: 60,
      },

      // === EDUCAÇÃO ===
      {
        bm: bmMap.educacao,
        type: 'document',
        title: 'Manual do Sistema de Gestão Educacional (ISO 21001 / ISO 9001)',
        description:
          'Diretrizes pedagógicas, gestão de corpo docente, recursos didáticos e atendimento ao aluno.',
        category: 'qualidade',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.educacao,
        type: 'document',
        title: 'Plano de Gestão Ambiental e Conscientização no Campus (ISO 14001)',
        description:
          'Coleta seletiva, redução do consumo de papel e campanhas educativas de sustentabilidade.',
        category: 'meio ambiente',
        required: true,
        due_days: 0,
      },
      {
        bm: bmMap.educacao,
        type: 'document',
        title: 'PGR e Plano de Evacuação Escolar / AVCB (ISO 45001 / NR-1)',
        description:
          'Mapeamento de rotas de fuga, extintores, segurança em laboratórios de química/física e ergonomia.',
        category: 'saúde e segurança',
        required: true,
        due_days: 15,
      },
      {
        bm: bmMap.educacao,
        type: 'task',
        title: 'Apurar taxa de retenção escolar e índice de satisfação de alunos/responsáveis',
        description:
          'Consolidar avaliações institucionais de disciplinas e corpo docente ao final de cada período.',
        category: 'indicadores',
        required: true,
        due_days: 60,
      },
      {
        bm: bmMap.educacao,
        type: 'schedule',
        title: 'Auditoria Acadêmica e Conformidade Regulatória (MEC / ISO 21001)',
        description:
          'Verificação periódica de acervo de biblioteca, laboratórios e atendimento às portarias ministeriais.',
        category: 'qualidade',
        required: false,
        due_days: 90,
      },
    ]

    for (let i = 0; i < newTemplates.length; i++) {
      const item = newTemplates[i]
      if (!item.bm) continue

      try {
        app.findFirstRecordByData('templates', 'title', item.title)
      } catch (_) {
        const record = new Record(tplCol)
        record.set('business_model', item.bm)
        record.set('type', item.type)
        record.set('title', item.title)
        record.set('description', item.description)
        record.set('category', item.category)
        record.set('required', item.required)
        record.set('due_days', item.due_days)
        app.save(record)
      }
    }
  },
  (app) => {
    // Reverter regras de acesso
    try {
      const tplCol = app.findCollectionByNameOrId('templates')
      tplCol.createRule = "@request.auth.role = 'admin'"
      tplCol.updateRule = "@request.auth.role = 'admin'"
      tplCol.deleteRule = "@request.auth.role = 'admin'"
      app.save(tplCol)
    } catch (_) {}
  },
)
