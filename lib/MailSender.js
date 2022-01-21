const nodemailer = require('nodemailer');
const makeId = require('./makeId');

var transporter = nodemailer.createTransport({
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
  to: 'luka.chy255@gmail.com',

  // Subject of Email
  subject: 'Sending Email using Node.js',

  // This would be the text of email body
  text: (id) => {'Bonjour,'
  + ' Votre code PIN est ' + id
  + 'to send this email.'}
};

function send(to){
  const id = makeId(10);
  mailConfigurations.to = to;
  mailConfigurations.text = mailConfigurations.text(id);
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info);
    }
  });
  return id;
}

module.exports = {send};
