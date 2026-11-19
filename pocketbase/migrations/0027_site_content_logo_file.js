/* Adiciona o campo de arquivo "logo" à coleção site_content, permitindo upload
   direto do logo da certificadora (com alternativa à URL externa). */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_content')
    if (!col.fields.getByName('logo')) {
      col.fields.add(
        new FileField({
          name: 'logo',
          maxSelect: 1,
          maxSize: 2097152,
          mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
          thumbs: ['100x100', '300x300'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('site_content')
    if (col.fields.getByName('logo')) {
      col.fields.removeByName('logo')
    }
    app.save(col)
  },
)
