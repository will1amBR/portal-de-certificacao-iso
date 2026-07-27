onRecordAfterCreateSuccess((e) => {
  const userId = e.record.getString('user')
  if (!userId) return e.next()

  let user
  try {
    user = $app.findRecordById('users', userId)
  } catch (_) {
    return e.next()
  }

  const email = user.getString('email')
  if (!email) return e.next()

  const title = e.record.getString('title')
  const message = e.record.getString('message')
  const certId = e.record.getString('certification')

  const siteUrl = $secrets.get('SITE_URL') || ''
  const link = certId ? siteUrl + '/certificacoes/' + certId : siteUrl

  try {
    const mailMessage = new MailerMessage({
      from: { name: 'Portal de Certificação ISO', address: 'noreply@portal-iso.com' },
      to: [{ address: email }],
      subject: title,
      html:
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
        '<div style="background: #003B73; padding: 16px; border-radius: 8px 8px 0 0;">' +
        '<h2 style="color: white; margin: 0; font-size: 18px;">Portal de Certificação ISO</h2>' +
        '</div>' +
        '<div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">' +
        '<h3 style="color: #003B73; margin: 0 0 12px 0;">' +
        title +
        '</h3>' +
        '<p style="color: #475569; font-size: 14px; line-height: 1.5;">' +
        message +
        '</p>' +
        (link
          ? '<a href="' +
            link +
            '" style="display: inline-block; background: #0055A4; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-size: 14px;">Ver detalhes</a>'
          : '') +
        '</div>' +
        '<p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">© ' +
        new Date().getFullYear() +
        ' Portal de Certificação ISO</p>' +
        '</div>',
      text: title + '\n\n' + message + '\n\n' + (link ? 'Acesse: ' + link : ''),
    })
    $app.newMailClient().send(mailMessage)
  } catch (err) {
    $app
      .logger()
      .warn(
        'Failed to send email notification',
        'error',
        err.message,
        'userId',
        userId,
        'notificationId',
        e.record.id,
      )
  }

  return e.next()
}, 'notifications')
