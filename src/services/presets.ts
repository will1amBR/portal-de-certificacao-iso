import pb from '@/lib/pocketbase/client'
import { Pipe } from '@/services/pipes'
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
  {
    id: 'preset-iso-9001',
    standardCode: '9001',
    name: 'ISO 9001:2015',
    subtitle: 'Sistema de Gestão da Qualidade (SGQ)',
    badge: 'Qualidade & Processos',
    color: 'from-blue-600 to-indigo-700',
    icon: 'ShieldCheck',
    summary:
      'Fluxos completos por cláusula: controle de documentos, RNCs, auditorias internas, análise crítica da direção, calibração, competências e satisfação do cliente.',
    pipesCount: 7,
    pipes: [
      {
        code: '10.2',
        title: '10.2 Tratamento de Não-Conformidades e Ações Corretivas',
        description:
          'Registro de desvios, contenção imediata (5 Porquês), plano de ação corretiva e verificação de eficácia.',
        icon: 'SquarePen',
        color: 'bg-blue-600 text-white',
        order: 1,
        stages: [
          'Ação Imediata',
          'Análise de Causa (5P / Ishikawa)',
          'Plano de Ação Corretiva',
          'Validação de Eficácia',
          'Concluído',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'sgq', 'garantia', 'engenharia', 'operações'],
        sampleCards: [
          {
            title: 'RNC-9001-01',
            origin: 'Auditoria de Processo',
            description: 'Divergência nos apontamentos de inspeção de entrada de insumos e laudos.',
            stage: 'Ação Imediata',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
          {
            title: 'RNC-9001-02',
            origin: 'Reclamação de Cliente',
            description: 'Atraso na liberação técnica da remessa #4521 e divergência dimensional.',
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
          'Elaboração, revisão técnica, aprovação pela diretoria, distribuição controlada e histórico de revisões.',
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
            description: 'Procedimento Geral de Controle de Registros, Revisões e Auditorias.',
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
          'Planejamento do ciclo anual de auditorias, reuniões de abertura, apontamento de evidências e relatório final.',
        icon: 'FileCheck2',
        color: 'bg-sky-600 text-white',
        order: 3,
        stages: [
          'Planejada / Escopo',
          'Lista de Verificação',
          'Auditoria em Campo',
          'Elaboração de Relatório',
          'Follow-up Concluído',
        ],
        suggestedDepartmentKeywords: ['qualidade', 'diretoria', 'auditoria'],
        sampleCards: [
          {
            title: 'AUD-INT-Q3',
            origin: 'Auditoria Líder',
            description: 'Ciclo semestral de auditoria interna nas cláusulas 4 a 10.',
            stage: 'Planejada / Escopo',
            priority: 'alta',
            departmentKeyword: 'qualidade',
          },
        ],
      },
      {
        code: '9.3',
        title: '9.3 Análise Crítica pela Direção',
        description:
          'Compilação de resultados de auditorias, feedbacks, metas de qualidade e decisões de recursos.',
        icon: 'BarChart3',
        color: 'bg-purple-600 text-white',
        order: 4,
        stages: [
          'Coleta de Entradas',
          'Ata em Redação',
          'Reunião com Diretoria',
          'Plano de Metas / Recursos',
          'Aprovado',
        ],
        suggestedDepartmentKeywords: ['diretoria', 'operações', 'executiva', 'gestão'],
        sampleCards: [
          {
            title: 'ATA-DIR-2026',
            origin: 'Diretoria Executiva',
            description:
              'Análise anual do desempenho do SGQ e alocação orçamentária para certificação.',
            stage: 'Coleta de Entradas',
            priority: 'crítica',
            departmentKeyword: 'diretoria',
          },
        ],
      },
      {
        code: '7.1.5',
        title: '7.1.5 Monitoramento e Medição de Recursos (Calibração)',
        description:
          'Controle periódico de instrumentos, certificados RBC, rastreabilidade e calibrações vigentes.',
        icon: 'Hammer',
        color: 'bg-emerald-600 text-white',
        order: 5,
        stages: [
          'A Vencer (30 dias)',
          'Em Calibração Laboratorial',
          'Laudo em Avaliação',
          'Calibrado / Liberado',
          'Fora de Uso',
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
            title: 'CAL-INSTR-09',
            origin: 'Laboratório RBC',
            description: 'Calibração periódica do micrômetro e trena laser de precisão.',
            stage: 'Calibrado / Liberado',
            priority: 'média',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
      {
        code: '7.2',
        title: '7.2 Competência, Treinamento e Conscientização',
        description:
          'Levantamento de necessidades de treinamento (LNT), execução de capacitações e avaliação de eficácia.',
        icon: 'UserCheck',
        color: 'bg-amber-600 text-white',
        order: 6,
        stages: [
          'Demanda / LNT',
          'Agendado / Turma',
          'Lista Coletada',
          'Avaliação de Eficácia (90d)',
          'Certificado Homologado',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'dho', 'gestão de pessoas'],
        sampleCards: [
          {
            title: 'TREIN-SGQ-2026',
            origin: 'RH / DHO',
            description:
              'Treinamento de conscientização da Política da Qualidade e procedimentos operacionais.',
            stage: 'Certificado Homologado',
            priority: 'média',
            departmentKeyword: 'recursos humanos',
          },
        ],
      },
      {
        code: '9.1.2',
        title: '9.1.2 Satisfação do Cliente e Gestão de Feedbacks',
        description:
          'Aplicação de pesquisas NPS/CSAT, apuração de notas, tratamento de detratores e planos de fidelização.',
        icon: 'BarChart2',
        color: 'bg-teal-600 text-white',
        order: 7,
        stages: [
          'Pesquisa Disparada',
          'Respostas Recebidas',
          'Análise de NPS / Métricas',
          'Tratamento de Detratores',
          'Concluído',
        ],
        suggestedDepartmentKeywords: ['comercial', 'atendimento', 'operações', 'diretoria'],
        sampleCards: [
          {
            title: 'NPS-2026-Q2',
            origin: 'Atendimento ao Cliente',
            description: 'Pesquisa trimestral de satisfação dos principais clientes corporativos.',
            stage: 'Análise de NPS / Métricas',
            priority: 'alta',
            departmentKeyword: 'comercial',
          },
        ],
      },
    ],
  },
  {
    id: 'preset-iso-14001',
    standardCode: '14001',
    name: 'ISO 14001:2015',
    subtitle: 'Sistema de Gestão Ambiental (SGA)',
    badge: 'Sustentabilidade & Meio Ambiente',
    color: 'from-emerald-600 to-teal-800',
    icon: 'Leaf',
    summary:
      'Pipes ambientais estruturados: Levantamento de Aspectos e Impactos (LAIA), Requisitos Legais e Licenças, Gestão de Resíduos (MTR/PGRS), Resposta a Emergências Ambientais e Monitoramento de Emissões.',
    pipesCount: 5,
    pipes: [
      {
        code: '6.1.2',
        title: '6.1.2 Aspectos e Impactos Ambientais (LAIA)',
        description:
          'Identificação de aspectos, matriz de significância, medidas de controle e planos de redução.',
        icon: 'Compass',
        color: 'bg-emerald-600 text-white',
        order: 1,
        stages: [
          'Aspecto Levantado',
          'Matriz de Significância',
          'Medida de Controle Proposta',
          'Monitoramento Operacional',
          'Aspecto Mitigado',
        ],
        suggestedDepartmentKeywords: ['meio ambiente', 'sesmt', 'segurança', 'obras', 'operações'],
        sampleCards: [
          {
            title: 'LAIA-AMB-01',
            origin: 'Engenharia Ambiental',
            description:
              'Avaliação de geração de efluentes oleosos na área de manutenção e canteiro.',
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
          'Gestão de licenças de operação (LP, LI, LO), outorgas de água, alvarás e cumprimento de condicionantes.',
        icon: 'Receipt',
        color: 'bg-teal-600 text-white',
        order: 2,
        stages: [
          'A Vencer (90 dias)',
          'Protocolo em Órgão Ambiental',
          'Atendimento de Condicionante',
          'Licença Vigente',
          'Renovação Concluída',
        ],
        suggestedDepartmentKeywords: ['diretoria', 'jurídico', 'meio ambiente', 'obras'],
        sampleCards: [
          {
            title: 'LIC-LO-2026',
            origin: 'Jurídico / Ambiental',
            description: 'Renovação da Licença de Operação junto ao órgão ambiental estadual.',
            stage: 'Licença Vigente',
            priority: 'crítica',
            departmentKeyword: 'diretoria',
          },
        ],
      },
      {
        code: '8.1-RES',
        title: '8.1 Controle de Resíduos Sólidos (MTR & PGRS)',
        description:
          'Rastreabilidade de caçambas, manifesto de transporte de resíduos (MTR), destinação e CDF final.',
        icon: 'Layers',
        color: 'bg-emerald-700 text-white',
        order: 3,
        stages: [
          'Geração / Acondicionamento',
          'MTR Emitido',
          'Transporte Homologado',
          'Destinação / Reciclagem',
          'CDF Anexado',
        ],
        suggestedDepartmentKeywords: ['almoxarifado', 'suprimentos', 'obras', 'operações'],
        sampleCards: [
          {
            title: 'MTR-LOTE-441',
            origin: 'Almoxarifado / Pátio',
            description:
              'Destinação de sucata metálica e embalagens plásticas contaminadas com CDF.',
            stage: 'Destinação / Reciclagem',
            priority: 'média',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
      {
        code: '8.2-AMB',
        title: '8.2 Preparação e Resposta a Emergências Ambientais',
        description:
          'Simulados de vazamento de produtos químicos, combate a incêndio florestal, kits de mitigação e relatórios.',
        icon: 'AlertCircle',
        color: 'bg-amber-600 text-white',
        order: 4,
        stages: [
          'Simulado Planejado',
          'Execução do Simulado',
          'Relatório de Desempenho',
          'Adequações / Kits',
          'Homologado',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'brigada', 'obras'],
        sampleCards: [
          {
            title: 'SIMULADO-VAZAM-26',
            origin: 'Brigada de Emergência',
            description: 'Simulação de contenção de óleo com barreiras e mantas absorventes.',
            stage: 'Homologado',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '9.1.1-AMB',
        title: '9.1.1 Monitoramento de Emissões, Efluentes e Ruído',
        description:
          'Laudos de amostragem de água, emissões atmosféricas, ensaios de ruído perimetral e indicadores.',
        icon: 'BarChart3',
        color: 'bg-teal-700 text-white',
        order: 5,
        stages: [
          'Coleta Agendada',
          'Laudo Laboratorial',
          'Análise de Conformidade',
          'Ação Preventiva',
          'Em Conformidade',
        ],
        suggestedDepartmentKeywords: ['obras', 'engenharia', 'qualidade', 'sesmt'],
        sampleCards: [
          {
            title: 'LAUDO-RUIDO-Q3',
            origin: 'Consultoria Acústica',
            description: 'Medição perimetral de ruído diurno e noturno conforme NBR 10151.',
            stage: 'Em Conformidade',
            priority: 'média',
            departmentKeyword: 'obras',
          },
        ],
      },
    ],
  },
  {
    id: 'preset-iso-27001',
    standardCode: '27001',
    name: 'ISO 27001:2022',
    subtitle: 'Segurança da Informação e Privacidade (SGSI)',
    badge: 'Segurança da Informação & TI',
    color: 'from-slate-800 to-indigo-950',
    icon: 'Lock',
    summary:
      'Pipes essenciais de segurança cibernética: Gestão de Incidentes de Segurança, Avaliação de Riscos de TI, Gestão de Acessos e Privilégios, Gestão de Vulnerabilidades e LGPD/Privacidade de Dados.',
    pipesCount: 5,
    pipes: [
      {
        code: 'A.5.24',
        title: 'A.5.24 Gestão de Incidentes de Segurança da Informação',
        description:
          'Notificação de incidentes, contenção imediata, análise forense, comunicação a titulares e lições aprendidas.',
        icon: 'ShieldAlert',
        color: 'bg-indigo-900 text-white',
        order: 1,
        stages: [
          'Incidente Reportado',
          'Triagem & Contenção',
          'Análise de Impacto / Forense',
          'Comunicação DPO / Diretoria',
          'Incidente Mitigado',
        ],
        suggestedDepartmentKeywords: ['ti', 'tecnologia', 'cibersegurança', 'diretoria'],
        sampleCards: [
          {
            title: 'INC-SEC-2026-04',
            origin: 'SOC / Monitoramento',
            description: 'Tentativa de ataque de força bruta bloqueada no firewall corporativo.',
            stage: 'Incidente Mitigado',
            priority: 'alta',
            departmentKeyword: 'ti',
          },
        ],
      },
      {
        code: '6.1.2-TI',
        title: '6.1.2 Avaliação e Tratamento de Riscos de TI & Ativos',
        description:
          'Inventário de ativos de informação, matriz de ameaças/vulnerabilidades e Declaração de Aplicabilidade (SoA).',
        icon: 'Compass',
        color: 'bg-slate-700 text-white',
        order: 2,
        stages: [
          'Ativo Identificado',
          'Matriz de Risco (CIA)',
          'Controles Anexo A Definidos',
          'Implementação SoA',
          'Risco Residual Aceito',
        ],
        suggestedDepartmentKeywords: ['ti', 'tecnologia', 'diretoria', 'qualidade'],
        sampleCards: [
          {
            title: 'RSK-TI-CLOUD-01',
            origin: 'Segurança da Informação',
            description:
              'Migração de banco de dados com exigência de criptografia em trânsito e repouso.',
            stage: 'Implementação SoA',
            priority: 'crítica',
            departmentKeyword: 'ti',
          },
        ],
      },
      {
        code: 'A.5.15',
        title: 'A.5.15 Gestão de Acessos, Credenciais e Privilégios',
        description:
          'Solicitação de acesso a sistemas, concessão por menor privilégio, revisão trimestral de acessos e revogação no offboarding.',
        icon: 'UserCheck',
        color: 'bg-indigo-700 text-white',
        order: 3,
        stages: [
          'Solicitação de Acesso',
          'Aprovação do Gestor',
          'Concessão TI / MFA Ativo',
          'Revisão Periódica',
          'Revogado / Offboarding',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'ti', 'dho'],
        sampleCards: [
          {
            title: 'REQ-ACC-2026-88',
            origin: 'Recursos Humanos',
            description: 'Liberação de permissões VPN e ERP com autenticação em duas etapas.',
            stage: 'Concessão TI / MFA Ativo',
            priority: 'média',
            departmentKeyword: 'rh',
          },
        ],
      },
      {
        code: 'A.8.8',
        title: 'A.8.8 Gestão de Vulnerabilidades Técnicas & Pentest',
        description:
          'Varreduras periódicas de vulnerabilidade, testes de intrusão, priorização CVSS e aplicação de patches de segurança.',
        icon: 'Target',
        color: 'bg-purple-800 text-white',
        order: 4,
        stages: [
          'Scan / Vulnerabilidade Detectada',
          'Análise CVSS / Severidade',
          'Patch em Homologação',
          'Deploy de Atualização',
          'Re-Scan Homologado',
        ],
        suggestedDepartmentKeywords: ['ti', 'tecnologia', 'infraestrutura'],
        sampleCards: [
          {
            title: 'VULN-PATCH-AGOSTO',
            origin: 'Relatório Qualys/Nessus',
            description: 'Atualização de segurança crítica nos servidores Linux de produção.',
            stage: 'Deploy de Atualização',
            priority: 'alta',
            departmentKeyword: 'ti',
          },
        ],
      },
      {
        code: 'A.5.34',
        title: 'A.5.34 Privacidade e Proteção de Dados Pessoais (LGPD)',
        description:
          'Mapeamento de dados (ROPA), atendimento a direitos de titulares (DSAR), RIPD e gestão de operadores.',
        icon: 'Receipt',
        color: 'bg-blue-900 text-white',
        order: 5,
        stages: [
          'Demanda / DSAR',
          'Localização de Dados',
          'Parecer do DPO',
          'Resposta ao Titular',
          'Registro Arquivado',
        ],
        suggestedDepartmentKeywords: ['jurídico', 'compliance', 'dpo', 'diretoria'],
        sampleCards: [
          {
            title: 'DSAR-LGPD-012',
            origin: 'Portal de Privacidade',
            description: 'Solicitação de confirmação de tratamento de dados por ex-colaborador.',
            stage: 'Resposta ao Titular',
            priority: 'média',
            departmentKeyword: 'diretoria',
          },
        ],
      },
    ],
  },
  {
    id: 'preset-iso-45001',
    standardCode: '45001',
    name: 'ISO 45001:2018',
    subtitle: 'Saúde e Segurança Ocupacional (SSO)',
    badge: 'Saúde & Segurança no Trabalho',
    color: 'from-amber-600 to-rose-700',
    icon: 'HeartPulse',
    summary:
      'Pipes focados na prevenção de acidentes e bem-estar: Investigação de Acidentes/Quase-Acidentes, Identificação de Perigos e Riscos (APR), Inspeções de Segurança e EPIs, Consulta e CIPA e Gestão de Saúde Ocupacional (PCMSO).',
    pipesCount: 5,
    pipes: [
      {
        code: '10.2-SST',
        title: '10.2 Investigação de Incidentes, Quase-Acidentes e Doenças',
        description:
          'Comunicação de CAT, investigação imediata de causas, árvore de causas e plano de prevenção de reincidência.',
        icon: 'AlertCircle',
        color: 'bg-rose-600 text-white',
        order: 1,
        stages: [
          'Relato / Quase-Acidente',
          'Atendimento & CAT',
          'Investigação de Causa Raiz',
          'Plano de Prevenção',
          'Eficácia Comprovada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'saúde', 'obras'],
        sampleCards: [
          {
            title: 'INC-SST-032',
            origin: 'SESMT / CIPA',
            description: 'Quase-acidente com rompimento de cinta de içamento de carga no pátio.',
            stage: 'Plano de Prevenção',
            priority: 'crítica',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '6.1.2-SST',
        title: '6.1.2 Identificação de Perigos e Avaliação de Riscos (APR)',
        description:
          'Elaboração de Análise Preliminar de Risco (APR), Permissões de Trabalho (PT) para atividades críticas e hierarquia de controle.',
        icon: 'Compass',
        color: 'bg-amber-600 text-white',
        order: 2,
        stages: [
          'Solicitação de APR / PT',
          'Inspeção Pré-Tarefa',
          'Aprovação Engenheiro SST',
          'Trabalho em Execução',
          'PT Encerrada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'obras', 'engenharia'],
        sampleCards: [
          {
            title: 'APR-ALTURA-084',
            origin: 'Frente de Montagem',
            description: 'Trabalho em altura com andaime fachadeiro e linha de vida.',
            stage: 'Trabalho em Execução',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '8.1.2-EPI',
        title: '8.1.2 Gestão de EPIs, EPCs e Inspeções de Segurança',
        description:
          'Ficha de entrega de EPI com CA válido, inspeção de extintores, guarda-corpos e checagem de condições inseguras.',
        icon: 'Hammer',
        color: 'bg-orange-600 text-white',
        order: 3,
        stages: [
          'Inspeção Realizada',
          'Desvio Apontado',
          'Correção Imediata',
          'Substituição de EPI',
          'Conforme',
        ],
        suggestedDepartmentKeywords: ['suprimentos', 'almoxarifado', 'segurança', 'sesmt'],
        sampleCards: [
          {
            title: 'INSP-EPI-019',
            origin: 'Técnico de Segurança',
            description: 'Substituição de capacetes com jugular e talabartes com absorvedor.',
            stage: 'Conforme',
            priority: 'média',
            departmentKeyword: 'suprimentos',
          },
        ],
      },
      {
        code: '5.4-CIPA',
        title: '5.4 Consulta, Participação dos Trabalhadores & CIPA',
        description:
          'Reuniões mensais da CIPA, SIPAT, DDS diários, sugestões de ergonomia e canais de recusa ao trabalho inseguro.',
        icon: 'Handshake',
        color: 'bg-yellow-600 text-white',
        order: 4,
        stages: [
          'Pauta Levantada',
          'Reunião Ordinária CIPA',
          'Plano de Melhoria',
          'Execução do DDS / SIPAT',
          'Ata Aprovada',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'rh', 'recursos humanos', 'cipa'],
        sampleCards: [
          {
            title: 'CIPA-ATA-08',
            origin: 'Comitê CIPA',
            description:
              'Adequação ergonômica dos postos de trabalho e iluminação do almoxarifado.',
            stage: 'Plano de Melhoria',
            priority: 'média',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: '8.1-PCMSO',
        title: '8.1 Gestão de Saúde Ocupacional & Exames (ASO/PCMSO)',
        description:
          'Controle de ASOs admissionais, periódicos e demissionais, exames complementares e ergonomia.',
        icon: 'UserCheck',
        color: 'bg-emerald-600 text-white',
        order: 5,
        stages: [
          'Exame a Vencer (30d)',
          'Guia Emitida',
          'Atendimento Clínico',
          'ASO Homologado (Apto)',
          'Registrado no eSocial',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'sesmt', 'saúde'],
        sampleCards: [
          {
            title: 'ASO-PER-2026',
            origin: 'Medicina do Trabalho',
            description: 'Lote de 18 exames periódicos para equipe operacional.',
            stage: 'ASO Homologado (Apto)',
            priority: 'alta',
            departmentKeyword: 'rh',
          },
        ],
      },
    ],
  },
  {
    id: 'preset-nr-1',
    standardCode: 'NR1',
    name: 'NR-1 (GRO / PGR)',
    subtitle: 'Gerenciamento de Riscos Ocupacionais e PGR',
    badge: 'Norma Regulamentadora Obrigatória',
    color: 'from-red-600 to-amber-700',
    icon: 'ShieldAlert',
    summary:
      'Fluxos obrigatórios do Ministério do Trabalho: Inventário de Riscos Ocupacionais (Físicos, Químicos, Biológicos, Ergonômicos e Acidentes), Plano de Ação do PGR, Treinamentos Obrigatórios e Acompanhamento de Medidas Preventivas.',
    pipesCount: 4,
    pipes: [
      {
        code: 'NR1-GRO',
        title: 'NR-1 Inventário de Riscos Ocupacionais (GRO)',
        description:
          'Mapeamento por GHE (Grupo Homogêneo de Exposição), classificação de severidade e probabilidade.',
        icon: 'Compass',
        color: 'bg-red-600 text-white',
        order: 1,
        stages: [
          'GHE Levantado',
          'Avaliação Quali/Quantitativa',
          'Matriz de Risco NR-1',
          'Controle Proposto',
          'Inventário Consolidado',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'engenharia', 'obras'],
        sampleCards: [
          {
            title: 'GRO-GHE-03',
            origin: 'Engenharia de Segurança',
            description:
              'Avaliação de ruído contínuo e vibração de mãos e braços no corte de estruturas.',
            stage: 'Controle Proposto',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: 'NR1-PGR',
        title: 'NR-1 Plano de Ação do PGR (Implementação)',
        description:
          'Cronograma de implantação de medidas de prevenção, responsáveis, prazos e avaliação periódica do PGR.',
        icon: 'Target',
        color: 'bg-amber-600 text-white',
        order: 2,
        stages: [
          'Ação Cadastrada',
          'Alocação de Recursos',
          'Em Execução',
          'Eficácia In Loco',
          'Ação Concluída',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'diretoria', 'obras'],
        sampleCards: [
          {
            title: 'PGR-ACAO-2026-05',
            origin: 'Coordenador SST',
            description: 'Instalação de exaustão localizada na bancada de solda.',
            stage: 'Em Execução',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: 'NR1-CAPAC',
        title: 'NR-1 Matriz de Capacitação e Treinamentos Obrigatórios',
        description:
          'Gestão dos treinamentos iniciais, periódicos e eventuais previstos nas NRs, com controle de carga horária e emissão de certificados.',
        icon: 'UserCheck',
        color: 'bg-blue-600 text-white',
        order: 3,
        stages: [
          'Treinamento Previsto',
          'Turma Convocada',
          'Treinamento Concluído',
          'Avaliação de Aprendizado',
          'Certificado eSocial',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'sesmt', 'dho'],
        sampleCards: [
          {
            title: 'CAP-NR01-INTEG',
            origin: 'SESMT',
            description:
              'Treinamento de integração geral sobre riscos dos setores e medidas de segurança.',
            stage: 'Certificado eSocial',
            priority: 'média',
            departmentKeyword: 'rh',
          },
        ],
      },
      {
        code: 'NR1-ANALISE',
        title: 'NR-1 Acompanhamento de Saúde e Auditoria do PGR',
        description:
          'Revisão bienal do PGR (ou trienal para certificados ISO 45001) e correlação com dados de afastamento.',
        icon: 'BarChart3',
        color: 'bg-indigo-600 text-white',
        order: 4,
        stages: [
          'Coleta de Dados de Saúde',
          'Análise de Desvios',
          'Revisão do PGR',
          'Homologação Responsável Técnico',
          'PGR Vigente',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'saúde', 'diretoria'],
        sampleCards: [
          {
            title: 'REV-PGR-ANUAL',
            origin: 'Responsável Técnico SST',
            description: 'Revisão das medidas de prevenção após alterações de layout fabril.',
            stage: 'PGR Vigente',
            priority: 'alta',
            departmentKeyword: 'segurança',
          },
        ],
      },
    ],
  },
  {
    id: 'preset-nr-27',
    standardCode: 'NR27',
    name: 'NR-27 (Qualificação & Registros)',
    subtitle: 'Registro Profissional e Segurança Operacional',
    badge: 'Conformidade Regulatória & Técnica',
    color: 'from-cyan-700 to-blue-900',
    icon: 'FileCheck2',
    summary:
      'Pipes de conformidade operacional e técnica: Homologação de Registros Profissionais (CREA, CFT, CRM, OAB), Gestão de Responsabilidade Técnica (ART/RRT/TRT), Habilitação para Operações de Risco e Auditoria de Terceirizados.',
    pipesCount: 4,
    pipes: [
      {
        code: 'NR27-REG',
        title: 'NR-27 Homologação de Registros e Habilitações Profissionais',
        description:
          'Validação de diplomas, conselhos de classe (CREA/CFT/CRM), carteiras profissionais e capacitações formais.',
        icon: 'UserCheck',
        color: 'bg-cyan-700 text-white',
        order: 1,
        stages: [
          'Documento Enviado',
          'Checagem no Conselho de Classe',
          'Validação Técnica',
          'Profissional Habilitado',
          'Renovação Periódica',
        ],
        suggestedDepartmentKeywords: ['recursos humanos', 'rh', 'dho', 'engenharia'],
        sampleCards: [
          {
            title: 'HAB-ENG-MEC-01',
            origin: 'RH / DHO',
            description:
              'Validação da certidão de registro e quitação no CREA do engenheiro responsável.',
            stage: 'Profissional Habilitado',
            priority: 'alta',
            departmentKeyword: 'rh',
          },
        ],
      },
      {
        code: 'NR27-ART',
        title: 'NR-27 Emissão e Baixa de ART / RRT / TRT',
        description:
          'Controle de Anotações de Responsabilidade Técnica para projetos, obras, laudos e manutenções de máquinas.',
        icon: 'Receipt',
        color: 'bg-blue-700 text-white',
        order: 2,
        stages: [
          'Demanda de ART',
          'Elaboração / Registro no Conselho',
          'Taxa Paga & ART Emitida',
          'Vinculada ao Projeto/Obra',
          'Baixa por Conclusão',
        ],
        suggestedDepartmentKeywords: ['obras', 'engenharia', 'operações', 'diretoria'],
        sampleCards: [
          {
            title: 'ART-LAUDO-NR12',
            origin: 'Engenharia Mecânica',
            description: 'ART de apreciação de risco de prensas e máquinas operatrizes.',
            stage: 'Vinculada ao Projeto/Obra',
            priority: 'crítica',
            departmentKeyword: 'obras',
          },
        ],
      },
      {
        code: 'NR27-OP-RISCO',
        title: 'NR-27 Autorização para Operadores de Equipamentos Especiais',
        description:
          'Controle de habilitação para operadores de empilhadeiras, pontes rolantes, caldeiras e eletricistas qualificados.',
        icon: 'Hammer',
        color: 'bg-sky-700 text-white',
        order: 3,
        stages: [
          'Curso Concluído',
          'Atestado de Aptidão Física/Mental',
          'Crachá de Autorização Emitido',
          'Em Operação Liberada',
          'Reciclagem Anual',
        ],
        suggestedDepartmentKeywords: ['segurança', 'sesmt', 'suprimentos', 'operações'],
        sampleCards: [
          {
            title: 'AUT-EMPILH-04',
            origin: 'SESMT / Logística',
            description: 'Reciclagem e emissão de crachá para operador de empilhadeira a gás.',
            stage: 'Em Operação Liberada',
            priority: 'média',
            departmentKeyword: 'segurança',
          },
        ],
      },
      {
        code: 'NR27-TERC',
        title: 'NR-27 Auditoria de Qualificação Técnica de Fornecedores e Terceiros',
        description:
          'Verificação de documentação trabalhista, previdenciária e técnica de empresas prestadoras de serviço.',
        icon: 'Handshake',
        color: 'bg-teal-700 text-white',
        order: 4,
        stages: [
          'Documentos Solicitados',
          'Análise de Conformidade',
          'Homologação de Terceiro',
          'Prestação de Serviço Liberada',
          'Auditoria Mensal',
        ],
        suggestedDepartmentKeywords: ['suprimentos', 'jurídico', 'almoxarifado', 'diretoria'],
        sampleCards: [
          {
            title: 'TERC-ELETRICA-SP',
            origin: 'Suprimentos / Jurídico',
            description:
              'Auditoria documental mensal da terceirizada de manutenção elétrica predial.',
            stage: 'Prestação de Serviço Liberada',
            priority: 'alta',
            departmentKeyword: 'suprimentos',
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

  // 5. Send a congratulatory notification to the client
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
