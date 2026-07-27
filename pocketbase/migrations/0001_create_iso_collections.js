migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    const isoTypes = new Collection({
      name: 'iso_types',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'code', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(isoTypes)

    const certifications = new Collection({
      name: 'certifications',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: users.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'iso_type',
          type: 'relation',
          required: true,
          collectionId: isoTypes.id,
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: [
            'não iniciado',
            'em andamento',
            'pendente de documentos',
            'aguardando auditoria',
            'concluído',
          ],
          maxSelect: 1,
        },
        { name: 'progress', type: 'number', min: 0, max: 100 },
        { name: 'consultant', type: 'relation', collectionId: users.id, maxSelect: 1 },
        { name: 'start_date', type: 'date' },
        { name: 'company_name', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_cert_user ON certifications (user)',
        'CREATE INDEX idx_cert_status ON certifications (status)',
      ],
    })
    app.save(certifications)

    const documents = new Collection({
      name: 'documents',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'certification',
          type: 'relation',
          required: true,
          collectionId: certifications.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'user', type: 'relation', required: true, collectionId: users.id, maxSelect: 1 },
        { name: 'name', type: 'text', required: true },
        { name: 'required', type: 'bool' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pendente', 'enviado', 'aprovado', 'rejeitado'],
          maxSelect: 1,
        },
        { name: 'file', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'comment', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_doc_cert ON documents (certification)',
        'CREATE INDEX idx_doc_status ON documents (status)',
      ],
    })
    app.save(documents)

    const tasks = new Collection({
      name: 'tasks',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'certification',
          type: 'relation',
          required: true,
          collectionId: certifications.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'completed', type: 'bool' },
        { name: 'due_date', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_task_cert ON tasks (certification)'],
    })
    app.save(tasks)

    const schedules = new Collection({
      name: 'schedules',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'certification',
          type: 'relation',
          required: true,
          collectionId: certifications.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['auditoria', 'reunião'],
          maxSelect: 1,
        },
        { name: 'date', type: 'date', required: true },
        { name: 'notes', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['solicitado', 'confirmado', 'cancelado', 'realizado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_sched_cert ON schedules (certification)'],
    })
    app.save(schedules)

    const messages = new Collection({
      name: 'messages',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'certification',
          type: 'relation',
          required: true,
          collectionId: certifications.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'sender', type: 'relation', required: true, collectionId: users.id, maxSelect: 1 },
        { name: 'content', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(messages)
  },
  (app) => {
    const cols = ['messages', 'schedules', 'tasks', 'documents', 'certifications', 'iso_types']
    for (const c of cols) {
      try {
        const col = app.findCollectionByNameOrId(c)
        app.delete(col)
      } catch (_) {}
    }
  },
)
