migrate(
  (app) => {
    // 1. Criar collection report_signatures para armazenar assinaturas digitais por certificação
    try {
      app.findCollectionByNameOrId('report_signatures')
      return // Já existe
    } catch (_) {}

    const usersColId = '_pb_users_auth_'
    const certsColId = app.findCollectionByNameOrId('certifications').id

    const collection = new Collection({
      name: 'report_signatures',
      type: 'base',
      // Permissões: cliente pode listar/ver suas assinaturas e assinar como RD da sua certificação;
      // admin/consultor pode listar/ver todas e assinar como auditor_lider
      listRule:
        "@request.auth.id != '' && (signer = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')",
      viewRule:
        "@request.auth.id != '' && (signer = @request.auth.id || certification.user = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'consultor')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (signer = @request.auth.id || @request.auth.role = 'admin')",
      deleteRule:
        "@request.auth.id != '' && (signer = @request.auth.id || @request.auth.role = 'admin')",
      fields: [
        {
          name: 'certification',
          type: 'relation',
          required: true,
          collectionId: certsColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'signer',
          type: 'relation',
          required: true,
          collectionId: usersColId,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'role_type',
          type: 'select',
          required: true,
          values: ['rd_empresa', 'auditor_lider'],
          maxSelect: 1,
        },
        {
          name: 'signer_name',
          type: 'text',
          required: true,
        },
        {
          name: 'signer_document', // CPF / CNPJ / Registro Auditor
          type: 'text',
        },
        {
          name: 'signer_position', // Cargo / Função (Ex: "Representante da Direção (RD)", "Auditor Líder INMETRO")
          type: 'text',
        },
        {
          name: 'signature_image', // Data URL do canvas de assinatura (base64)
          type: 'text',
        },
        {
          name: 'acceptance_hash', // Hash de autenticidade / carimbo digital SHA-256
          type: 'text',
        },
        {
          name: 'signed_at', // Data e hora do aceite digital
          type: 'date',
        },
        {
          name: 'ip_address',
          type: 'text',
        },
        {
          name: 'statement', // Texto do termo aceito
          type: 'text',
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
        'CREATE INDEX idx_rep_sig_cert ON report_signatures (certification)',
        'CREATE INDEX idx_rep_sig_role ON report_signatures (certification, role_type)',
      ],
    })

    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('report_signatures')
      app.delete(collection)
    } catch (_) {}
  },
)
