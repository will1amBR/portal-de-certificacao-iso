migrate(
  (app) => {
    // 1. users: role cliente só lê/edita a si próprio; admin e consultor podem ver todos
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    usersCol.listRule =
      "@request.auth.id != '' && (@request.auth.id = id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    usersCol.viewRule =
      "@request.auth.id != '' && (@request.auth.id = id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    app.save(usersCol)

    // 2. certifications: role cliente só vê e edita as suas; admin e consultor vêem todas
    const certsCol = app.findCollectionByNameOrId('certifications')
    certsCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || consultant = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    certsCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || consultant = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    certsCol.createRule = "@request.auth.id != ''"
    certsCol.updateRule =
      "@request.auth.id != '' && (user = @request.auth.id || consultant = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    certsCol.deleteRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin')"
    app.save(certsCol)

    // 3. documents: role cliente só vê documentos da sua certificação ou criados por si
    const docsCol = app.findCollectionByNameOrId('documents')
    docsCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    docsCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    docsCol.createRule = "@request.auth.id != ''"
    docsCol.updateRule =
      "@request.auth.id != '' && (user = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    docsCol.deleteRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    app.save(docsCol)

    // 4. tasks: role cliente só vê tarefas de certificações da sua empresa
    const tasksCol = app.findCollectionByNameOrId('tasks')
    tasksCol.listRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    tasksCol.viewRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    tasksCol.createRule = "@request.auth.id != ''"
    tasksCol.updateRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    tasksCol.deleteRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    app.save(tasksCol)

    // 5. schedules: role cliente só vê agendamentos de certificações da sua empresa
    const schedCol = app.findCollectionByNameOrId('schedules')
    schedCol.listRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    schedCol.viewRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    schedCol.createRule = "@request.auth.id != ''"
    schedCol.updateRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    schedCol.deleteRule =
      "@request.auth.id != '' && (certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    app.save(schedCol)

    // 6. messages: role cliente só vê mensagens da sua certificação ou enviadas por si
    const msgsCol = app.findCollectionByNameOrId('messages')
    msgsCol.listRule =
      "@request.auth.id != '' && (sender = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    msgsCol.viewRule =
      "@request.auth.id != '' && (sender = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    msgsCol.createRule = "@request.auth.id != ''"
    msgsCol.updateRule =
      "@request.auth.id != '' && (sender = @request.auth.id || @request.auth.role = 'admin')"
    msgsCol.deleteRule =
      "@request.auth.id != '' && (sender = @request.auth.id || @request.auth.role = 'admin')"
    app.save(msgsCol)

    // 7. pipe_cards: role cliente só vê cards da sua empresa/certificação; admin e consultores vêem todos
    const cardsCol = app.findCollectionByNameOrId('pipe_cards')
    cardsCol.listRule =
      "@request.auth.id != '' && (user = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    cardsCol.viewRule =
      "@request.auth.id != '' && (user = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    cardsCol.createRule = "@request.auth.id != ''"
    cardsCol.updateRule =
      "@request.auth.id != '' && (user = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    cardsCol.deleteRule =
      "@request.auth.id != '' && (user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')"
    app.save(cardsCol)
  },
  (app) => {
    // Down migration: reverter para regras abertas a qualquer autenticado
    const cols = ['certifications', 'documents', 'tasks', 'schedules', 'messages', 'pipe_cards']
    for (const name of cols) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = "@request.auth.id != ''"
        col.viewRule = "@request.auth.id != ''"
        app.save(col)
      } catch (_) {}
    }
  },
)
