import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendsRegistrationEmail = async recipientAdress => {
    const msg = {
        to: recipientAdress,
        from: process.env.SENDER_EMAIL_ADDRESS,
        subject: "First email sent!",
        text: "Hello, this is a test",
        html: "<strong>first test</strong>",
    }
    await sgMail.send(msg)
}