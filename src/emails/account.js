const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'isaddorafreitasar@gmail.com',
        subject: "Obrigado por se inscrever :)",
        text: `Bem vindo ao site, ${name}. Me diga se está gostando!`
    })
}

const sendDeleteEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'isaddorafreitasar@gmail.com',
        subject: "OH! Não vá embora :(",
        text: `Por favor, diga por que está encerrando sua conta, gostaria de ajudar-lo(a) uma ultima vez ${name}...`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}