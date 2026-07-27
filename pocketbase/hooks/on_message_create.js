onRecordAfterCreateSuccess((e) => {
  const senderId = e.record.getString('sender')
  const certId = e.record.getString('certification')
  if (!certId || !senderId) return e.next()

  let cert
  try {
    cert = $app.findRecordById('certifications', certId)
  } catch (_) {
    return e.next()
  }

  const userId = cert.getString('user')
  const consultantId = cert.getString('consultant')
  const notifCol = $app.findCollectionByNameOrId('notifications')

  const targets = []
  if (senderId === userId) {
    if (consultantId) targets.push(consultantId)
  } else if (senderId === consultantId) {
    if (userId) targets.push(userId)
  } else {
    if (userId) targets.push(userId)
    if (consultantId) targets.push(consultantId)
  }

  for (const targetId of targets) {
    if (!targetId) continue
    try {
      const notif = new Record(notifCol)
      notif.set('user', targetId)
      notif.set('certification', certId)
      notif.set('type', 'message_received')
      notif.set('title', 'Nova mensagem recebida')
      notif.set('message', 'Você recebeu uma nova mensagem na certificação.')
      notif.set('is_read', false)
      $app.save(notif)
    } catch (err) {
      $app.logger().error('notification failed', 'error', err.message)
    }
  }
  return e.next()
}, 'messages')
