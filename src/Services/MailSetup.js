const nodemailer = require('nodemailer');

class MailSetup {
  constructor() {
    // Configure the mail transporter
    this.transporter = nodemailer.createTransport({
      host: 'new.knowledgecreed-consultancy.in',  // e.g., mail.yourdomain.com
      port: 465,  // Typically, 465 for secure SMTP or 587 for TLS
      secure: true,  // Use SSL
      auth: {
        user: 'info@new.knowledgecreed-consultancy.in',  // Domain email
        pass: 'jid@123@jid'  // Email password
      }
    });
  }

  async sendMail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: '"JID" <info@new.knowledgecreed-consultancy.in>',  // Sender's address
        to: to,  // Receiver's email
        subject: subject,  // Subject line
        text: text,  // Plain text body
        html: html  // HTML body
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw error;
    }
  }
}

module.exports = new MailSetup();
