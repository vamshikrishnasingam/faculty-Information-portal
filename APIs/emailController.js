const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using Outlook SMTP settings
let transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // StartTLS is required for Office 365
  auth: {
    user: 'your-outlook-email@example.com',
    pass: 'your-outlook-email-password',
  },
});

// Define the email options
let mailOptions = {
  from: 'your-outlook-email@example.com',
  to: 'recipient-email@example.com',
  subject: 'Subject',
  text: 'Your default password is: <password>',
};

// Send the email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
