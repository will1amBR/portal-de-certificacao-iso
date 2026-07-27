onRecordAfterUpdateSuccess((e) => {
  const oldStatus = e.record.original().getString('status')
  const newStatus = e.record.getString('status')
  if (oldStatus === newStatus) return e.next()
  if (newStatus !== 'confirmado' && newStatus !== 'realizado') return e.next()

  const certId = e.record.getString('certification')
  if (!certId) return e.next()

  let cert
  try {
    cert = $app.findRecordById('certifications', certId)
  } catch (_) {
    return e.next()
  }

  const userId = cert.getString('user')
  const consultantId = cert.getString('consultant')
  const schedType = e.record.getString('type')
  const schedDate = e.record.getString('date')
  const notifCol = $app.findCollectionByNameOrId('notifications')

  const type = newStatus === 'confirmado' ? 'audit_scheduled' : 'audit_completed'
  const title = newStatus === 'confirmado' ? 'Agendamento confirmado' : 'Agendamento realizado'
  const msg = schedType + ' de ' + schedDate + ' foi ' + newStatus + '.'

  const targets = [userId]
  if (consultantId && consultantId !== userId) targets.push(consultantId)

  for (const targetId of targets) {
    if (!targetId) continue
    try {
      const notif = new Record(notifCol)
      notif.set('user', targetId)
      notif.set('certification', certId)
      notif.set('type', type)
      notif.set('title', title)
      notif.set('message', msg)
      notif.set('is_read', false)
      $app.save(notif)
    } catch (err) {
      $app.logger().error('notification failed', 'error', err.message)
    }
  }
  return e.next()
}, 'schedules')
