// pocketbase/hooks/auth_rate_limit.js
// Rate limiting, mitigação de brute force e headers de segurança para autenticação

onRecordAuthWithPasswordRequest((e) => {
  const collectionName = e.collection ? e.collection.name : ''
  if (collectionName !== 'users') {
    return e.next()
  }

  // Adiciona headers de segurança na resposta
  const res = e.response
  if (res && res.header) {
    res.header().set('X-Content-Type-Options', 'nosniff')
    res.header().set('X-Frame-Options', 'DENY')
    res.header().set('X-XSS-Protection', '1; mode=block')
    res.header().set('Referrer-Policy', 'strict-origin-when-cross-origin')
  }

  const info = e.requestInfo()
  const headers = info ? info.headers || {} : {}
  const ip =
    headers['x-forwarded-for'] ||
    headers['cf-connecting-ip'] ||
    headers['x-real-ip'] ||
    'global_client'

  const clientKey = 'rl_auth_' + String(ip).split(',')[0].trim()
  const now = Date.now()
  const windowMs = 60 * 1000 // janela de 1 minuto
  const maxAttemptsPerMinute = 25 // limite seguro contra ataques automatizados de força bruta

  let state = null
  try {
    const raw = $app.store().get(clientKey)
    if (raw) {
      state = JSON.parse(raw)
    }
  } catch (_) {}

  if (!state || now - state.start > windowMs) {
    state = { start: now, attempts: 1 }
  } else {
    state.attempts++
  }

  try {
    $app.store().set(clientKey, JSON.stringify(state))
  } catch (_) {}

  if (res && res.header) {
    res.header().set('X-RateLimit-Limit', String(maxAttemptsPerMinute))
    res
      .header()
      .set('X-RateLimit-Remaining', String(Math.max(0, maxAttemptsPerMinute - state.attempts)))
  }

  if (state.attempts > maxAttemptsPerMinute) {
    return e.json(429, {
      code: 429,
      message: 'Muitas tentativas consecutivas de autenticação. Por favor, aguarde 60 segundos.',
    })
  }

  return e.next()
}, 'users')
