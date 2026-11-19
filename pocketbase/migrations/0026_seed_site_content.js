migrate(
  (app) => {
    // Seeds idempotentes do conteúdo gerenciável da landing.
    // Em banco vazio ou já semeado, a migração é no-op seguro.
    const seeds = [
      {
        section: 'metrics',
        data: JSON.stringify([
          { value: '-60%', label: 'Tempo de Adequação' },
          { value: '100%', label: 'Conformidade Normativa' },
          { value: '3 Normas', label: '9001 • 14001 • 45001' },
        ]),
      },
      {
        section: 'testimonials',
        data: JSON.stringify([
          {
            quote:
              'Conseguimos organizar toda a documentação da obra em uma semana. Na auditoria, não faltou um único documento.',
            name: 'Marcos T.',
            role: 'Diretor, Construtora Horizonte',
          },
          {
            quote:
              'O portal eliminou as planilhas paralelas. Cada cláusula vira um card no Kanban, com responsável e prazo claros.',
            name: 'Fernanda L.',
            role: 'Coordenadora de Qualidade, Varejo',
          },
          {
            quote:
              'Como certificadora, ganhamos visibilidade total do pipeline de clientes e das não conformidades em aberto.',
            name: 'Ricardo M.',
            role: 'Auditor Líder, ALC Certificadora',
          },
        ]),
      },
      {
        section: 'team',
        data: JSON.stringify({
          headline:
            'Décadas de experiência em certificações ISO, auditorias e consultoria técnica. Quem responde você dentro do portal é gente que já conduziu centenas de auditorias.',
          members: [
            {
              name: 'João Silva',
              role: 'Fundador e CEO',
              bio: 'Mais de 20 anos liderando certificações ISO para empresas de todos os portes.',
              img: 'https://img.usecurling.com/ppl/large?gender=male&seed=10',
            },
            {
              name: 'Cauli',
              role: 'Auditor Líder e Consultor Sênior',
              bio: 'Especialista em auditoria e conformidade com ampla experiência em auditorias ISO 9001, 14001 e 45001.',
              img: 'https://img.usecurling.com/ppl/large?gender=male&seed=20',
            },
            {
              name: 'Roberto Lima',
              role: 'Diretor Técnico',
              bio: 'Engenheiro de segurança com ampla atuação em ISO 45001, NRs e gestão de riscos ocupacionais.',
              img: 'https://img.usecurling.com/ppl/large?gender=male&seed=30',
            },
          ],
        }),
      },
      {
        section: 'branding',
        data: JSON.stringify({
          orgName: 'ALC Certificadora',
          logoUrl: '',
        }),
      },
    ]

    const col = app.findCollectionByNameOrId('site_content')

    for (const seed of seeds) {
      // Idempotência: já existe registro desta seção? então não mexe.
      const existing = app.findRecordsByFilter(
        'site_content',
        "section = '" + seed.section + "'",
        '',
        1,
        0,
      )
      if (existing.length > 0) {
        continue
      }
      const record = new Record(col)
      record.set('section', seed.section)
      record.set('data', seed.data)
      app.save(record)
    }
  },
  (app) => {
    // down: remove os seeds padrão apenas se ainda não foram editados
    const defaults = ['metrics', 'testimonials', 'team', 'branding']
    for (const section of defaults) {
      try {
        const rows = app.findRecordsByFilter(
          'site_content',
          "section = '" + section + "'",
          '',
          1,
          0,
        )
        if (rows.length > 0) {
          app.delete(rows[0])
        }
      } catch (_) {}
    }
  },
)
