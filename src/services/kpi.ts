import { IsoTask, getTasksByCertification } from './tasks'

export interface KpiDefinition {
  titleMatch: string
  iso: '9001' | '14001' | '45001'
  label: string
  targetDisplay: string
  targetValue: number
  direction: 'up' | 'down'
}

export interface KpiData {
  definition: KpiDefinition
  task: IsoTask
  currentValue: string
  status: 'atendendo' | 'em atenção' | 'fora do alvo'
}

const KPI_DEFINITIONS: KpiDefinition[] = [
  {
    titleMatch: 'não conformidade',
    iso: '9001',
    label: 'Não Conformidades Abertas',
    targetDisplay: '≤ 5',
    targetValue: 5,
    direction: 'down',
  },
  {
    titleMatch: 'satisfação do cliente',
    iso: '9001',
    label: 'Satisfação do Cliente',
    targetDisplay: '≥ 85%',
    targetValue: 85,
    direction: 'up',
  },
  {
    titleMatch: 'entrega no prazo',
    iso: '9001',
    label: 'Entregas no Prazo',
    targetDisplay: '≥ 90%',
    targetValue: 90,
    direction: 'up',
  },
  {
    titleMatch: 'consumo de energia',
    iso: '14001',
    label: 'Consumo de Energia',
    targetDisplay: '≤ 5000 kWh/mês',
    targetValue: 5000,
    direction: 'down',
  },
  {
    titleMatch: 'destinação de resíduos',
    iso: '14001',
    label: 'Resíduos Destinados',
    targetDisplay: '≥ 90%',
    targetValue: 90,
    direction: 'up',
  },
  {
    titleMatch: 'consumo de água',
    iso: '14001',
    label: 'Consumo de Água',
    targetDisplay: '≤ 400 m³/mês',
    targetValue: 400,
    direction: 'down',
  },
  {
    titleMatch: 'conformidade com requisitos legais',
    iso: '14001',
    label: 'Conformidade Legal',
    targetDisplay: '≥ 95%',
    targetValue: 95,
    direction: 'up',
  },
  {
    titleMatch: 'frequência de acidentes',
    iso: '45001',
    label: 'TFA - Taxa de Frequência',
    targetDisplay: '≤ 3,0',
    targetValue: 3.0,
    direction: 'down',
  },
  {
    titleMatch: 'gravidade de acidentes',
    iso: '45001',
    label: 'TG - Taxa de Gravidade',
    targetDisplay: '≤ 1,0',
    targetValue: 1.0,
    direction: 'down',
  },
  {
    titleMatch: 'quase-acidentes',
    iso: '45001',
    label: 'Quase-acidentes',
    targetDisplay: '≤ 10',
    targetValue: 10,
    direction: 'down',
  },
  {
    titleMatch: 'treinamento de segurança',
    iso: '45001',
    label: 'Treinamentos Concluídos',
    targetDisplay: '≥ 90%',
    targetValue: 90,
    direction: 'up',
  },
]

function extractValue(description: string): number | null {
  const matches = description.match(/(\d[\d.,]*)/g)
  if (!matches || matches.length === 0) return null
  let str = matches[matches.length - 1]
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.')
  } else if (str.includes('.')) {
    const parts = str.split('.')
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      str = str.replace(/\./g, '')
    }
  }
  return parseFloat(str)
}

function extractDisplayValue(description: string): string {
  const idx = description.lastIndexOf(':')
  if (idx >= 0) return description.substring(idx + 1).trim()
  return description
}

function determineStatus(value: number | null, def: KpiDefinition): KpiData['status'] {
  if (value === null) return 'em atenção'
  if (def.direction === 'up') {
    if (value >= def.targetValue) return 'atendendo'
    if (value >= def.targetValue * 0.9) return 'em atenção'
    return 'fora do alvo'
  }
  if (value <= def.targetValue) return 'atendendo'
  if (value <= def.targetValue * 1.1) return 'em atenção'
  return 'fora do alvo'
}

function matchTaskToKpi(task: IsoTask): KpiDefinition | undefined {
  const lower = task.title.toLowerCase()
  return KPI_DEFINITIONS.find((def) => lower.includes(def.titleMatch))
}

export async function getKpisForCertifications(certIds: string[]): Promise<KpiData[]> {
  if (certIds.length === 0) return []
  const taskLists = await Promise.all(certIds.map((id) => getTasksByCertification(id)))
  const allTasks = taskLists.flat()
  const kpis: KpiData[] = []
  for (const task of allTasks) {
    const def = matchTaskToKpi(task)
    if (!def) continue
    kpis.push({
      definition: def,
      task,
      currentValue: extractDisplayValue(task.description || ''),
      status: determineStatus(extractValue(task.description || ''), def),
    })
  }
  return kpis
}

export function groupKpisByIso(kpis: KpiData[]): Record<string, KpiData[]> {
  return {
    '9001': kpis.filter((k) => k.definition.iso === '9001'),
    '14001': kpis.filter((k) => k.definition.iso === '14001'),
    '45001': kpis.filter((k) => k.definition.iso === '45001'),
  }
}
