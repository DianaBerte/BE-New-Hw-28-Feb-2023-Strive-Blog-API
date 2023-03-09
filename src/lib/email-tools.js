import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendsRegistrationEmail = async recipientAdress => {
    const msg = {
        to: recipientAdress,
        from: process.env.SENDER_EMAIL_ADDRESS,
        subject: "First email sent!",
        text: "Hello, this is a test",
        html: "Yay, this is working!",
    }
    await sgMail.send(msg)
}

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//     to: 'diana.berte@hotmail.it', // Change to your recipient
//     from: 'dianaberte.go@gmail.com', // Change to your verified sender
//     subject: 'TEST Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//     .send(msg)
//     .then(() => {
//         console.log('Email sent')
//     })
//     .catch((error) => {
//         console.error(error)
//     })
