const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Envía un email usando Nodemailer
 * @param {string} to - destinatario
 * @param {string} subject - asunto del email
 * @param {string} template - nombre del archivo HTML en la carpeta emails (ej: 'welcome')
 * @param {object} variables - objeto con variables para reemplazar en el HTML
 */
async function sendEmail(to, subject, template, variables = {}) {
  try {
    // Crear transportador
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Leer archivo HTML
    const filePath = path.join(__dirname, '..', 'emails', `${template}.html`);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Reemplazar variables en el HTML
    for (const key in variables) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key]);
    }

    // Enviar email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM, // Ej: '"Telas Once" <no-reply@telas.com>'
      to,
      subject,
      html
    });

    console.log('Email enviado:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error enviando email:', err);
    throw err;
  }
}

module.exports = { sendEmail };
