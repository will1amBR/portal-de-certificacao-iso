migrate(
  (app) => {
    const cardsCol = app.findCollectionByNameOrId('pipe_cards')
    const pipesCol = app.findCollectionByNameOrId('pipes')

    // 1. Identify Demo Accounts and Certifications
    let demoClienteId = ''
    try {
      const clienteUser = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.cliente@alc.com.br')
      demoClienteId = clienteUser.id
    } catch (_) {}

    let demoAuditorId = ''
    try {
      const auditorUser = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.auditor@alc.com.br')
      demoAuditorId = auditorUser.id
    } catch (_) {}

    let demoAdminId = ''
    try {
      const adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'demo.admin@alc.com.br')
      demoAdminId = adminUser.id
    } catch (_) {}

    let construtoraCertId = ''
    try {
      const certs = app.findRecordsByFilter(
        'certifications',
        'company_name ~ "Construtora Horizonte"',
        '-created',
        1,
        0,
      )
      if (certs.length > 0) {
        construtoraCertId = certs[0].id
      }
    } catch (_) {}

    if (!construtoraCertId) {
      try {
        const certs = app.findRecordsByFilter('certifications', '', '-created', 1, 0)
        if (certs.length > 0) construtoraCertId = certs[0].id
      } catch (_) {}
    }

    // Assignee rotation list to give cards realistic assigned users
    const assignees = [demoClienteId, demoAuditorId, demoAdminId].filter(Boolean)

    // 2. Realistic Cards Dataset for all 13 modules
    const pipeData = {
      // 1. 10.2 Tratamento de Não-Conformidades (add more specialized cards to complement existing ones)
      10.2: [
        {
          title: 'NC-2026-088',
          origin: 'Auditoria Externa ALC',
          description:
            'Armaduras do bloco C expostas a intempéries sem proteção contra oxidação prévia.',
          stage: 'Ação Imediata',
          priority: 'alta',
          due_date: '2026-09-18 00:00:00.000Z',
        },
        {
          title: 'NC-2026-091',
          origin: 'Inspeção de Segurança',
          description:
            'Trabalhadores na periferia do 8º pavimento sem trava-quedas acoplado à linha de vida horizontal.',
          stage: 'Análise da Causa',
          priority: 'crítica',
          due_date: '2026-09-14 00:00:00.000Z',
        },
        {
          title: 'NC-2026-074',
          origin: 'Controle Tecnológico',
          description:
            'Resistência à compressão do concreto (fck 30 MPa) abaixo do especificado no lote 412 (fundação).',
          stage: 'Ação Corretiva',
          priority: 'crítica',
          due_date: '2026-09-22 00:00:00.000Z',
        },
        {
          title: 'NC-2026-065',
          origin: 'Auditoria Interna',
          description:
            'Ausência de fichas de FISPQ atualizadas dos impermeabilizantes químicos no almoxarifado.',
          stage: 'Analisado a Eficácia',
          priority: 'média',
          due_date: '2026-09-02 00:00:00.000Z',
        },
      ],

      // 2. 10.3 Sugestões de Melhoria
      10.3: [
        {
          title: 'MELH-2026-03',
          origin: 'Mestre de Obras - Setor Estrutural',
          description:
            'Adoção de formas plásticas modulares reutilizáveis para vigas e pilares, reduzindo resíduos de madeira e acelerando o ciclo.',
          stage: 'Ideia Enviada',
          priority: 'alta',
          due_date: '2026-09-30 00:00:00.000Z',
        },
        {
          title: 'MELH-2026-04',
          origin: 'Equipe de Qualidade',
          description:
            'Implementação de totens digitais no canteiro para consulta rápida de projetos executivos atualizados em formato BIM.',
          stage: 'Triagem / Análise',
          priority: 'alta',
          due_date: '2026-09-25 00:00:00.000Z',
        },
        {
          title: 'MELH-2026-05',
          origin: 'Comitê de Sustentabilidade',
          description:
            'Instalação de sistema de captação e reuso de água pluvial para lavação de caminhões betoneira e umectação de vias internas.',
          stage: 'Em Implantação',
          priority: 'média',
          due_date: '2026-10-15 00:00:00.000Z',
        },
        {
          title: 'MELH-2026-06',
          origin: 'Coordenação de Suprimentos',
          description:
            'Integração automática de pedidos de compra com homologação técnica de ensaios de fornecedores no ERP.',
          stage: 'Homologação',
          priority: 'média',
          due_date: '2026-09-10 00:00:00.000Z',
        },
        {
          title: 'MELH-2026-07',
          origin: 'SESMT',
          description:
            'Substituição de andaimes tubulares convencionais por plataformas cremalheira elétricas nas fachadas Leste e Norte.',
          stage: 'Concluído',
          priority: 'alta',
          due_date: '2026-08-15 00:00:00.000Z',
        },
      ],

      // 3. 5.4 Consulta e Participação dos Trabalhadores
      5.4: [
        {
          title: 'PAUTA-054-02',
          origin: 'Representantes dos Trabalhadores',
          description:
            'Revisão ergonômica das bancadas de corte e dobra de vergalhões de aço no canteiro central.',
          stage: 'Nova Pauta',
          priority: 'média',
          due_date: '2026-09-28 00:00:00.000Z',
        },
        {
          title: 'PAUTA-054-03',
          origin: 'Comissão de Qualidade e SST',
          description:
            'Consulta aberta aos colaboradores sobre o novo modelo de protetor auricular tipo concha com comunicação acoplada.',
          stage: 'Consulta Aberta',
          priority: 'baixa',
          due_date: '2026-09-20 00:00:00.000Z',
        },
        {
          title: 'PAUTA-054-04',
          origin: 'CIPA - Gestão 2026',
          description:
            'Reunião extraordinária para avaliação do layout de circulação de máquinas pesadas e pedestres no canteiro 02.',
          stage: 'Reunião CIPA / Comitê',
          priority: 'alta',
          due_date: '2026-09-12 00:00:00.000Z',
        },
        {
          title: 'PAUTA-054-05',
          origin: 'Comitê Operacional',
          description:
            'Plano de ação para implantação de pausas térmicas monitoradas e distribuição de isotônicos em dias de calor extremo.',
          stage: 'Plano de Ação',
          priority: 'alta',
          due_date: '2026-09-18 00:00:00.000Z',
        },
        {
          title: 'PAUTA-054-06',
          origin: 'Equipe de Acabamento',
          description:
            'Melhoria nas luminárias portáteis tipo LED antichoque para serviços noturnos em áreas confinadas e subsolos.',
          stage: 'Finalizado',
          priority: 'média',
          due_date: '2026-08-28 00:00:00.000Z',
        },
      ],

      // 4. 6.1 Gestão de Riscos e Oportunidades
      6.1: [
        {
          title: 'RSK-061-04',
          origin: 'Planejamento e Obras',
          description:
            'Risco de atraso no cronograma das fundações profundas decorrente do período de chuvas atípicas de verão.',
          stage: 'Risco Identificado',
          priority: 'alta',
          due_date: '2026-09-25 00:00:00.000Z',
        },
        {
          title: 'RSK-061-05',
          origin: 'Garantia da Qualidade / Meio Ambiente',
          description:
            'Risco de contaminação do solo e lençol freático por vazamento acidental na central de estocagem de óleo diesel do gerador.',
          stage: 'Avaliação de Impacto',
          priority: 'crítica',
          due_date: '2026-09-16 00:00:00.000Z',
        },
        {
          title: 'RSK-061-06',
          origin: 'Segurança do Trabalho',
          description:
            'Risco de queda de materiais e ferramentas sobre a via pública durante a execução do revestimento de fachada.',
          stage: 'Plano de Mitigação',
          priority: 'crítica',
          due_date: '2026-09-10 00:00:00.000Z',
        },
        {
          title: 'RSK-061-07',
          origin: 'Suprimentos / Logística',
          description:
            'Monitoramento da vulnerabilidade de fornecimento de argamassa estabilizada em caso de greve rodoviária regional.',
          stage: 'Monitoramento',
          priority: 'média',
          due_date: '2026-10-05 00:00:00.000Z',
        },
        {
          title: 'RSK-061-08',
          origin: 'Diretoria de Engenharia',
          description:
            'Oportunidade de certificação Selo Azul Caixa e EDGE Building com redução de custos em financiamentos de clientes.',
          stage: 'Risco Controlado',
          priority: 'alta',
          due_date: '2026-08-30 00:00:00.000Z',
        },
      ],

      // 5. 6.3 Planejamento de Mudanças
      6.3: [
        {
          title: 'MUD-063-02',
          origin: 'Engenharia de Estruturas',
          description:
            'Substituição do concreto convencional virado em obra por concreto auto-adensável (CAA) nas paredes de concreto.',
          stage: 'Solicitação',
          priority: 'alta',
          due_date: '2026-09-30 00:00:00.000Z',
        },
        {
          title: 'MUD-063-03',
          origin: 'Coordenação BIM / Projetos',
          description:
            'Alteração do traçado dos dutos hidrossanitários nos shafts dos banheiros tipo para evitar interferência estrutural.',
          stage: 'Análise Técnica',
          priority: 'alta',
          due_date: '2026-09-22 00:00:00.000Z',
        },
        {
          title: 'MUD-063-04',
          origin: 'Gestão de Qualidade e Meio Ambiente',
          description:
            'Troca do fornecedor de tintas acrílicas para produto à base d’água com baixo índice de VOC e selo ambiental ABNT.',
          stage: 'Aprovação',
          priority: 'média',
          due_date: '2026-09-15 00:00:00.000Z',
        },
        {
          title: 'MUD-063-05',
          origin: 'Diretoria de Operações',
          description:
            'Implantação de novo software em nuvem para medição diária de avanço físico e emissão de RDO digital.',
          stage: 'Execução da Mudança',
          priority: 'alta',
          due_date: '2026-10-10 00:00:00.000Z',
        },
        {
          title: 'MUD-063-06',
          origin: 'Coordenação de Instalações',
          description:
            'Validação da eficácia da substituição de barramentos de cobre por alumínio nos quadros gerais de baixa tensão.',
          stage: 'Eficácia Avaliada',
          priority: 'média',
          due_date: '2026-08-25 00:00:00.000Z',
        },
      ],

      // 6. 7.1.5 Controle de Calibração
      '7.1.5': [
        {
          title: 'CAL-TORQ-007',
          origin: 'Montagem de Estruturas Metálicas',
          description:
            'Torquímetro de Estalo Gedore 20-200 N.m - Calibração acreditada RBC para aperto de parafusos de alta resistência ASTM A325.',
          stage: 'A Vencer (30 dias)',
          priority: 'alta',
          due_date: '2026-09-26 00:00:00.000Z',
        },
        {
          title: 'CAL-PRENSA-002',
          origin: 'Laboratório de Controle Tecnológico',
          description:
            'Prensa Hidráulica 100t para ensaio de corpos de prova de concreto - Calibração estática de força.',
          stage: 'Em Calibração Laboratorial',
          priority: 'crítica',
          due_date: '2026-09-15 00:00:00.000Z',
        },
        {
          title: 'CAL-ESCLERO-005',
          origin: 'Inspeção de Estruturas',
          description:
            'Esclerômetro de Reflexão Schmidt Tipo N - Análise de certificado e curva de correlação emitida pelo laboratório.',
          stage: 'Certificado em Análise',
          priority: 'média',
          due_date: '2026-09-12 00:00:00.000Z',
        },
        {
          title: 'CAL-EST-TOTAL-001',
          origin: 'Topografia e Agrimensura',
          description:
            'Estação Total Leica TS06 Plus - Calibração angular e linear com laudo RBC válido por 12 meses.',
          stage: 'Calibrado / Liberado',
          priority: 'alta',
          due_date: '2026-08-10 00:00:00.000Z',
        },
        {
          title: 'CAL-PAQ-019',
          origin: 'Oficina Mecânica e Serralheria',
          description:
            'Paquímetro Digital Mitutoyo 150mm - Instrumento com desvio dimensional superior ao erro admissível. Retirado de uso.',
          stage: 'Reprovado / Descarte',
          priority: 'baixa',
          due_date: '2026-08-05 00:00:00.000Z',
        },
      ],

      // 7. 7.2 Solicitação de Treinamentos
      '7.2-SOL': [
        {
          title: 'SOL-TREIN-NR10-26',
          origin: 'Setor de Manutenção e Elétrica',
          description:
            'Solicitação de treinamento de Segurança em Instalações e Serviços em Eletricidade (NR-10 Básico - 40h) para 6 novos eletricistas.',
          stage: 'Solicitado',
          priority: 'alta',
          due_date: '2026-09-25 00:00:00.000Z',
        },
        {
          title: 'SOL-TREIN-BRIGADA-26',
          origin: 'SESMT / CIPA',
          description:
            'Formação e capacitação da Brigada de Emergência e Combate a Incêndios do Canteiro de Obras (IT-17 do Corpo de Bombeiros).',
          stage: 'Aprovação Gestor',
          priority: 'alta',
          due_date: '2026-09-18 00:00:00.000Z',
        },
        {
          title: 'SOL-TREIN-ESPACO-CONF',
          origin: 'Engenharia de Infraestrutura',
          description:
            'Treinamento NR-33 para Trabalhadores Autorizados e Vigias em Espaços Confinados (redes profundas de drenagem pluvial).',
          stage: 'Agendamento',
          priority: 'crítica',
          due_date: '2026-09-20 00:00:00.000Z',
        },
        {
          title: 'SOL-TREIN-LEAN-CONST',
          origin: 'Gerência de Engenharia',
          description:
            'Workshops práticos de Last Planner System e Lean Construction aplicados à gestão de prazos das frentes de serviço.',
          stage: 'Em Execução',
          priority: 'média',
          due_date: '2026-09-12 00:00:00.000Z',
        },
        {
          title: 'SOL-TREIN-AUD-INT-02',
          origin: 'Coordenação da Qualidade',
          description:
            'Formação de Auditores Internos Integrados ISO 9001:2015, ISO 14001:2015 e ISO 45001:2018 (Carga horária: 24h).',
          stage: 'Certificado Emitido',
          priority: 'alta',
          due_date: '2026-08-22 00:00:00.000Z',
        },
      ],

      // 8. 7.2 Treinamentos (Execução e Eficácia)
      7.2: [
        {
          title: 'TURMA-NR12-04',
          origin: 'SESMT Central',
          description:
            'Treinamento de Segurança na Operação de Máquinas e Equipamentos (Betoneiras, Serra Circular e Policorte) para 18 carpinteiros e serventes.',
          stage: 'Planejado',
          priority: 'alta',
          due_date: '2026-09-28 00:00:00.000Z',
        },
        {
          title: 'TURMA-PGRS-02',
          origin: 'Gestão Ambiental',
          description:
            'Capacitação sobre Segregação de Resíduos da Construção Civil na Fonte (Resolução CONAMA 307) para encarregados.',
          stage: 'Lista de Presença Coletada',
          priority: 'média',
          due_date: '2026-09-15 00:00:00.000Z',
        },
        {
          title: 'TURMA-PDR-DRYWALL',
          origin: 'Controle de Qualidade',
          description:
            'Treinamento prático em montagem e tratamento de juntas em sistemas drywall conforme norma NBR 15758.',
          stage: 'Avaliação de Reação',
          priority: 'média',
          due_date: '2026-09-10 00:00:00.000Z',
        },
        {
          title: 'TURMA-NR35-FACHADA',
          origin: 'SESMT Operacional',
          description:
            'Avaliação de eficácia prática de trabalho em altura nas frentes de pastilhamento externo com inspeção em campo após 30 dias.',
          stage: 'Avaliação de Eficácia',
          priority: 'crítica',
          due_date: '2026-09-08 00:00:00.000Z',
        },
        {
          title: 'TURMA-QUAL-FVS-01',
          origin: 'Garantia da Qualidade',
          description:
            'Treinamento e alinhamento no preenchimento de Fichas de Verificação de Serviços (FVS e FVM) no aplicativo móvel.',
          stage: 'Concluído',
          priority: 'alta',
          due_date: '2026-08-20 00:00:00.000Z',
        },
      ],

      // 9. 7.5 Informação Documentada
      7.5: [
        {
          title: 'POP-SST-008 Rev.01',
          origin: 'Engenharia de Segurança',
          description:
            'Procedimento Operacional Padrão: Plano de Resgate e Emergência em Altura para Operadores de Grua.',
          stage: 'Em Elaboração',
          priority: 'alta',
          due_date: '2026-09-25 00:00:00.000Z',
        },
        {
          title: 'IT-ENG-022 Rev.03',
          origin: 'Coordenação de Projetos',
          description:
            'Instrução Técnica: Execução e Controle de Estanqueidade de Impermeabilização em Piscinas e Reservatórios.',
          stage: 'Revisão Técnica',
          priority: 'alta',
          due_date: '2026-09-18 00:00:00.000Z',
        },
        {
          title: 'PG-DIR-002 Rev.04',
          origin: 'Diretoria Executiva',
          description:
            'Procedimento Geral: Política de Sustentabilidade, Segurança e Qualidade Integrada Construtora Horizonte.',
          stage: 'Aprovação da Direção',
          priority: 'alta',
          due_date: '2026-09-12 00:00:00.000Z',
        },
        {
          title: 'POP-LAB-005 Rev.02',
          origin: 'Garantia da Qualidade',
          description:
            'Procedimento de Amostragem, Moldagem e Cura de Corpos de Prova de Concreto Cilíndricos (NBR 5738).',
          stage: 'Publicado / Vigente',
          priority: 'média',
          due_date: '2026-08-15 00:00:00.000Z',
        },
        {
          title: 'MQ-001 Rev.04 (Obsoleto)',
          origin: 'Gestão da Qualidade',
          description:
            'Versão anterior do Manual da Qualidade. Substituída pela Revisão 05 em atendimento aos novos requisitos normativos.',
          stage: 'Obsoleto',
          priority: 'baixa',
          due_date: '2026-08-01 00:00:00.000Z',
        },
      ],

      // 10. 8.2 Comercial
      8.2: [
        {
          title: 'COT-COM-2026-112',
          origin: 'Portal de Vendas / Leads',
          description:
            'Solicitação de proposta e orçamento detalhado para construção de condomínio logístico horizontal (28.000 m²).',
          stage: 'Lead / Cotação',
          priority: 'alta',
          due_date: '2026-09-22 00:00:00.000Z',
        },
        {
          title: 'PROP-COM-2026-095',
          origin: 'Engenharia de Orçamentos',
          description:
            'Elaboração de proposta técnica-comercial para o Edifício Residencial Horizon Tower com memorial descritivo alinhado ao SGQ.',
          stage: 'Elaboração de Proposta',
          priority: 'alta',
          due_date: '2026-09-16 00:00:00.000Z',
        },
        {
          title: 'VIAB-COM-2026-041',
          origin: 'Diretoria Comercial / Jurídico',
          description:
            'Análise crítica contratual e verificação de atendimento aos prazos, garantias e normas de desempenho NBR 15575.',
          stage: 'Análise de Viabilidade',
          priority: 'crítica',
          due_date: '2026-09-10 00:00:00.000Z',
        },
        {
          title: 'CTR-COM-2026-028',
          origin: 'Cliente / Jurídico',
          description:
            'Contrato de empreitada global assinado para execução das torres 1 e 2 do Empreendimento Jardins de Monet.',
          stage: 'Contrato Fechado',
          priority: 'alta',
          due_date: '2026-08-28 00:00:00.000Z',
        },
        {
          title: 'POS-VENDA-RES-AURORA',
          origin: 'Relacionamento com Clientes',
          description:
            'Acompanhamento do primeiro trimestre de pós-entrega e atendimento a chamados de assistência técnica no Residencial Aurora.',
          stage: 'Pós-Venda',
          priority: 'média',
          due_date: '2026-09-05 00:00:00.000Z',
        },
      ],

      // 11. 8.5 Operações
      8.5: [
        {
          title: 'LIB-FR-ESC-003',
          origin: 'Engenharia de Campo',
          description:
            'Liberação formal da frente de serviço para escavação e contenção em solo grampeado do subsolo 2.',
          stage: 'Frente Liberada',
          priority: 'alta',
          due_date: '2026-09-20 00:00:00.000Z',
        },
        {
          title: 'FVS-ALV-054',
          origin: 'Fiscalização de Obras',
          description:
            'Acompanhamento e execução da alvenaria estrutural de vedação do 7º pavimento conforme paginação e prumo.',
          stage: 'Em Execução',
          priority: 'alta',
          due_date: '2026-09-15 00:00:00.000Z',
        },
        {
          title: 'FVS-IMPER-021',
          origin: 'Garantia da Qualidade',
          description:
            'Inspeção e ensaio de estanqueidade de 72 horas com lâmina d’água na laje de cobertura do Bloco A.',
          stage: 'Inspeção FVS (Serviço)',
          priority: 'crítica',
          due_date: '2026-09-11 00:00:00.000Z',
        },
        {
          title: 'FVM-TUB-044',
          origin: 'Controle de Materiais',
          description:
            'Inspeção no recebimento de tubos e conexões de PVC e CPVC Tigre - Verificação de certificados NBR 5648.',
          stage: 'Inspeção FVM (Material)',
          priority: 'média',
          due_date: '2026-09-14 00:00:00.000Z',
        },
        {
          title: 'ENT-ESTRUT-BLOCO-B',
          origin: 'Gerência de Obras',
          description:
            'Entrega e liberação formal da estrutura de concreto armado do Bloco B para início das instalações e alvenaria.',
          stage: 'Etapa Entregue',
          priority: 'alta',
          due_date: '2026-08-30 00:00:00.000Z',
        },
      ],

      // 12. 9.1 Análise de dados (Painel de Indicadores)
      '9.1-AN': [
        {
          title: 'KPI-RESIDUOS-AGO26',
          origin: 'Gestão Ambiental',
          description:
            'Coleta de dados brutos e tickets de caçambas para cálculo do índice de reciclagem de RCC (Meta: > 80%).',
          stage: 'Coleta de Dados',
          priority: 'média',
          due_date: '2026-09-22 00:00:00.000Z',
        },
        {
          title: 'KPI-AVANCO-FIS-Q3',
          origin: 'Planejamento e Controle',
          description:
            'Consolidação mensal da Curva S de avanço físico versus planejado dos 3 canteiros ativos.',
          stage: 'Consolidação Mensal',
          priority: 'alta',
          due_date: '2026-09-15 00:00:00.000Z',
        },
        {
          title: 'IND-RETRABALHO-2026',
          origin: 'Garantia da Qualidade',
          description:
            'Análise crítica do custo de não-qualidade e horas de retrabalho em acabamentos de gesso e pintura.',
          stage: 'Análise Crítica',
          priority: 'alta',
          due_date: '2026-09-10 00:00:00.000Z',
        },
        {
          title: 'PLANO-MELH-IND-04',
          origin: 'Comitê de Gestão da Qualidade',
          description:
            'Ação de melhoria para contenção de perdas no consumo de argamassa usinada em rebocos externos.',
          stage: 'Ação de Melhoria',
          priority: 'alta',
          due_date: '2026-09-28 00:00:00.000Z',
        },
        {
          title: 'REL-DIREX-DESEMP-Q2',
          origin: 'Diretoria Técnica e SGQ',
          description:
            'Relatório consolidado de desempenho dos processos do SGQ aprovado para apresentação na Análise Crítica da Direção.',
          stage: 'Relatório Aprovado',
          priority: 'alta',
          due_date: '2026-08-25 00:00:00.000Z',
        },
      ],

      // 13. 9.1 Pesquisa Satisfação de Clientes
      '9.1-SAT': [
        {
          title: 'PESQ-ENTREGA-TORRE2',
          origin: 'Setor de Relacionamento',
          description:
            'Disparo de questionário digital estruturado de avaliação no momento da vistoria técnica de entrega das chaves da Torre 2.',
          stage: 'Envio de Questionário',
          priority: 'alta',
          due_date: '2026-09-24 00:00:00.000Z',
        },
        {
          title: 'PESQ-POS-OCUP-06M',
          origin: 'Atendimento ao Cliente',
          description:
            'Recepção e consolidação das respostas de satisfação após 6 meses de ocupação no Empreendimento Solar das Acácias.',
          stage: 'Respostas Recebidas',
          priority: 'média',
          due_date: '2026-09-16 00:00:00.000Z',
        },
        {
          title: 'TAB-NPS-GERAL-Q3',
          origin: 'Ouvidoria / Pós-Venda',
          description:
            'Tabulação estatística do NPS (Net Promoter Score) e índice de resolutividade de chamados técnicos de garantia.',
          stage: 'Tabulação NPS',
          priority: 'alta',
          due_date: '2026-09-12 00:00:00.000Z',
        },
        {
          title: 'TRAT-FEEDBACK-ACUST',
          origin: 'Engenharia de Projetos / Pós-Venda',
          description:
            'Plano de contenção e tratamento para apontamento de clientes referente ao isolamento acústico entre unidades vizinhas.',
          stage: 'Tratamento de Críticas',
          priority: 'crítica',
          due_date: '2026-09-18 00:00:00.000Z',
        },
        {
          title: 'NPS-CORP-CLIENTES-26',
          origin: 'Diretoria Comercial',
          description:
            'Pesquisa anual de satisfação de grandes clientes corporativos finalizada com índice de aprovação de 94%.',
          stage: 'Concluído',
          priority: 'alta',
          due_date: '2026-08-18 00:00:00.000Z',
        },
      ],
    }

    // 3. Populate cards idempotently
    const allPipes = app.findRecordsByFilter('pipes', '', 'order', 50, 0)

    let totalCreated = 0

    for (let p = 0; p < allPipes.length; p++) {
      const pipeRec = allPipes[p]
      const pipeCode = pipeRec.getString('code')
      const cardsList = pipeData[pipeCode]

      if (!cardsList || cardsList.length === 0) continue

      for (let c = 0; c < cardsList.length; c++) {
        const item = cardsList[c]

        // Idempotency check: check if card with same title and pipe already exists
        let exists = false
        try {
          const existing = app.findRecordsByFilter(
            'pipe_cards',
            `pipe = "${pipeRec.id}" && title = "${item.title}"`,
            '',
            1,
            0,
          )
          if (existing.length > 0) {
            exists = true
          }
        } catch (_) {}

        if (exists) {
          continue
        }

        const newCard = new Record(cardsCol)
        newCard.set('pipe', pipeRec.id)
        newCard.set('title', item.title)
        newCard.set('origin', item.origin || 'Sistema SGQ')
        newCard.set('description', item.description || '')
        newCard.set('stage', item.stage)
        newCard.set('priority', item.priority || 'média')
        if (item.due_date) {
          newCard.set('due_date', item.due_date)
        }
        if (construtoraCertId) {
          newCard.set('certification', construtoraCertId)
        }
        if (demoClienteId) {
          newCard.set('user', demoClienteId)
        }

        // Rotate assignees among demo accounts
        if (assignees.length > 0) {
          const assignedUser = assignees[(c + p) % assignees.length]
          newCard.set('assignee', assignedUser)
        }

        newCard.set('order', c + 1)
        app.save(newCard)
        totalCreated++
      }
    }

    console.log(
      `[Migration 0014] Seeded ${totalCreated} realistic pipe cards across all ISO pipes.`,
    )
  },
  (app) => {
    // Down migration: remove the cards added by this migration if needed
    try {
      const titlesToDelete = [
        'NC-2026-088',
        'NC-2026-091',
        'NC-2026-074',
        'NC-2026-065',
        'MELH-2026-03',
        'MELH-2026-04',
        'MELH-2026-05',
        'MELH-2026-06',
        'MELH-2026-07',
        'PAUTA-054-02',
        'PAUTA-054-03',
        'PAUTA-054-04',
        'PAUTA-054-05',
        'PAUTA-054-06',
        'RSK-061-04',
        'RSK-061-05',
        'RSK-061-06',
        'RSK-061-07',
        'RSK-061-08',
        'MUD-063-02',
        'MUD-063-03',
        'MUD-063-04',
        'MUD-063-05',
        'MUD-063-06',
        'CAL-TORQ-007',
        'CAL-PRENSA-002',
        'CAL-ESCLERO-005',
        'CAL-EST-TOTAL-001',
        'CAL-PAQ-019',
        'SOL-TREIN-NR10-26',
        'SOL-TREIN-BRIGADA-26',
        'SOL-TREIN-ESPACO-CONF',
        'SOL-TREIN-LEAN-CONST',
        'SOL-TREIN-AUD-INT-02',
        'TURMA-NR12-04',
        'TURMA-PGRS-02',
        'TURMA-PDR-DRYWALL',
        'TURMA-NR35-FACHADA',
        'TURMA-QUAL-FVS-01',
        'POP-SST-008 Rev.01',
        'IT-ENG-022 Rev.03',
        'PG-DIR-002 Rev.04',
        'POP-LAB-005 Rev.02',
        'MQ-001 Rev.04 (Obsoleto)',
        'COT-COM-2026-112',
        'PROP-COM-2026-095',
        'VIAB-COM-2026-041',
        'CTR-COM-2026-028',
        'POS-VENDA-RES-AURORA',
        'LIB-FR-ESC-003',
        'FVS-ALV-054',
        'FVS-IMPER-021',
        'FVM-TUB-044',
        'ENT-ESTRUT-BLOCO-B',
        'KPI-RESIDUOS-AGO26',
        'KPI-AVANCO-FIS-Q3',
        'IND-RETRABALHO-2026',
        'PLANO-MELH-IND-04',
        'REL-DIREX-DESEMP-Q2',
        'PESQ-ENTREGA-TORRE2',
        'PESQ-POS-OCUP-06M',
        'TAB-NPS-GERAL-Q3',
        'TRAT-FEEDBACK-ACUST',
        'NPS-CORP-CLIENTES-26',
      ]

      for (let i = 0; i < titlesToDelete.length; i++) {
        try {
          const recs = app.findRecordsByFilter(
            'pipe_cards',
            `title = "${titlesToDelete[i]}"`,
            '',
            10,
            0,
          )
          for (let j = 0; j < recs.length; j++) {
            app.delete(recs[j])
          }
        } catch (_) {}
      }
    } catch (_) {}
  },
)
