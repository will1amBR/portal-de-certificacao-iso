import pb from '@/lib/pocketbase/client'

export interface IsoSchedule {
  id: string
  certification: string
  type: 'auditoria' | 'reunião'
  date: string
  notes?: string
  status: 'solicitado' | 'confirmado' | 'cancelado' | 'realizado'
  created: string
  updated: string
  expand?: {
    certification?: {
      id: string
      company_name?: string
      expand?: { iso_type?: { code: string; name: string } }
    }
  }
}

export const getSchedules = () =>
  pb.collection('schedules').getFullList<IsoSchedule>({
    sort: 'date',
    expand: 'certification.iso_type',
  })

export const getSchedulesByCertification = (certificationId: string) =>
  pb.collection('schedules').getFullList<IsoSchedule>({
    filter: `certification = "${certificationId}"`,
    sort: 'date',
  })

export const createSchedule = (data: {
  certification: string
  type: 'auditoria' | 'reunião'
  date: string
  notes?: string
}) =>
  pb.collection('schedules').create<IsoSchedule>({
    certification: data.certification,
    type: data.type,
    date: data.date,
    notes: data.notes || '',
    status: 'solicitado',
  })

export const updateScheduleStatus = (id: string, status: IsoSchedule['status']) =>
  pb.collection('schedules').update<IsoSchedule>(id, { status })
