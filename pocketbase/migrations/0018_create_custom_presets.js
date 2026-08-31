migrate(
  (app) => {
    // 1. Create custom_presets collection for auditor tailored pipe bundles
    const collection = new Collection({
      name: 'custom_presets',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'standardCode',
          type: 'text',
        },
        {
          name: 'badge',
          type: 'text',
        },
        {
          name: 'color',
          type: 'text',
        },
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'summary',
          type: 'text',
        },
        {
          name: 'pipes',
          type: 'json',
          required: true,
          maxSize: 1048576,
        },
        {
          name: 'pipesCount',
          type: 'number',
        },
        {
          name: 'author',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        {
          name: 'is_public',
          type: 'bool',
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: [
        'CREATE INDEX idx_custom_presets_author ON custom_presets (author)',
        'CREATE INDEX idx_custom_presets_code ON custom_presets (standardCode)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('custom_presets')
      app.delete(collection)
    } catch (_) {}
  },
)
