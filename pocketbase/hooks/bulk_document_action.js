routerAdd(
  'POST',
  '/backend/v1/documents/bulk-action',
  (e) => {
    const body = e.requestInfo().body || {}
    const ids = body.ids || []
    const action = body.action
    const comment = body.comment || ''

    if (!Array.isArray(ids) || ids.length === 0) return e.badRequestError('No documents selected')
    if (action !== 'approve' && action !== 'reject') return e.badRequestError('Invalid action')

    const status = action === 'approve' ? 'aprovado' : 'rejeitado'
    const notifType = action === 'approve' ? 'documents_bulk_approved' : 'documents_bulk_rejected'
    const notifTitle =
      action === 'approve' ? 'Documentos aprovados em lote' : 'Documentos rejeitados em lote'
    const userMap = {}

    for (const id of ids) {
      try {
        const doc = $app.findRecordById('documents', id)
        $app
          .db()
          .newQuery(
            'UPDATE documents SET status = {:status}, comment = {:comment} WHERE id = {:id}',
          )
          .bind({ status: status, comment: comment, id: id })
          .execute()

        const certId = doc.getString('certification')
        try {
          const cert = $app.findRecordById('certifications', certId)
          const uId = cert.getString('user')
          const cId = cert.getString('consultant')
          if (uId) {
            if (!userMap[uId]) userMap[uId] = { count: 0, certs: {} }
            userMap[uId].count++
            userMap[uId].certs[certId] = true
          }
          if (cId && cId !== uId) {
            if (!userMap[cId]) userMap[cId] = { count: 0, certs: {} }
            userMap[cId].count++
            userMap[cId].certs[certId] = true
          }
        } catch (_) {}
      } catch (_) {}
    }

    const notifCol = $app.findCollectionByNameOrId('notifications')
    for (const uId in userMap) {
      const data = userMap[uId]
      const certKeys = Object.keys(data.certs)
      try {
        const notif = new Record(notifCol)
        notif.set('user', uId)
        notif.set('type', notifType)
        notif.set('title', notifTitle)
        notif.set(
          'message',
          data.count +
            ' documento(s) ' +
            (action === 'approve' ? 'aprovado(s)' : 'rejeitado(s)') +
            '.',
        )
        notif.set('is_read', false)
        if (certKeys.length === 1) notif.set('certification', certKeys[0])
        $app.save(notif)
      } catch (_) {}
    }

    return e.json(200, { updated: ids.length })
  },
  $apis.requireAuth(),
)
