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
const surfConsent = require('./lib/surfConsent')
const profilePage = require('./lib/SurfRender').profile

//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
const stripe = require('stripe')('sk_test_51JP6pjFvE0ip00kntEbPBs3RpX9eEIcV7BGjl8qur3bLgRzSTjWafKdfKqfmIge9GVUcvFR77hieQ7e73sStpWgH00MBYyGZp1');

const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
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
  if (!req.session.user){
    res.render('surf.html', {surfConsent: surfConsent()});
  } else {
    MongoClient.connect(dbURL, function(err, client) {
      affiches = client.db("immo-surf").collection("affiches")
      users = client.db("immo-surf").collection("users")
      abonnement = client.db("immo-surf").collection("abonnement")
      users.findOne({email: req.session.user.email, tel: req.session.user.tel}, function(err, result){
        if (result){
          affiches.find({mail: req.session.user.email, tel: req.session.user.tel}).toArray(function(err, affs){
            if (affs){
              abonnement.findOne({userID: req.session.user.userID}, function(err, result1){
                res.render('surf.html', {myProfile: profilePage(result, affs, result1)})
              })
            }

          })
        }
      })
    })
  }
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
  const email = validator.escape(req.body.mail);
  var tel = validator.escape(req.body.tel);

  if (!email || !tel){
    res.send("Empty");
  } else {
    tel = tel.replace(/\D/g, '');
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("users")
      db.findOne({"email": email, "tel": tel}, function(err, result){
        if (result){
          res.send("Found")
        } else {
          if (!validator.isEmail(email)){
            res.send("Mail")
          } else if (!/^\d+$/.test(tel)){
            res.send("Phone")
          } else {
            const id = pinSender.send(email);
            const userId = new ObjectId();
            db.insertOne({"_id": userId, "name": "Surfer", "email": email, "tel": tel, "pin": id});
            db = client.db("immo-surf").collection("abonnement")
            db.insertOne({"userID": userId, "abonnement": "One"})
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
      db.findOne({"email": email, "tel": tel}, function(err, result){
        if (!result){
          res.send("NotFound")
        } else {
          if (!validator.isEmail(email)){
            res.send("Mail")
          } else if (!/^\d+$/.test(tel)){
            res.send("Phone")
          } else if (pin === result.pin){
            req.session.user = {
              userID: result.userID,
              name: result.name,
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
  } else if (!validator.isEmail(email)){
    res.send("Mail");
  } else {
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("users")
      db.findOne({"email": email}, function(err, result){
        if (!result){
          res.send("NotFound")
        } else {
          const uri = makeId.makeid(20)
          const id = pinSender.sendUrl(email, uri)
          client.db("immo-surf").collection("valid").insertOne({"createdAt": new Date(), "id" : uri, "email" : email, "npin" : id})
          res.send("sent");
        }
      })
    })
  }
})

app.get('/tmpValid', function(req, res){
  if (!req.query.id){
    res.send("URL n'est pas valide")
  } else {
    const id = req.query.id;
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("valid")
      db.findOne({"id": id}, function(err, result){
        if (!result){
          res.send("URL n'est plus valide")
        } else {
          client.db("immo-surf").collection("users").updateOne({"email" : result.email}, {$set : {"pin" : result.npin}})
          client.db("immo-surf").collection("valid").deleteOne({"email" : result.email})
          res.send("Pin modifié");
        }
      })
    })
  }
})

app.post('/checkout', async function(req, res){
  MongoClient.connect(dbURL, async function(err, client) {
    db = client.db("immo-surf").collection("affiches")
    const affichesOID = new ObjectId();
    db.insertOne({
      _id: affichesOID,
      location: req.body.coord,
      address: req.body.addr,
      title: req.body.immob,
      locvent: req.body.lorv,
      description: req.body.descr,
      mail: req.body.descr1,
      tel: req.body.descr2,
      prix: req.body.descr0,
      createdAt: new Date(),
      pay: false,
    })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card',
        'bancontact',
        'sofort',
      ],
      line_items: [
        {
          price: 'price_1JP76UFvE0ip00knGB3izHez',
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `https://immo.surf/affiche/order/success?session_id={CHECKOUT_SESSION_ID}&afficheID=${affichesOID.toString()}`,
      cancel_url: 'https://immo.surf',
    });
    res.redirect(303, session.url);
  })
})

app.post('/checkout-subscription', async (req, res) => {
  if (req.session.user && req.body.newSub !== "None"){
    var price;
    if (req.body.newSub === "OnePlus"){
      price = "price_1KO0DNFvE0ip00knlr61pD5j";
    } else if (req.body.newSub === "Limitless"){
      price = "price_1KO2cBFvE0ip00knPNwmhHo7";
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1KO3IFFvE0ip00knEM1ePthJ",
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: `https://immo.surf`,
      cancel_url: 'https://immo.surf',
    });
    res.redirect(303, session.url);
  } else {
    res.redirect('/')
  }
})

app.get('/affiche/order/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  if (session.payment_status !== "unpaid"){
    MongoClient.connect(dbURL, function(err, client) {
      db = client.db("immo-surf").collection("affiches")
      db.updateOne({_id: ObjectId(req.query.afficheID)}, { $unset : { createdAt : 1} })
      res.send(`
        <html>
          <body>
          <h1>Thanks for your order, ${customer.name}!</h1>
          </body>
          <script>
          const bc = new BroadcastChannel('fm86.7');

          bc.postMessage('pay');
          window.close();
          </script>
        </html>`);
    })
  } else {
    res.send(`<html><body><h1>Sorry, ${customer.name}!</h1></body></html>`);
  }
});
const endpointSecret = "whsec_i3BYrDTBLj9wjYUM09NomUCkxsyIJ8rd";
app.post('/webhook-subscriptions', express.json({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  var invoice;
  switch (event.type) {
   case 'invoice.paid':
     invoice = event.data.object;
     console.log(invoice)
     // Then define and call a function to handle the event invoice.paid
     break;
   case 'invoice.payment_failed':
     invoice = event.data.object;
     console.log(invoice)
     // Then define and call a function to handle the event invoice.payment_failed
     break;
   // ... handle other event types
   default:
     console.log(`Unhandled event type ${event.type}`);
 }

  // Return a response to acknowledge receipt of the event
  response.send();
});

app.post('/DeleteAff', async (req, res) => {
  if (req.session.user){
    MongoClient.connect(dbURL, async function(err, client) {
      db = client.db("immo-surf").collection("affiches")
      const result = await db.deleteOne({address: req.body.address, mail: req.session.user.email})
      res.send("Hi")
    })
  } else {
    res.send(0)
  }
})

app.post('/EditAff', async (req, res) => {
  if (req.session.user){
    MongoClient.connect(dbURL, async function(err, client) {
      db = client.db("immo-surf").collection("affiches")
      const result = await db.updateOne({address: req.body.address, mail: req.session.user.email}, {$set: {title: req.body.title, description: req.body.description, prix: req.body.prix}})
      res.send("Hi")
    })
  } else {
    res.send(0)
  }
})

app.use(express.static('content/static'));

https.createServer({
  key: fs.readFileSync("immo.surf.key"),
  cert: fs.readFileSync('immo.surf.crt'),
  ca: fs.readFileSync('immo.surf.ca-bundle')
}, app).listen(443)
