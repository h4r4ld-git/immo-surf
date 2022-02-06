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
  subject: 'Votre Pin de connection',

  // This would be the html of email body
  html: 'Bonjour,'
  + ' Votre code PIN est *'
};

function send(to){
  const id = makeId.makeid(10);
  mailConfigurations.to = to;
  mailConfigurations.html = `
  <html>
    <body>
      <p>Bonjour,</p>
      <p>Votre code PIN est <b>${id}</b></p>
      <br>
      <p>Hello,</p>
      <p>Your PIN code is <b>${id}</b></p>
      <br>
      <p>Hallo,</p>
      <p>Uw PIN code is <b>${id}</b></p>
      <br><br><br><br>
      <h2 style="text-align:center; color: blue; font-weight: bold;">For any encountered issue please mail</h2>
      <h2 style="text-align:center; color: blue; font-weight: bold;">admin@immo.surf</h2>
      <br><br><br><br>
      <p style="color: blue;"><b>Sponsor BEagence.com</b></p>
      <p style="color: blue;"><b>©️ 2022</b></p>
    </body>
  </html>`;
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info);
    }
  });
  return id;
}

function sendUrl(email, uri){
  const id = makeId.makeid(10);
  mailConfigurations.to = email;
  mailConfigurations.html = `
  <html>
    <body>
      <p>Bonjour,</p>
      <p>Votre code PIN est <b>${id}</b></p>
      <p>Acceptez la modification via le lien</p>
      <p>https://immo.surf/tmpValid?id=${uri}</p>
      <br>
      <p>Hello,</p>
      <p>Your PIN code is <b>${id}</b></p>
      <p>Please accept modification by clicking the link below</p>
      <p>https://immo.surf/tmpValid?id=${uri}</p>
      <br>
      <p>Hallo,</p>
      <p>Uw PIN code is <b>${id}</b></p>
      <p>Gelieve uw keuze te bevestigen door op volgende link te clicken</p>
      <p>https://immo.surf/tmpValid?id=${uri}</p>
      <br><br><br><br>
      <h2 style="text-align:center; color: blue; font-weight: bold;">For any encountered issue please mail</h2>
      <h2 style="text-align:center; color: blue; font-weight: bold;">admin@immo.surf</h2>
      <br><br><br><br>
      <p style="color: blue;"><b>Sponsor BEagence.com</b></p>
      <p style="color: blue;"><b>©️ 2022</b></p>
    </body>
  </html>`;
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info);
    }
  });
  return id;
}

module.exports = {send, sendUrl};
