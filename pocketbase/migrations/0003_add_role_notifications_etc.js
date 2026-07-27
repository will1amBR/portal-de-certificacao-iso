migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!usersCol.fields.getByName('role')) {
      usersCol.fields.add(
        new SelectField({
          name: 'role',
          values: ['consultor', 'cliente', 'admin'],
          maxSelect: 1,
        }),
      )
    }
    usersCol.listRule = "@request.auth.id != ''"
    usersCol.viewRule = "@request.auth.id != ''"
    app.save(usersCol)

    app.db().newQuery("UPDATE users SET role = 'cliente' WHERE role = '' OR role IS NULL").execute()

    try {
      const william = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      william.set('role', 'admin')
      app.save(william)
    } catch (_) {}

    const docsCol = app.findCollectionByNameOrId('documents')
    if (!docsCol.fields.getByName('category')) {
      docsCol.fields.add(
        new SelectField({
          name: 'category',
          values: ['documentação', 'evidência', 'formulário', 'certificado', 'outro'],
          maxSelect: 1,
        }),
      )
      app.save(docsCol)
    }
    app
      .db()
      .newQuery("UPDATE documents SET category = 'outro' WHERE category = '' OR category IS NULL")
      .execute()

    const msgsCol = app.findCollectionByNameOrId('messages')
    if (!msgsCol.fields.getByName('is_read')) {
      msgsCol.fields.add(new BoolField({ name: 'is_read' }))
    }
    if (!msgsCol.fields.getByName('attachment')) {
      msgsCol.fields.add(new FileField({ name: 'attachment', maxSelect: 1, maxSize: 10485760 }))
    }
    app.save(msgsCol)
    app.db().newQuery('UPDATE messages SET is_read = false WHERE is_read IS NULL').execute()

    const certsCol = app.findCollectionByNameOrId('certifications')
    const notifCol = new Collection({
      name: 'notifications',
      type: 'base',
      listRule: '@request.auth.id = user',
      viewRule: '@request.auth.id = user',
      createRule: "@request.auth.id != ''",
      updateRule: '@request.auth.id = user',
      deleteRule: '@request.auth.id = user',
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: usersCol.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'certification', type: 'relation', collectionId: certsCol.id, maxSelect: 1 },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: [
            'document_approved',
            'document_rejected',
            'task_assigned',
            'task_completed',
            'audit_scheduled',
            'audit_completed',
            'message_received',
            'documents_bulk_approved',
            'documents_bulk_rejected',
          ],
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'message', type: 'text', required: true },
        { name: 'is_read', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_notif_user ON notifications (user)',
        'CREATE INDEX idx_notif_read ON notifications (is_read)',
      ],
    })
    app.save(notifCol)

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'alc@korenambiental.com')
    } catch (_) {
      const alc = new Record(usersCol)
      alc.setEmail('alc@korenambiental.com')
      alc.setPassword('Skip@Pass')
      alc.setVerified(true)
      alc.set('name', 'Certificadora ALC')
      alc.set('role', 'admin')
      app.save(alc)
    }
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('notifications'))
    } catch (_) {}
    try {
      const alc = app.findAuthRecordByEmail('_pb_users_auth_', 'alc@korenambiental.com')
      app.delete(alc)
    } catch (_) {}
  },
)
