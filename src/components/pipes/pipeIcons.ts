import {
  SquarePen,
  FileText,
  Handshake,
  Compass,
  Target,
  Hammer,
  UserCheck,
  User,
  Receipt,
  MessageSquare,
  MapPin,
  BarChart3,
  BarChart2,
  FolderGit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Leaf,
  Lock,
  HeartPulse,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react'

export const PIPE_ICON_MAP: Record<string, any> = {
  SquarePen,
  FileText,
  Handshake,
  Compass,
  Target,
  Hammer,
  UserCheck,
  User,
  Receipt,
  MessageSquare,
  MapPin,
  BarChart3,
  BarChart2,
  FolderGit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Leaf,
  Lock,
  HeartPulse,
  ShieldAlert,
  FileCheck2,
}

export function getPipeIcon(iconName?: string) {
  if (!iconName) return SquarePen
  return PIPE_ICON_MAP[iconName] || HelpCircle
}

export function getPipeHeaderColor(code?: string, customColor?: string) {
  if (customColor) return customColor

  switch (code) {
    case '10.2':
      return 'bg-blue-600 text-white'
    case '10.3':
      return 'bg-indigo-600 text-white'
    case '5.4':
      return 'bg-purple-600 text-white'
    case '6.1':
      return 'bg-sky-600 text-white'
    case '6.3':
      return 'bg-blue-700 text-white'
    case '7.1.5':
      return 'bg-blue-600 text-white'
    case '7.2-SOL':
      return 'bg-orange-500 text-white'
    case '7.2':
      return 'bg-blue-600 text-white'
    case '7.5':
      return 'bg-blue-600 text-white'
    case '8.2':
      return 'bg-blue-600 text-white'
    case '8.5':
      return 'bg-lime-600 text-white'
    case '9.1-AN':
      return 'bg-amber-500 text-white'
    case '9.1-SAT':
    case '9.1':
      return 'bg-blue-600 text-white'
    default:
      return 'bg-blue-600 text-white'
  }
}

export function getPipeBgCard(code?: string) {
  switch (code) {
    case '10.2':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    case '10.3':
      return 'bg-indigo-50/70 border-indigo-100 hover:border-indigo-300'
    case '5.4':
      return 'bg-purple-50/70 border-purple-100 hover:border-purple-300'
    case '6.1':
      return 'bg-sky-50/70 border-sky-100 hover:border-sky-300'
    case '6.3':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    case '7.1.5':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    case '7.2-SOL':
      return 'bg-orange-50/70 border-orange-100 hover:border-orange-300'
    case '7.2':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    case '7.5':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    case '8.2':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    case '8.5':
      return 'bg-lime-50/70 border-lime-100 hover:border-lime-300'
    case '9.1-AN':
      return 'bg-amber-50/70 border-amber-100 hover:border-amber-300'
    case '9.1-SAT':
      return 'bg-blue-50/70 border-blue-100 hover:border-blue-300'
    default:
      return 'bg-slate-50 border-slate-200 hover:border-slate-300'
  }
}
