import pb from '@/lib/pocketbase/client'
import { CompanyDepartment } from '@/services/users'

export interface StandardPresetItem {
  code: string
  title: string
  description: string
  icon: string
  color: string
  order: number
  stages: string[]
  suggestedDepartmentKeywords?: string[]
  sampleCards?: Array<{
    title: string
    origin: string
    description: string
    stage: string
    priority: 'baixa' | 'média' | 'alta' | 'crítica'
    departmentKeyword?: string
  }>
}

export interface StandardPreset {
  id: string
  standardCode: string
  name: string
  subtitle: string
  badge: string
  color: string
  icon: string
  summary: string
  pipesCount: number
  pipes: StandardPresetItem[]
  isCustom?: boolean
  author?: string
  created?: string
  updated?: string
}

export const STANDARD_PRESETS: StandardPreset[] = [
  // 1. ISO 9001:2015 - Sistema de Gestão da Qualidade (SGQ)
  {
    id: 'preset-iso-9001',
    standardCode: '9001',
    name: 'ISO 9001:2015',
    subtitle: 'Sistema de Gestão da Qualidade (SGQ)',
    badge: 'Qualidade & Processos',
    color: 'from-blue-600 to-indigo-700',
    icon: 'ShieldCheck',
    summary:
      'Fluxos completos por cláusula: não-conformidades e RNCs, informação documentada, auditorias internas, análise crítica da direção, calibração de instrumentos, treinamentos e satisfação do cliente.',
    pipesCount: 7,
    pipes: [
      {
        code: '10.2',
        title: '10.2 Tratamento de Não-Conformidades e Ações Corretivas',
        description:
          'Registro de desvios operacionais, contenção imediata, análise de causa raiz (5 Porquês / Ishikawa), plano de ação 5W2H e verificação de eficácia.',
        icon: 'SquarePen',
        color: 'bg-blue-600 text-white',
        order: 1,
        stages: [
          'Ação Imediata',
          'Análise de Causa (5P / Ishikawa)',
          'Plano de Ação Corretiva (5W2H)',
          'Validação de Eficácia',
          'Concluído / Padronizado',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'sgq', 'garantia', 'engenharia', 'operações'],
        sampleCards: [
          {
            title: 'RNC-9001-01',
            origin: 'Auditoria de Processo',
            description:
              'Divergência nos apontamentos de inspeção de entrada de insumos e rastreabilidade de laudos.',
            stage: 'Ação Imediata',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
          {
            title: 'RNC-9001-02',
            origin: 'Reclamação de Cliente',
            description:
              'Atraso na liberação técnica da remessa #4521 e divergência dimensional de componentes.',
            stage: 'Análise de Causa (5P / Ishikawa)',
            priority: 'média',
            departmentKeyword: 'operações',
          },
        ],
      },
      {
        code: '7.5',
        title: '7.5 Controle de Informação Documentada',
        description:
          'Elaboração, revisão técnica, aprovação pela diretoria, distribuição controlada de POPs/ITs e histórico de revisões com controle de obsolescência.',
        icon: 'Receipt',
        color: 'bg-indigo-600 text-white',
        order: 2,
        stages: [
          'Em Elaboração',
          'Revisão Técnica',
          'Aprovação da Direção',
          'Publicado / Vigente',
          'Histórico / Obsoleto',
        ],
        suggestedDepartmentKeywords: ['diretoria', 'qualidade', 'documentação', 'gestão'],
        sampleCards: [
          {
            title: 'POP-QUAL-001 Rev.03',
            origin: 'Comitê da Qualidade',
            description:
              'Procedimento Geral de Controle de Registros, Revisões Normativas e Arquivos.',
            stage: 'Publicado / Vigente',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
        ],
      },
      {
        code: '9.2',
        title: '9.2 Auditorias Internas da Qualidade',
        description:
          'Planejamento do ciclo anual de auditorias internas, listas de verificação, reuniões de abertura/fechamento, relatório e follow-up.',
        icon: 'FileCheck2',
        color: 'bg-sky-600 text-white',
        order: 3,
        stages: [
          'Planejada / Escopo Definido',
          'Lista de Verificação (Checklist)',
          'Auditoria em Campo / Entrevistas',
          'Elaboração do Relatório Final',
          'Follow-up & Eficácia Concluída',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'diretoria', 'auditoria'],
        sampleCards: [
          {
            title: 'AUD-INT-Q3-SGQ',
            origin: 'Auditoria Líder',
            description:
              'Ciclo semestral de auditoria interna nos processos das cláusulas 4 a 10 da ISO 9001.',
            stage: 'Planejada / Escopo Definido',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
        ],
      },
      {
        code: '9.3',
        title: '9.3 Análise Crítica pela Direção',
        description:
          'Compilação de resultados de auditorias, feedbacks de clientes, indicadores de processos, metas da qualidade e decisões estratégicas de recursos.',
        icon: 'BarChart3',
        color: 'bg-purple-600 text-white',
        order: 4,
        stages: [
          'Coleta de Entradas & Indicadores',
          'Ata em Redação Técnica',
          'Reunião Executiva da Direção',
          'Plano de Metas & Recursos',
          'Ata Homologada / Publicada',
        ],
        suggestedDepartmentKeywords: ['diretoria', 'operações', 'executiva', 'gestão'],
        sampleCards: [
          {
            title: 'ATA-DIR-ANUAL-2026',
            origin: 'Diretoria Executiva',
            description:
              'Análise anual do desempenho do SGQ, alocação de investimentos e preparação para auditoria externa.',
            stage: 'Coleta de Entradas & Indicadores',
            priority: 'crítica',
            departmentKeyword: 'diretoria',
          },
        ],
      },
      {
        code: '7.1.5',
        title: '7.1.5 Recursos de Monitoramento e Medição (Calibração RBC)',
        description:
          'Inventário de instrumentos de medição, rastreabilidade RBC, controle de periodicidade e validação de certificados.',
        icon: 'Hammer',
        color: 'bg-emerald-600 text-white',
        order: 5,
        stages: [
          'A Vencer (30 dias)',
          'Em Calibração Laboratorial',
          'Certificado / Laudo em Avaliação',
          'Calibrado & Liberado para Uso',
          'Fora de Uso / Descartado',
        ],
        suggestedDepartmentKeywords: [
          'suprimentos',
          'almoxarifado',
          'obras',
          'manutenção',
          'operações',
        ],
        sampleCards: [
          {
            title: 'CAL-INSTR-09 (Micrômetro)',
            origin: 'Laboratório RBC Credenciado',
            description:
              'Calibração periódica do micrômetro digital e trena laser de precisão com certificado rastreável.',
            stage: 'Calibrado & Liberado para Uso',
            priority: 'média',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
      {
        code: '7.2',
        title: '7.2 Competência, Treinamento e Conscientização',
        description:
          'Levantamento de necessidades de treinamento (LNT), matriz de polivalência, execução de capacitações e avaliação de eficácia pós-90 dias.',
        icon: 'UserCheck',
        color: 'bg-amber-600 text-white',
        order: 6,
        stages: [
          'Demanda Levantada (LNT)',
          'Turma Convocada & Agendada',
          'Lista de Presença Coletada',
          'Avaliação de Eficácia (90 dias)',
          'Certificado Homologado no Prontuário',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'dho', 'gestão de pessoas'],
        sampleCards: [
          {
            title: 'TREIN-SGQ-2026-INTEG',
            origin: 'RH / DHO',
            description:
              'Treinamento de conscientização da Política da Qualidade, foco no cliente e procedimentos operacionais.',
            stage: 'Certificado Homologado no Prontuário',
            priority: 'média',
            departmentKeyword: 'recursos humanos',
          },
        ],
      },
      {
        code: '9.1.2',
        title: '9.1.2 Satisfação do Cliente e Gestão de Feedbacks (NPS/CSAT)',
        description:
          'Disparo de pesquisas de satisfação (NPS/CSAT), apuração de indicadores, tratamento de detratores e melhorias de atendimento.',
        icon: 'BarChart2',
        color: 'bg-teal-600 text-white',
        order: 7,
        stages: [
          'Pesquisa Disparada',
          'Respostas Recebidas',
          'Análise de NPS & Métricas',
          'Tratamento de Detratores / Ações',
          'Ciclo Concluído',
        ],
        suggestedDepartmentKeywords: ['comercial', 'atendimento', 'operações', 'diretoria'],
        sampleCards: [
          {
            title: 'NPS-CLIENTES-2026-Q2',
            origin: 'Comercial & Atendimento',
            description:
              'Pesquisa trimestral de satisfação aplicada aos principais clientes de obras e serviços corporativos.',
            stage: 'Análise de NPS & Métricas',
            priority: 'alta',
            departmentKeyword: 'comercial',
          },
        ],
      },
    ],
  },

  // 2. ISO 14001:2015 - Sistema de Gestão Ambiental (SGA)
  {
    id: 'preset-iso-14001',
    standardCode: '14001',
    name: 'ISO 14001:2015',
    subtitle: 'Sistema de Gestão Ambiental (SGA)',
    badge: 'Sustentabilidade & Meio Ambiente',
    color: 'from-emerald-600 to-teal-800',
    icon: 'Leaf',
    summary:
      'Pipes ambientais estruturados: Levantamento de Aspectos e Impactos (LAIA), Requisitos Legais e Licenças (LP/LI/LO), Gestão de Resíduos (MTR/PGRS), Resposta a Emergências Ambientais e Monitoramento de Emissões/Efluentes.',
    pipesCount: 5,
    pipes: [
      {
        code: '6.1.2',
        title: '6.1.2 Levantamento de Aspectos e Impactos Ambientais (LAIA)',
        description:
          'Mapeamento de aspectos ambientais, matriz de significância, classificação de severidade/probabilidade e planos de mitigação.',
        icon: 'Compass',
        color: 'bg-emerald-600 text-white',
        order: 1,
        stages: [
          'Aspecto Levantado',
          'Matriz de Significância',
          'Medida de Controle Proposta',
          'Monitoramento Operacional',
          'Aspecto Mitigado / Controlado',
        ],
        suggestedDepartmentKeywords: ['meio ambiente', 'sesmt', 'segurança', 'obras', 'operações'],
        sampleCards: [
          {
            title: 'LAIA-AMB-01 (Efluentes Oleosos)',
            origin: 'Engenharia Ambiental',
            description:
              'Avaliação da geração de efluentes oleosos na área de manutenção de máquinas e caixas separadoras de água e óleo.',
            stage: 'Medida de Controle Proposta',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '6.1.3',
        title: '6.1.3 Requisitos Legais, Licenças e Condicionantes Ambientais',
        description:
          'Controle de prazos de Licenças Ambientais (LP, LI, LO), outorgas de captação de água, IBAMA/CTF e cumprimento rigoroso de condicionantes.',
        icon: 'Receipt',
        color: 'bg-teal-600 text-white',
        order: 2,
        stages: [
          'A Vencer (90 dias)',
          'Protocolo em Órgão Ambiental',
          'Atendimento de Condicionante',
          'Licença Vigente & Homologada',
          'Renovação Concluída',
        ],
        suggestedDepartmentKeywords: ['diretoria', 'jurídico', 'meio ambiente', 'obras'],
        sampleCards: [
          {
            title: 'LIC-LO-ESTADUAL-2026',
            origin: 'Jurídico & Meio Ambiente',
            description:
              'Renovação da Licença de Operação (LO) junto à agência ambiental estadual e envio de relatório de condicionantes.',
            stage: 'Licença Vigente & Homologada',
            priority: 'crítica',
            departmentKeyword: 'diretoria',
          },
        ],
      },
      {
        code: '8.1-RES',
        title: '8.1 Gestão de Resíduos Sólidos (MTR, PGRS & CDF)',
        description:
          'Classificação de resíduos (Classe I Perigosos / Classe II), emissão do Manifesto de Transporte de Resíduos (MTR) e obtenção do Certificado de Destinação Final (CDF).',
        icon: 'Layers',
        color: 'bg-emerald-700 text-white',
        order: 3,
        stages: [
          'Geração / Acondicionamento Seguro',
          'MTR Emitido no SINIR/Estadual',
          'Transportador Homologado',
          'Destinação / Co-processamento',
          'CDF Anexado & Arquivado',
        ],
        suggestedDepartmentKeywords: ['almoxarifado', 'suprimentos', 'obras', 'operações'],
        sampleCards: [
          {
            title: 'MTR-LOTE-441 (Embalagens Contaminadas)',
            origin: 'Almoxarifado / Pátio Operacional',
            description:
              'Destinação de filtros usados, estopas oleosas e recipientes químicos para incineração licenciada com CDF.',
            stage: 'Destinação / Co-processamento',
            priority: 'média',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
      {
        code: '8.2-AMB',
        title: '8.2 Preparação e Resposta a Emergências Ambientais',
        description:
          'Simulados periódicos de derramamento de químicos, kits de mitigação ambiental, combate a princípio de incêndio e relatórios de tempo de resposta.',
        icon: 'AlertCircle',
        color: 'bg-amber-600 text-white',
        order: 4,
        stages: [
          'Simulado Planejado',
          'Execução do Simulado em Campo',
          'Relatório de Desempenho & Tempos',
          'Adequação de Kits / Barreiras',
          'Homologado & Aprovado',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'brigada', 'obras'],
        sampleCards: [
          {
            title: 'SIMULADO-VAZAM-2026-01',
            origin: 'Brigada de Emergência Ambiental',
            description:
              'Simulação prática de contenção de vazamento de óleo diesel com barreiras absorventes e recolhimento.',
            stage: 'Homologado & Aprovado',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '9.1.1-AMB',
        title: '9.1.1 Monitoramento de Emissões, Efluentes e Ruído Perimetral',
        description:
          'Laudos de amostragem de água de descarte, emissões de fontes fixas/móveis (opacidade), ensaios de ruído perimetral e indicadores de pegada ecológica.',
        icon: 'BarChart3',
        color: 'bg-teal-700 text-white',
        order: 5,
        stages: [
          'Amostragem Agendada',
          'Laudo Laboratorial Emitido',
          'Análise de Conformidade Legal',
          'Plano de Ação Preventiva',
          'Em Conformidade Paramétrica',
        ],
        suggestedDepartmentKeywords: ['obras', 'engenharia', 'qualidade', 'sesmt'],
        sampleCards: [
          {
            title: 'LAUDO-RUIDO-2026-SEMESTRAL',
            origin: 'Laboratório Acreditado Inmetro',
            description:
              'Medição de pressão sonora perimetral diurna e noturna conforme NBR 10151 na divisa dos vizinhos.',
            stage: 'Em Conformidade Paramétrica',
            priority: 'média',
            departmentKeyword: 'obras',
          },
        ],
      },
    ],
  },

  // 3. ISO 27001:2022 - Segurança da Informação e Privacidade (SGSI)
  {
    id: 'preset-iso-27001',
    standardCode: '27001',
    name: 'ISO 27001:2022',
    subtitle: 'Segurança da Informação e Privacidade (SGSI)',
    badge: 'Segurança da Informação & TI',
    color: 'from-slate-800 to-indigo-950',
    icon: 'Lock',
    summary:
      'Pipes essenciais de segurança cibernética e controles do Anexo A: Gestão de Incidentes de Segurança, Avaliação de Riscos de TI & SoA, Gestão de Acessos e Privilégios (MFA), Gestão de Vulnerabilidades Técnicas e LGPD/DSAR.',
    pipesCount: 5,
    pipes: [
      {
        code: 'A.5.24',
        title: 'A.5.24 Gestão de Incidentes de Segurança da Informação',
        description:
          'Notificação de alertas e ameaças, contenção imediata, análise forense, comunicação ao DPO/ANPD se necessário e registro de lições aprendidas.',
        icon: 'ShieldAlert',
        color: 'bg-indigo-900 text-white',
        order: 1,
        stages: [
          'Incidente Reportado / Alerta',
          'Triagem & Contenção Imediata',
          'Análise de Impacto & Forense',
          'Comunicação DPO / Diretoria',
          'Incidente Mitigado & Lições Aprendidas',
        ],
        suggestedDepartmentKeywords: ['ti', 'tecnologia', 'cibersegurança', 'diretoria'],
        sampleCards: [
          {
            title: 'INC-SEC-2026-04 (Brute Force Bloqueado)',
            origin: 'SOC / Firewall Corporativo',
            description:
              'Tentativa automatizada de ataque de força bruta contra portas VPN bloqueada com sucesso pelo fail2ban.',
            stage: 'Incidente Mitigado & Lições Aprendidas',
            priority: 'alta',
            departmentKeyword: 'ti',
          },
        ],
      },
      {
        code: '6.1.2-TI',
        title: '6.1.2 Avaliação e Tratamento de Riscos de TI & Declaração de Aplicabilidade (SoA)',
        description:
          'Inventário de ativos de informação (hardware, cloud, bases de dados), matriz de ameaças/vulnerabilidades (CIA) e seleção dos controles do Anexo A.',
        icon: 'Compass',
        color: 'bg-slate-700 text-white',
        order: 2,
        stages: [
          'Ativo Crítico Identificado',
          'Matriz de Riscos (C-I-A)',
          'Seleção de Controles Anexo A',
          'Implementação SoA',
          'Risco Residual Aceito & Monitorado',
        ],
        suggestedDepartmentKeywords: ['ti', 'tecnologia', 'diretoria', 'qualidade'],
        sampleCards: [
          {
            title: 'RSK-TI-CLOUD-01 (Criptografia de Dados)',
            origin: 'Comitê de Segurança da Informação',
            description:
              'Auditoria nos repositórios cloud para validação de criptografia ponta a ponta (AES-256) em repouso e trânsito.',
            stage: 'Implementação SoA',
            priority: 'crítica',
            departmentKeyword: 'ti',
          },
        ],
      },
      {
        code: 'A.5.15',
        title: 'A.5.15 Gestão de Acessos, Credenciais e Privilégios (RBAC)',
        description:
          'Solicitações de acessos com aprovação formal, princípio do menor privilégio, obrigatoriedade de MFA, revisão trimestral e revogação imediata no offboarding.',
        icon: 'UserCheck',
        color: 'bg-indigo-700 text-white',
        order: 3,
        stages: [
          'Solicitação de Acesso',
          'Aprovação do Gestor da Área',
          'Concessão TI / MFA Configurado',
          'Revisão Trimestral de Contas',
          'Acesso Revogado / Offboarding',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'ti', 'dho'],
        sampleCards: [
          {
            title: 'REQ-ACC-2026-88 (Novo Analista Financeiro)',
            origin: 'Recursos Humanos',
            description:
              'Liberação de credenciais de acesso ao ERP, e-mail institucional e VPN corporativa com dupla autenticação.',
            stage: 'Concessão TI / MFA Configurado',
            priority: 'média',
            departmentKeyword: 'rh',
          },
        ],
      },
      {
        code: 'A.8.8',
        title: 'A.8.8 Gestão de Vulnerabilidades Técnicas & Pentest',
        description:
          'Varreduras periódicas de vulnerabilidade, testes de intrusão externos/internos, classificação por severidade CVSS e deploy de patches de segurança.',
        icon: 'Target',
        color: 'bg-purple-800 text-white',
        order: 4,
        stages: [
          'Scan Realizado / Vulnerabilidade Aberta',
          'Classificação CVSS & Prioridade',
          'Patch em Ambiente de Homologação',
          'Deploy de Atualização / Fix',
          'Re-Scan Homologado & Fechado',
        ],
        suggestedDepartmentKeywords: ['ti', 'tecnologia', 'infraestrutura'],
        sampleCards: [
          {
            title: 'VULN-PATCH-AGOSTO-2026',
            origin: 'Relatório Qualys / Nessus',
            description:
              'Aplicação de patches de segurança de kernel e bibliotecas SSL nos servidores Linux de produção.',
            stage: 'Deploy de Atualização / Fix',
            priority: 'alta',
            departmentKeyword: 'ti',
          },
        ],
      },
      {
        code: 'A.5.34',
        title: 'A.5.34 Privacidade e Proteção de Dados Pessoais (LGPD / DSAR)',
        description:
          'Mapeamento de dados pessoais (ROPA), atendimento a solicitações de titulares (DSAR), elaboração de RIPD/DPIA e auditoria de operadores parceiros.',
        icon: 'Receipt',
        color: 'bg-blue-900 text-white',
        order: 5,
        stages: [
          'Solicitação de Titular (DSAR)',
          'Localização de Registros nos Sistemas',
          'Parecer Jurídico / DPO',
          'Resposta Oficial ao Titular',
          'Registro de Atendimento Arquivado',
        ],
        suggestedDepartmentKeywords: ['jurídico', 'compliance', 'dpo', 'diretoria'],
        sampleCards: [
          {
            title: 'DSAR-LGPD-2026-012',
            origin: 'Portal de Privacidade da Empresa',
            description:
              'Solicitação de confirmação de tratamento e portabilidade de dados por colaborador desligado.',
            stage: 'Resposta Oficial ao Titular',
            priority: 'média',
            departmentKeyword: 'diretoria',
          },
        ],
      },
    ],
  },

  // 4. ISO 45001:2018 - Saúde e Segurança Ocupacional (SSO)
  {
    id: 'preset-iso-45001',
    standardCode: '45001',
    name: 'ISO 45001:2018',
    subtitle: 'Saúde e Segurança Ocupacional (SSO)',
    badge: 'Saúde & Segurança no Trabalho',
    color: 'from-amber-600 to-rose-700',
    icon: 'HeartPulse',
    summary:
      'Pipes focados na integridade física e prevenção de acidentes: Investigação de Acidentes/Quase-Acidentes, Análise Preliminar de Risco (APR/PT), Gestão de EPIs/EPCs, Consulta e CIPA e Gestão de Saúde Ocupacional (PCMSO/ASO).',
    pipesCount: 5,
    pipes: [
      {
        code: '10.2-SST',
        title: '10.2 Investigação de Incidentes, Quase-Acidentes e Doenças Ocupacionais',
        description:
          'Comunicação inicial, emissão de CAT se aplicável, investigação técnica de causas imediatas/básicas (Árvore de Causas) e medidas preventivas de bloqueio.',
        icon: 'AlertCircle',
        color: 'bg-rose-600 text-white',
        order: 1,
        stages: [
          'Relato / Quase-Acidente',
          'Primeiros Socorros & CAT (se houver)',
          'Investigação de Causa Raiz (Árvore de Causas)',
          'Plano de Prevenção / Bloqueio',
          'Eficácia Comprovada & Lição Divulgada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'saúde', 'obras'],
        sampleCards: [
          {
            title: 'INC-SST-2026-032 (Quase-Acidente Carga)',
            origin: 'SESMT / CIPA',
            description:
              'Quase-acidente com rompimento de cinta auxiliar durante descarregamento de perfis de aço no pátio.',
            stage: 'Plano de Prevenção / Bloqueio',
            priority: 'crítica',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '6.1.2-SST',
        title:
          '6.1.2 Identificação de Perigos, Avaliação de Riscos (APR) e Permissão de Trabalho (PT)',
        description:
          'Emissão de APR para atividades operacionais, liberação formal de Permissão de Trabalho (PT) para trabalho em altura, espaço confinado e eletricidade.',
        icon: 'Compass',
        color: 'bg-amber-600 text-white',
        order: 2,
        stages: [
          'Solicitação de APR / PT',
          'Inspeção Pré-Tarefa no Local',
          'Aprovação Engenharia / Técnico SST',
          'Trabalho em Execução Monitorada',
          'PT Encerrada & Área Desmobilizada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'obras', 'engenharia'],
        sampleCards: [
          {
            title: 'APR-ALTURA-2026-084',
            origin: 'Frente de Montagem Fachada',
            description:
              'Trabalho em altura com andaime multidirecional e ancoragem em cabo de aço certificado (NR-35).',
            stage: 'Trabalho em Execução Monitorada',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '8.1.2-EPI',
        title: '8.1.2 Gestão de EPIs, EPCs e Inspeções de Segurança',
        description:
          'Fichas individuais de entrega de EPI com Certificado de Aprovação (CA) vigente, inspeção periódica de extintores, guarda-corpos e proteção coletiva.',
        icon: 'Hammer',
        color: 'bg-orange-600 text-white',
        order: 3,
        stages: [
          'Inspeção Realizada',
          'Desvio Apontado / CA Vencido',
          'Correção Imediata / Troca',
          'Substituição Registrada em Ficha',
          'Conforme & Atestado',
        ],
        suggestedDepartmentKeywords: ['suprimentos', 'almoxarifado', 'segurança', 'sesmt'],
        sampleCards: [
          {
            title: 'INSP-EPI-2026-019',
            origin: 'Técnico de Segurança do Trabalho',
            description:
              'Substituição preventiva de capacetes de segurança com jugular e talabartes de absorção de impacto.',
            stage: 'Conforme & Atestado',
            priority: 'média',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
      {
        code: '5.4-CIPA',
        title: '5.4 Consulta, Participação dos Trabalhadores & Gestão da CIPA',
        description:
          'Cronograma e atas de reuniões ordinárias da CIPA, organização da SIPAT, execução dos Diálogos Diários de Segurança (DDS) e direito de recusa.',
        icon: 'Handshake',
        color: 'bg-yellow-600 text-white',
        order: 4,
        stages: [
          'Pauta Levantada pelos Trabalhadores',
          'Reunião Ordinária CIPA Realizada',
          'Plano de Melhoria Aprovado',
          'Execução de Ações & DDS',
          'Ata Homologada & Divulgada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'rh', 'recursos humanos', 'cipa'],
        sampleCards: [
          {
            title: 'CIPA-ATA-2026-08',
            origin: 'Comissão Interna de Prevenção de Acidentes',
            description:
              'Adequação ergonômica das bancadas da oficina e reforço na iluminação das escadas de acesso.',
            stage: 'Plano de Melhoria Aprovado',
            priority: 'média',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '8.1-PCMSO',
        title: '8.1 Gestão de Saúde Ocupacional & Exames Clínicos (ASO / PCMSO)',
        description:
          'Planejamento de exames ocupacionais (admissionais, periódicos, retorno ao trabalho e demissionais), exames complementares e envio ao eSocial.',
        icon: 'UserCheck',
        color: 'bg-emerald-600 text-white',
        order: 5,
        stages: [
          'Exame a Vencer (30 dias)',
          'Guia de Encaminhamento Emitida',
          'Atendimento Clínico / Laboratorial',
          'ASO Homologado (Apto)',
          'Evento eSocial (S-2220) Transmitido',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'sesmt', 'saúde'],
        sampleCards: [
          {
            title: 'ASO-PER-2026-LOTE2',
            origin: 'Medicina do Trabalho Credenciada',
            description:
              'Lote de 22 exames periódicos para equipe de campo com audiometria e acuidade visual.',
            stage: 'ASO Homologado (Apto)',
            priority: 'alta',
            departmentKeyword: 'rh',
          },
        ],
      },
    ],
  },

  // 5. NR-1 - Gerenciamento de Riscos Ocupacionais (GRO / PGR)
  {
    id: 'preset-nr-1',
    standardCode: 'NR1',
    name: 'NR-1 (GRO / PGR)',
    subtitle: 'Gerenciamento de Riscos Ocupacionais e PGR',
    badge: 'Norma Regulamentadora Obrigatória',
    color: 'from-red-600 to-amber-700',
    icon: 'ShieldAlert',
    summary:
      'Fluxos obrigatórios do Ministério do Trabalho e Emprego: Inventário de Riscos Ocupacionais (Físicos, Químicos, Biológicos, Ergonômicos e Acidentes), Plano de Ação do PGR, Matriz de Treinamentos Obrigatórios e Análise Contínua de Desempenho.',
    pipesCount: 4,
    pipes: [
      {
        code: 'NR1-GRO',
        title: 'NR-1 Inventário de Riscos Ocupacionais (GRO)',
        description:
          'Identificação dos perigos e avaliação de riscos ocupacionais por GHE (Grupo Homogêneo de Exposição), classificação de probabilidade x severidade e gradação de risco.',
        icon: 'Compass',
        color: 'bg-red-600 text-white',
        order: 1,
        stages: [
          'GHE Identificado & Mapeado',
          'Avaliação Qualitativa / Quantitativa',
          'Matriz de Riscos NR-1',
          'Medida de Controle Selecionada',
          'Inventário Consolidado & Vigente',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'engenharia', 'obras'],
        sampleCards: [
          {
            title: 'GRO-GHE-03 (Corte e Solda)',
            origin: 'Engenharia de Segurança',
            description:
              'Avaliação dosimetria de ruído e fumos metálicos de solda com determinação do nível de ação.',
            stage: 'Medida de Controle Selecionada',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: 'NR1-PGR',
        title: 'NR-1 Plano de Ação do PGR (Implementação & Cronograma)',
        description:
          'Cronograma de implantação de medidas preventivas, alocação de recursos financeiros, responsáveis definidos e verificação in loco da eficácia.',
        icon: 'Target',
        color: 'bg-amber-600 text-white',
        order: 2,
        stages: [
          'Medida Cadastrada no Plano',
          'Orçamento & Recursos Alocados',
          'Em Execução Técnica',
          'Verificação de Eficácia In Loco',
          'Ação Concluída & Homologada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'diretoria', 'obras'],
        sampleCards: [
          {
            title: 'PGR-ACAO-2026-05 (Exaustão Mecânica)',
            origin: 'Coordenador SST',
            description:
              'Instalação de coifa de exaustão localizada na bancada central de solda e montagem de tubulações.',
            stage: 'Em Execução Técnica',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: 'NR1-CAPAC',
        title: 'NR-1 Matriz de Capacitação e Treinamentos Obrigatórios',
        description:
          'Controle de treinamentos obrigatórios (integração geral, periódico, eventual e específico das NRs), conteúdo programático, instrutores habilitados e emissão de certificados.',
        icon: 'UserCheck',
        color: 'bg-blue-600 text-white',
        order: 3,
        stages: [
          'Treinamento Previsto na Matriz',
          'Turma Convocada & Agendada',
          'Treinamento Concluído',
          'Avaliação de Aprendizado Aprovada',
          'Certificado Homologado no eSocial',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'sesmt', 'dho'],
        sampleCards: [
          {
            title: 'CAP-NR01-INTEG-2026',
            origin: 'SESMT / RH',
            description:
              'Treinamento de integração geral sobre riscos dos setores, direitos de recusa e procedimentos de segurança.',
            stage: 'Certificado Homologado no eSocial',
            priority: 'média',
            departmentKeyword: 'rh',
          },
        ],
      },
      {
        code: 'NR1-ANALISE',
        title: 'NR-1 Acompanhamento de Saúde e Auditoria Bienal do PGR',
        description:
          'Análise do desempenho das medidas preventivas, cruzamento com dados epidemiológicos do PCMSO e revisão bienal (ou trienal para certificados ISO 45001).',
        icon: 'BarChart3',
        color: 'bg-indigo-600 text-white',
        order: 4,
        stages: [
          'Coleta de Indicadores de SST & Atestados',
          'Análise Crítica de Desvios',
          'Revisão Documental do PGR',
          'Homologação Responsável Técnico',
          'PGR Revalidado & Vigente',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'saúde', 'diretoria'],
        sampleCards: [
          {
            title: 'REV-PGR-BIENAL-2026',
            origin: 'Responsável Técnico SST',
            description:
              'Reavaliação anual das medidas de prevenção após implantação da nova linha de pintura e montagem.',
            stage: 'PGR Revalidado & Vigente',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
    ],
  },

  // 6. NR-27 - Registro Profissional e Segurança Operacional
  {
    id: 'preset-nr-27',
    standardCode: 'NR27',
    name: 'NR-27 (Qualificação & Registros)',
    subtitle: 'Registro Profissional e Segurança Operacional',
    badge: 'Conformidade Regulatória & Técnica',
    color: 'from-cyan-700 to-blue-900',
    icon: 'FileCheck2',
    summary:
      'Pipes de conformidade técnica e operacional: Homologação de Registros Profissionais (CREA, CFT, CRM, OAB), Gestão de Responsabilidade Técnica (ART/RRT/TRT), Habilitação para Operações de Risco e Auditoria de Terceirizados.',
    pipesCount: 4,
    pipes: [
      {
        code: 'NR27-REG',
        title: 'NR-27 Homologação de Registros e Habilitações Profissionais',
        description:
          'Validação de certidões nos conselhos de classe (CREA/CFT/CRM/CRQ), conferência de diplomas, carteiras profissionais e regularidade cadastral.',
        icon: 'UserCheck',
        color: 'bg-cyan-700 text-white',
        order: 1,
        stages: [
          'Documento Enviado pelo Profissional',
          'Checagem no Conselho de Classe',
          'Validação Técnica & Acervo',
          'Profissional Habilitado / Aprovado',
          'Renovação Periódica de Anuidade',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'dho', 'engenharia'],
        sampleCards: [
          {
            title: 'HAB-ENG-MEC-2026-01',
            origin: 'RH / DHO',
            description:
              'Validação da certidão de registro e quitação no CREA do engenheiro mecânico responsável pelas manutenções.',
            stage: 'Profissional Habilitado / Aprovado',
            priority: 'alta',
            departmentKeyword: 'rh',
          },
        ],
      },
      {
        code: 'NR27-ART',
        title: 'NR-27 Emissão, Vínculo e Baixa de ART / RRT / TRT',
        description:
          'Controle de Anotações de Responsabilidade Técnica para projetos, execução de obras, laudos periciais e manutenções críticas.',
        icon: 'Receipt',
        color: 'bg-blue-700 text-white',
        order: 2,
        stages: [
          'Demanda Técnica de ART',
          'Elaboração no Portal do Conselho',
          'Taxa Paga & ART Emitida com Assinatura',
          'Vinculada ao Contrato / Projeto',
          'Baixa por Conclusão da Atividade',
        ],
        suggestedDepartmentKeywords: ['obras', 'engenharia', 'operações', 'diretoria'],
        sampleCards: [
          {
            title: 'ART-LAUDO-NR12-2026',
            origin: 'Engenharia Mecânica',
            description:
              'ART de apreciação de risco e laudo de conformidade mecânica de dobradeiras e prensas industriais.',
            stage: 'Vinculada ao Contrato / Projeto',
            priority: 'crítica',
            departmentKeyword: 'obras',
          },
        ],
      },
      {
        code: 'NR27-OP-RISCO',
        title: 'NR-27 Habilitação e Autorização para Operadores de Equipamentos Especiais',
        description:
          'Controle de habilitação formal, atestado de saúde mental/física, reciclagem anual e crachás de autorização para operadores de empilhadeiras, pontes rolantes, caldeiras e eletricistas.',
        icon: 'Hammer',
        color: 'bg-sky-700 text-white',
        order: 3,
        stages: [
          'Curso de Formação Concluído',
          'Atestado de Aptidão Física/Mental (ASO)',
          'Crachá de Autorização Emitido',
          'Em Operação Liberada & Monitorada',
          'Reciclagem Anual Agendada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'suprimentos', 'operações'],
        sampleCards: [
          {
            title: 'AUT-EMPILH-2026-04',
            origin: 'SESMT / Logística',
            description:
              'Reciclagem de 16h e emissão de crachá de autorização para operador de empilhadeira a combustão (NR-11).',
            stage: 'Em Operação Liberada & Monitorada',
            priority: 'média',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: 'NR27-TERC',
        title: 'NR-27 Qualificação Técnica e Homologação de Fornecedores e Terceiros',
        description:
          'Auditoria documental de prestadores de serviço (CNDs, ASOs, PGR/PCMSO da terceirizada, registros em conselhos e seguros de responsabilidade civil).',
        icon: 'Handshake',
        color: 'bg-teal-700 text-white',
        order: 4,
        stages: [
          'Dossiê Documental Solicitado',
          'Análise de Conformidade Trabalhista/SST',
          'Homologação de Terceiro Liberada',
          'Prestação de Serviço com Acesso Liberado',
          'Auditoria Mensal de Folha & CNDs',
        ],
        suggestedDepartmentKeywords: ['suprimentos', 'jurídico', 'almoxarifado', 'diretoria'],
        sampleCards: [
          {
            title: 'TERC-MANUT-ELETRICA-2026',
            origin: 'Suprimentos / Jurídico',
            description:
              'Auditoria documental mensal da terceirizada de manutenção elétrica predial com apresentação de NR-10 e ASOs.',
            stage: 'Prestação de Serviço com Acesso Liberado',
            priority: 'alta',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
    ],
  },

  // 7. ISO 22000:2018 - Sistema de Gestão de Segurança de Alimentos (SGSA)
  {
    id: 'preset-iso-22000',
    standardCode: '22000',
    name: 'ISO 22000:2018',
    subtitle: 'Segurança de Alimentos e Boas Práticas (APPCC / HACCP)',
    badge: 'Segurança de Alimentos & Agro',
    color: 'from-orange-600 to-amber-800',
    icon: 'Compass',
    summary:
      'Pipes essenciais da cadeia de alimentos: Programas de Pré-Requisitos (PPR / BPF), Plano APPCC / HACCP (PCC & PPRO), Rastreabilidade e Recolhimento (Recall), Controle de Alergênicos e Higienização/CIP.',
    pipesCount: 5,
    pipes: [
      {
        code: '8.2-PPR',
        title: '8.2 Programas de Pré-Requisitos (PPR / BPF)',
        description:
          'Monitoramento de Boas Práticas de Fabricação (BPF), controle de pragas, potabilidade da água, higiene pessoal e manutenção predial das instalações.',
        icon: 'FileCheck2',
        color: 'bg-amber-600 text-white',
        order: 1,
        stages: [
          'Inspeção BPF Agendada',
          'Desvio de Higiene / Instalação Apontado',
          'Ação Corretiva Imediata',
          'Reinspeção de Área',
          'Conforme & Aprovado',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'operações', 'manutenção', 'produção'],
        sampleCards: [
          {
            title: 'BPF-INSP-2026-08',
            origin: 'Garantia da Qualidade Alimentar',
            description:
              'Inspeção semanal de barreiras sanitárias, telas milimétricas e armadilhas luminosas para controle de pragas.',
            stage: 'Conforme & Aprovado',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
        ],
      },
      {
        code: '8.5-APPCC',
        title: '8.5 Plano de Controle de Perigos (APPCC / HACCP - PCC e PPRO)',
        description:
          'Identificação de perigos biológicos, químicos e físicos, árvore decisória, definição de limites críticos, monitoramento contínuo e ações para desvios de PCC.',
        icon: 'Target',
        color: 'bg-orange-600 text-white',
        order: 2,
        stages: [
          'Monitoramento Contínuo PCC',
          'Desvio de Limite Crítico Detectado',
          'Segregação de Lote & Contenção',
          'Ação Corretiva no Processo',
          'Lote Liberado / Destinado com Segurança',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'produção', 'operações', 'engenharia'],
        sampleCards: [
          {
            title: 'PCC-PASTEURIZ-2026-01',
            origin: 'Painel de Automação Térmica',
            description:
              'Monitoramento contínuo de tempo e temperatura de pasteurização com validação de termômetro RBC.',
            stage: 'Monitoramento Contínuo PCC',
            priority: 'crítica',
            departmentKeyword: 'produção',
          },
        ],
      },
      {
        code: '8.9.5-RECALL',
        title: '8.9.5 Rastreabilidade de Lotes e Simulado de Recolhimento (Recall)',
        description:
          'Rastreabilidade total da matéria-prima até a expedição, balanço de massa, protocolo de comunicação a clientes/ANVISA e simulação anual de recall.',
        icon: 'Layers',
        color: 'bg-red-700 text-white',
        order: 3,
        stages: [
          'Demanda de Rastreabilidade / Simulado',
          'Balanço de Massa & Identificação de Destinos',
          'Comunicação aos Pontos de Distribuição',
          'Recolhimento / Bloqueio Físico',
          'Relatório Final de Eficácia do Recall',
        ],
        suggestedDepartmentKeywords: ['logística', 'suprimentos', 'qualidade', 'diretoria'],
        sampleCards: [
          {
            title: 'SIMULADO-RECALL-2026',
            origin: 'Comitê de Crise & Qualidade',
            description:
              'Simulado de rastreabilidade reversa de 100% de lote de insumo crítico em menos de 2 horas.',
            stage: 'Relatório Final de Eficácia do Recall',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
        ],
      },
      {
        code: '8.4-ALERG',
        title: '8.4 Programa de Controle de Alergênicos (PCAL) e Rotulagem',
        description:
          'Mapeamento de alergênicos na planta, sequenciamento de produção, validação de limpeza entre trocas de produto e conformidade da rotulagem (RDC 727/2022).',
        icon: 'AlertCircle',
        color: 'bg-rose-700 text-white',
        order: 4,
        stages: [
          'Avaliação de Rótulo / Troca de Formulação',
          'Sequenciamento de Produção',
          'Swab de Alergênicos Pós-Higienização',
          'Validação Técnica de Liberação',
          'Lote Rotulado em Conformidade',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'produção', 'pesquisa e desenvolvimento'],
        sampleCards: [
          {
            title: 'SWAB-ALERG-LOTE-88',
            origin: 'Laboratório de Microbiologia',
            description:
              'Teste rápido de detecção de proteína de leite e soja em linha compartilhada antes de troca de lote.',
            stage: 'Validação Técnica de Liberação',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
        ],
      },
      {
        code: '8.2.4-CIP',
        title: '8.2.4 Higienização de Linhas, Validação de Limpeza (CIP) e Sanificação',
        description:
          'Procedimentos operacionais de limpeza e sanificação (PPHO/SSOP), controle de concentração de detergentes/sanitizantes, temperatura de CIP e swabs de ATP.',
        icon: 'Hammer',
        color: 'bg-emerald-700 text-white',
        order: 5,
        stages: [
          'Ciclo CIP em Andamento',
          'Checagem de Parâmetros (Concentração/Temp)',
          'Coleta de Swab ATP / Microbiológico',
          'Linha Aprovada para Produção',
          'Registro de Higienização Arquivado',
        ],
        suggestedDepartmentKeywords: ['produção', 'manutenção', 'qualidade'],
        sampleCards: [
          {
            title: 'CIP-LINHA-02-MANHA',
            origin: 'Operador de Higienização',
            description:
              'Ciclo completo de lavagem cáustica e ácida com sanitização por ácido peracético e teste de ATP zerado.',
            stage: 'Linha Aprovada para Produção',
            priority: 'média',
            departmentKeyword: 'produção',
          },
        ],
      },
    ],
  },
]

/**
 * Intelligent helper to match a pipe/card to the most suitable department from the client's onboarding
 */
export function findBestMatchingDepartment(
  keywords: string[] | undefined,
  departments: CompanyDepartment[],
): CompanyDepartment | null {
  if (!departments || departments.length === 0) return null
  if (!keywords || keywords.length === 0) return departments[0]

  // Try exact or partial string matching on department name or notes
  for (const kw of keywords) {
    const cleanKw = kw.toLowerCase().trim()
    const found = departments.find((d) => {
      const name = (d.name || '').toLowerCase()
      const notes = (d.notes || '').toLowerCase()
      return name.includes(cleanKw) || notes.includes(cleanKw)
    })
    if (found) return found
  }

  return departments[0]
}

/**
 * Custom Presets (persisted in PocketBase collection 'custom_presets')
 */
export async function getCustomPresets(): Promise<StandardPreset[]> {
  try {
    const records = await pb.collection('custom_presets').getFullList({
      sort: '-created',
    })
    return records.map((r) => ({
      id: r.id,
      standardCode: r.standardCode || '9001',
      name: r.name,
      subtitle: r.subtitle || 'Pre-set Personalizado do Auditor',
      badge: r.badge || 'Personalizado',
      color: r.color || 'from-indigo-600 to-purple-800',
      icon: r.icon || 'Layers',
      summary: r.summary || 'Conjunto personalizado de fluxos e etapas.',
      pipesCount: Array.isArray(r.pipes) ? r.pipes.length : r.pipesCount || 0,
      pipes: Array.isArray(r.pipes) ? r.pipes : [],
      isCustom: true,
      author: r.author,
      created: r.created,
      updated: r.updated,
    }))
  } catch (e) {
    console.error('Erro ao buscar pre-sets personalizados:', e)
    return []
  }
}

export async function saveCustomPreset(preset: Partial<StandardPreset>): Promise<StandardPreset> {
  const pipes = preset.pipes || []
  const payload = {
    name: preset.name || 'Novo Pre-set Personalizado',
    subtitle: preset.subtitle || 'Conjunto customizado de pipes',
    standardCode: preset.standardCode || '9001',
    badge: preset.badge || 'Personalizado',
    color: preset.color || 'from-blue-600 to-indigo-800',
    icon: preset.icon || 'Layers',
    summary: preset.summary || 'Fluxos adaptados pelo auditor para clientes específicos.',
    pipes: pipes,
    pipesCount: pipes.length,
    author: pb.authStore.record?.id,
    is_public: true,
  }

  if (preset.id && !preset.id.startsWith('preset-')) {
    // Update existing in PocketBase
    const updated = await pb.collection('custom_presets').update(preset.id, payload)
    return {
      id: updated.id,
      standardCode: updated.standardCode,
      name: updated.name,
      subtitle: updated.subtitle,
      badge: updated.badge,
      color: updated.color,
      icon: updated.icon,
      summary: updated.summary,
      pipesCount: updated.pipesCount,
      pipes: updated.pipes,
      isCustom: true,
      author: updated.author,
      created: updated.created,
      updated: updated.updated,
    }
  } else {
    // Create new
    const created = await pb.collection('custom_presets').create(payload)
    return {
      id: created.id,
      standardCode: created.standardCode,
      name: created.name,
      subtitle: created.subtitle,
      badge: created.badge,
      color: created.color,
      icon: created.icon,
      summary: created.summary,
      pipesCount: created.pipesCount,
      pipes: created.pipes,
      isCustom: true,
      author: created.author,
      created: created.created,
      updated: created.updated,
    }
  }
}

export async function deleteCustomPreset(id: string): Promise<boolean> {
  try {
    await pb.collection('custom_presets').delete(id)
    return true
  } catch {
    return false
  }
}

/**
 * Applies a complete preset (standard or custom) of pipes and realistic cards to a target client / certification
 * Automatically links client onboarding departments & managers to the cards!
 */
export async function applyStandardPresetToClient(params: {
  presetId?: string
  customPreset?: StandardPreset
  clientId: string
  certificationId?: string
}): Promise<{ createdPipesCount: number; createdCardsCount: number }> {
  const { presetId, customPreset, clientId, certificationId } = params

  let preset: StandardPreset | undefined = customPreset

  if (!preset && presetId) {
    preset = STANDARD_PRESETS.find((p) => p.id === presetId)
    if (!preset) {
      try {
        const customRec = await pb.collection('custom_presets').getOne(presetId)
        preset = {
          id: customRec.id,
          standardCode: customRec.standardCode,
          name: customRec.name,
          subtitle: customRec.subtitle,
          badge: customRec.badge,
          color: customRec.color,
          icon: customRec.icon,
          summary: customRec.summary,
          pipesCount: customRec.pipesCount,
          pipes: customRec.pipes,
          isCustom: true,
        }
      } catch {
        /* noop */
      }
    }
  }

  if (!preset) {
    throw new Error('Pre-set não encontrado.')
  }

  // 1. Resolve ISO type ID if matching exists in the database
  let isoTypeId = ''
  try {
    const isoType = await pb
      .collection('iso_types')
      .getFirstListItem(`code = "${preset.standardCode}"`)
    if (isoType) {
      isoTypeId = isoType.id
    }
  } catch {
    // If not found by exact code, fallback
  }

  // 2. Resolve client business model & departments from onboarding
  let businessModelId = ''
  let clientDepartments: CompanyDepartment[] = []
  try {
    const clientUser = await pb.collection('users').getOne(clientId)
    if (clientUser.business_model) {
      businessModelId = clientUser.business_model
    }
    if (clientUser.departments && Array.isArray(clientUser.departments)) {
      clientDepartments = clientUser.departments
    }
  } catch {
    /* intentionally ignored */
  }

  let createdPipesCount = 0
  let createdCardsCount = 0

  // 3. For each pipe in the preset, create the pipe in PocketBase
  for (let i = 0; i < preset.pipes.length; i++) {
    const p = preset.pipes[i]

    // Create the pipe record
    const pipePayload: Record<string, any> = {
      title: p.title,
      code: p.code,
      description: p.description,
      icon: p.icon || 'Layers',
      color: p.color || 'bg-blue-600 text-white',
      order: p.order || i + 1,
      stages:
        p.stages && p.stages.length > 0 ? p.stages : ['Ação Imediata', 'Em Análise', 'Concluído'],
    }

    if (isoTypeId) {
      pipePayload.iso_type = isoTypeId
    }
    if (businessModelId) {
      pipePayload.business_model = businessModelId
    }

    const createdPipe = await pb.collection('pipes').create(pipePayload)
    createdPipesCount++

    // Determine matching department for this pipe
    const pipeDept = findBestMatchingDepartment(p.suggestedDepartmentKeywords, clientDepartments)

    // 4. Create sample starter cards if defined, with automatic department linking
    if (p.sampleCards && p.sampleCards.length > 0) {
      for (let j = 0; j < p.sampleCards.length; j++) {
        const sc = p.sampleCards[j]
        const cardKeywords = sc.departmentKeyword
          ? [sc.departmentKeyword, ...(p.suggestedDepartmentKeywords || [])]
          : p.suggestedDepartmentKeywords

        const assignedDept = findBestMatchingDepartment(cardKeywords, clientDepartments) || pipeDept

        const cardData: Record<string, any> = {}
        if (assignedDept) {
          cardData.department_name = assignedDept.name
          cardData.department_manager = assignedDept.manager
          cardData.department_phone = assignedDept.phone
          cardData.department_email = assignedDept.email
          cardData.assigned_sector = assignedDept.name
        }

        const cardPayload: Record<string, any> = {
          pipe: createdPipe.id,
          title: sc.title,
          origin: sc.origin,
          description: sc.description,
          stage: sc.stage || p.stages[0] || 'Ação Imediata',
          priority: sc.priority || 'média',
          user: clientId,
          order: j + 1,
          data: cardData,
        }

        if (certificationId) {
          cardPayload.certification = certificationId
        }

        await pb.collection('pipe_cards').create(cardPayload)
        createdCardsCount++
      }
    }
  }

  // 5. Send a notification to the client
  try {
    await pb.collection('notifications').create({
      user: clientId,
      type: 'task_assigned',
      title: `Pre-set de Pipes Ativado: ${preset.name}`,
      message: `O auditor aplicou o fluxo completo de ${preset.name} (${preset.pipesCount || createdPipesCount} pipes). Os módulos já estão disponíveis na sua área de Processos & Pipes.`,
      is_read: false,
    })
  } catch {
    /* intentionally ignored */
  }

  return { createdPipesCount, createdCardsCount }
}
