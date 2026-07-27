migrate(
  (app) => {
    const businessModels = new Collection({
      name: 'business_models',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_bm_name ON business_models (name)'],
    })
    app.save(businessModels)

    const templatesCol = new Collection({
      name: 'templates',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: null,
      fields: [
        {
          name: 'business_model',
          type: 'relation',
          required: true,
          collectionId: businessModels.id,
          maxSelect: 1,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['task', 'document', 'schedule'],
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'category',
          type: 'select',
          values: [
            'cotação',
            'controle de estoque',
            'renovação',
            'gestão de funcionários',
            'outro',
          ],
          maxSelect: 1,
        },
        { name: 'required', type: 'bool' },
        { name: 'due_days', type: 'number', min: 0, onlyInt: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_tpl_bm ON templates (business_model)'],
    })
    app.save(templatesCol)

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('cnpj')) {
      usersCol.fields.add(new TextField({ name: 'cnpj' }))
    }
    if (!usersCol.fields.getByName('business_model')) {
      usersCol.fields.add(
        new RelationField({
          name: 'business_model',
          collectionId: businessModels.id,
          maxSelect: 1,
        }),
      )
    }
    usersCol.addIndex('idx_users_cnpj', true, 'cnpj', "cnpj != ''")
    app.save(usersCol)

    const certsCol = app.findCollectionByNameOrId('certifications')
    if (!certsCol.fields.getByName('template_applied')) {
      certsCol.fields.add(new BoolField({ name: 'template_applied' }))
    }
    app.save(certsCol)
    app
      .db()
      .newQuery('UPDATE certifications SET template_applied = false WHERE template_applied IS NULL')
      .execute()
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('templates'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('business_models'))
    } catch (_) {}
    try {
      const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
      usersCol.removeIndex('idx_users_cnpj')
      app.save(usersCol)
    } catch (_) {}
    try {
      const certsCol = app.findCollectionByNameOrId('certifications')
      const ta = certsCol.fields.getByName('template_applied')
      if (ta) certsCol.fields.remove(ta)
      app.save(certsCol)
    } catch (_) {}
  },
)
