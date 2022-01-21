const express = require('express');
const consolidate = require('consolidate');
const app = express();
const bodyParser = require('body-parser');
const sessions = require('express-session');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const validator = require('validator')
const pinSender = require('./lib/MailSender')
const makeId = require('./lib/makeId')

const {MongoClient} = require('mongodb');
const dbURL = "mongodb+srv://h4r4ld:.feEM5*46pXzFM4@surf.hdzzn.mongodb.net/"

app.engine('html', consolidate.hogan)
app.set('views', 'content/static');

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use(sessions({
    secret: "xxx",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 3600000
    }
}))

app.get('/', function(req, res) {
  res.render('surf.html');
});

app.post('/getAffs', function(req, res) {
  MongoClient.connect(dbURL, function(err, client) {
    db = client.db("immo-surf").collection("affiches")
    db.find().toArray(function(err, result) {
      res.send(result)
    })
  })
})

app.post('/register', function(req, res) {
  const name = validator.escape(req.body.name).toLowerCase();
  const email = validator.escape(req.body.mail);
  var tel = validator.escape(req.body.tel);

  if (!name || !email || !tel){
    res.send("Empty");
  } else {
    tel = tel.replace(/\D/g, '');
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("users")
      db.findOne({"username": name}, function(err, result){
        if (result){
          res.send("Found")
        } else {
          if (!validator.isEmail(email)){
            res.send("Mail")
          } else if (!/^\d+$/.test(tel)){
            res.send("Phone")
          } else {
            const id = pinSender.send(email);
            db.insertOne({"name": name, "email": email, "tel": tel, "pin": id});
            res.send("Valid")
          }
        }
      })
    })
  }
})

app.post('/login', function(req, res){
  const email = validator.escape(req.body.mail);
  const pin = validator.escape(req.body.pin);
  var tel = validator.escape(req.body.tel);

  if (!email || !tel){
    res.send("Empty");
  } else {
    tel = tel.replace(/\D/g, '');
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("users")
      db.findOne({"email": email}, function(err, result){
        if (!result){
          res.send("NotFound")
        } else {
          if (!validator.isEmail(email)){
            res.send("Mail")
          } else if (!/^\d+$/.test(tel)){
            res.send("Phone")
          } else if (pin === result.pin){
            req.session.user = {
              username: result.username,
              email: email,
              tel: tel,
            }
            res.send("Valid");
          } else {
            res.send("BadPass")
          }
        }
      })
    })
  }
})

app.post('/validPin', function(req, res) {
  const email = validator.escape(req.body.mail);

  if (!email){
    res.send("Empty");
  } else {
    tel = tel.replace(/\D/g, '');
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("users")
      db.findOne({"email": email}, function(err, result){
        if (!result){
          res.send("NotFound")
        } else {
          if (!validator.isEmail(email)){
            res.send("Mail")
          } else {
            const uri = makeId.makeid(20)
            const id = pinSender.sendUrl(email, uri)
            client.db("immo-surf").collection("valid").insertOne({"createdAt": new Date(), "id" : uri, "email" : email, "npin" : id})
            res.send("sent");
          }
        }
      })
    })
  }
})

app.get('/tmpValid', function(req, res){
  if (!req.params.id){
    res.send("URL n'est pas valide")
  } else {
    const id = req.params.id;
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("valid")
      db.findOne({"id": id}, function(err, result){
        if (!result){
          res.send("URL n'est plus valide")
        } else {
          client.db("immo-surf").collection("users").updateOne({"email" : result.email}, {$set : {"pin" : result.npin}})
          res.send("Pin modifié");
        }
      })
    })
  }
})

app.use(express.static('content/static'));

https.createServer({
  key: fs.readFileSync("immo.surf.key"),
  cert: fs.readFileSync('immo.surf.crt'),
  ca: fs.readFileSync('immo.surf.ca-bundle')
}, app).listen(443)
