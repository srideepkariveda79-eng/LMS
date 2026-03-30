require('dotenv').config()
const nodemailer = require('./node_modules/nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
})

console.log('MAIL_USER:', process.env.MAIL_USER)
console.log('MAIL_PASS:', process.env.MAIL_PASS ? '***set***' : 'NOT SET')

transporter.sendMail({
  from: process.env.MAIL_USER,
  to: process.env.MAIL_USER,
  subject: 'LMS Test Email',
  html: '<p>Test email from LMS backend. If you see this, email is working.</p>',
}, (err, info) => {
  if (err) console.error('Send FAILED:', err)
  else console.log('Sent OK:', info.response)
})
