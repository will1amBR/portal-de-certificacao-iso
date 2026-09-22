migrate(
  (app) => {
    // Fortalecimento das regras de segurança e isolamento por empresa
    // 1. pipes: apenas usuários autenticados podem ler; escrita restrita a admin e consultores
    const pipesCol = app.findCollectionByNameOrId('pipes')
    pipesCol.listRule = "@request.auth.id != ''"
    pipesCol.viewRule = "@request.auth.id != ''"
    pipesCol.createRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    pipesCol.updateRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    pipesCol.deleteRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    app.save(pipesCol)

    // 2. custom_presets: apenas admin e consultores podem criar/atualizar/excluir pre-sets
    const presetsCol = app.findCollectionByNameOrId('custom_presets')
    presetsCol.listRule = "@request.auth.id != ''"
    presetsCol.viewRule = "@request.auth.id != ''"
    presetsCol.createRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    presetsCol.updateRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    presetsCol.deleteRule =
      "@request.auth.id != '' && (author = @request.auth.id || @request.auth.role = 'admin')"
    app.save(presetsCol)

    // 3. business_models: leitura para autenticados, escrita exclusiva para admin
    const bmCol = app.findCollectionByNameOrId('business_models')
    bmCol.listRule = "@request.auth.id != ''"
    bmCol.viewRule = "@request.auth.id != ''"
    bmCol.createRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    bmCol.updateRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    bmCol.deleteRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    app.save(bmCol)

    // 4. templates: leitura para autenticados, escrita restrita a admin e consultores
    const tplCol = app.findCollectionByNameOrId('templates')
    tplCol.listRule = "@request.auth.id != ''"
    tplCol.viewRule = "@request.auth.id != ''"
    tplCol.createRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    tplCol.updateRule =
      "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    tplCol.deleteRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    app.save(tplCol)

    // 5. iso_types: leitura para autenticados, mutação apenas por admin
    const isoCol = app.findCollectionByNameOrId('iso_types')
    isoCol.listRule = "@request.auth.id != ''"
    isoCol.viewRule = "@request.auth.id != ''"
    isoCol.createRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    isoCol.updateRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    isoCol.deleteRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    app.save(isoCol)
  },
  (app) => {
    // Reverter para regras anteriores se necessário
    const cols = ['pipes', 'custom_presets', 'business_models', 'templates', 'iso_types']
    for (const name of cols) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = "@request.auth.id != ''"
        col.viewRule = "@request.auth.id != ''"
        col.createRule = "@request.auth.id != ''"
        col.updateRule = "@request.auth.id != ''"
        col.deleteRule = "@request.auth.id != ''"
        app.save(col)
      } catch (_) {}
    }
  },
)
