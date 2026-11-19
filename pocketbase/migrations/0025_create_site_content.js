migrate(
  (app) => {
    // Coleção de conteúdo gerenciável da landing page.
    // Estrutura: um registro por seção editável (depoimentos, metricas, time, branding).
    const collection = new Collection({
      name: 'site_content',
      type: 'base',
      // Leitura pública e aberta: a landing precisa renderizar sem login
      // e sem expor nenhum dado sensível (o conteúdo é 100% de marketing).
      listRule: '',
      viewRule: '',
      // Somente admin edita conteúdo do site. Auditor (consultor) não edita.
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'section', type: 'text', required: true },
        // JSON com o conteúdo da seção (array de depoimentos, linhas de métricas etc.)
        { name: 'data', type: 'json', maxSize: 5242880 },
        { name: 'updated_by', type: 'relation', maxSelect: 1, collectionId: '_pb_users_auth_' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_site_content_section ON site_content (section)'],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('site_content')
      app.delete(collection)
    } catch (_) {}
  },
)
