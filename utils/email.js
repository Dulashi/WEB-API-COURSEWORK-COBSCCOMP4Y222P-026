const sgMail = require('@sendgrid/mail');

// SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const msg = {
      to,
      from: 'ashinidulashi67@gmail.com', // Verified sender in SendGrid
      subject,
      text,
    };
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.response.body);
    throw error;
  }
};

module.exports = sendEmail;
