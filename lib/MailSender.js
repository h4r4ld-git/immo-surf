const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport("SMTP", {
    host: "immo.surf",
    port: 25,
    auth: {
        user: "root",
        pass: "BE@genceroot1"
    },
    tls:{
        rejectUnauthorized: false
    }
});

const mailConfigurations = {

    // It should be a string of sender email
    from: 'info@immo.surf',

    // Comma Separated list of mails
    to: 'luka.chy215@gmail.com',

    // Subject of Email
    subject: 'Sending Email using Node.js',

    // This would be the text of email body
    text: 'Hi! There, You know I am using the'
      + ' NodeJS Code along with NodeMailer '
      + 'to send this email.'
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});