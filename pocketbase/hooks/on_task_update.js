onRecordAfterUpdateSuccess((e) => {
  const oldVal = e.record.original().getBool('completed')
  const newVal = e.record.getBool('completed')
  if (oldVal === newVal || !newVal) return e.next()

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
  const taskTitle = e.record.getString('title')
  const notifCol = $app.findCollectionByNameOrId('notifications')

  const targets = [userId]
  if (consultantId && consultantId !== userId) targets.push(consultantId)

  for (const targetId of targets) {
    if (!targetId) continue
    try {
      const notif = new Record(notifCol)
      notif.set('user', targetId)
      notif.set('certification', certId)
      notif.set('type', 'task_completed')
      notif.set('title', 'Tarefa concluída')
      notif.set('message', 'A tarefa "' + taskTitle + '" foi marcada como concluída.')
      notif.set('is_read', false)
      $app.save(notif)
    } catch (err) {
      $app.logger().error('notification failed', 'error', err.message)
    }
  }
  return e.next()
}, 'tasks')
