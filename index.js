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
const cron = require("node-cron");

//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
const stripe = require('stripe')('sk_test_51JP6pjFvE0ip00kntEbPBs3RpX9eEIcV7BGjl8qur3bLgRzSTjWafKdfKqfmIge9GVUcvFR77hieQ7e73sStpWgH00MBYyGZp1');

const OnePlus = "price_1KO0DNFvE0ip00knlr61pD5j"
const Limitless = "price_1KO2cBFvE0ip00knPNwmhHo7"
const OnePlusTest = "price_1KO3IFFvE0ip00knEM1ePthJ"
const LimitlessTest = "price_1KPDk6FvE0ip00knBMv5haG6"
const webhookSecretTest = "whsec_i3BYrDTBLj9wjYUM09NomUCkxsyIJ8rd"
const webhookSecret = "whsec_MDkZqzxMwxZCF8hz4UNQj0HDKpHnGuZi"

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


cron.schedule("* * 1 * *", function() {
  MongoClient.connect(dbURL, function(err, client){
    abonnement = client.db("immo-surf").collection("abonnement")
    abonnement.update({name: "Limitless", affExpire: 5}, {$set: {affs: 18}})
  })
});

app.get('/', function(req, res) {
  if (!req.session.user){
    res.render('surf.html', {surfConsent: surfConsent()});
  } else {
    MongoClient.connect(dbURL, function(err, client) {
      affiches = client.db("immo-surf").collection("affiches")
      users = client.db("immo-surf").collection("users")
      abonnement = client.db("immo-surf").collection("abonnement")
      prices = client.db("immo-surf").collection("prices")
      users.findOne({email: req.session.user.email, tel: req.session.user.tel}, function(err, result){
        if (result){
          affiches.find({$or: [{mail: req.session.user.email, tel: req.session.user.tel}, {mails: req.session.user.email, tels: req.session.user.tel}, {userIDs: req.session.user.userID}]}).toArray(function(err, affs){
            if (affs){
              abonnement.findOne({userID: req.session.user.userID, status: "active"}, function(err, result1){
                abonnement.find({userID: req.session.user.userID}).toArray(function(err, result2){
                  res.render('surf.html', {myProfile: profilePage(result, affs, result1, result2)})
                })
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
              userID: result._id.toString(),
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
      userIDs: [],
      mails: [],
      tels: [],
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
    MongoClient.connect(dbURL, async function(err, client){
      db = client.db("immo-surf").collection("abonnement")
      var price;
      if (req.body.newSub === "OnePlus"){
        price = OnePlusTest;
      } else if (req.body.newSub === "Limitless"){
        price = LimitlessTest;
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price,
            quantity: 1,
          }
        ],
        mode: 'subscription',
        success_url: `https://immo.surf`,
        cancel_url: 'https://immo.surf',
      });
      db.findOne({userID: req.session.user.userID}, async function(err, result){
        if (!result){
          await db.insertOne({userID: req.session.user.userID, checkoutID: session.id, status: "inactive"})
        } else if (!result.subID) {
          await db.updateOne({userID: req.session.user.userID}, {$set: {checkoutID: session.id}})
        } else {
          await db.insertOne({userID: req.session.user.userID, checkoutID: session.id, status: "inactive"})
        }
        res.redirect(303, session.url);
      })
    })
  } else {
    MongoClient.connect(dbURL, async function(err, client){
      db = client.db("immo-surf").collection("abonnement")
      await db.update({userID: req.session.user.userID}, {$set: {status: "inactive"}})
      await db.find({userID: req.session.user.userID, status: "inactive", canceled: false}).toArray(async function(err, subs){
        subs.forEach(async function(sub, index){
          const deleted = await stripe.subscriptions.del(
            sub.subID
          );
        })
      })
      await db.update({userID: req.session.user.userID, status: "inactive", canceled: false}, {$set: {canceled: true}})
      res.redirect('/')
    })
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
app.post('/webhook-subscriptions', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  let data;
  let eventType;

  if (webhookSecretTest) {
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecretTest
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  MongoClient.connect(dbURL, async function(err, client){
    db = client.db("immo-surf").collection("abonnement")
    switch (eventType) {
     case 'checkout.session.completed':
       await db.findOne({checkoutID: data.object.id}, async function(err, result){
         if (result){
           await db.update({userID: result.userID}, {$set: {status: "inactive"}})
           await db.find({userID: result.userID, status: "inactive", canceled: false}).toArray(async function(err, subs){
             subs.forEach(async function(sub, index){
               const deleted = await stripe.subscriptions.del(
                 sub.subID
               );
             })
           })
           await db.update({userID: result.userID, status: "inactive", canceled: false}, {$set: {canceled: true}})
           const subscription = await stripe.subscriptions.retrieve(
             data.object.subscription
           );
           prices.findOne({prod: subscription.items.data[0].price.product}, function(err, result2){
             db.updateOne({checkoutID: data.object.id, userID: result.userID}, {$set: {
               name: result2.name,
               affExpire: result2.affExpire,
               status: "active",
               canceled: false,
               atYear: new Date(),
               sub: subscription.items.data[0].price.product,
               subID: data.object.subscription,
               affs: result2.affs
             }})
           })
         }
       })
       break;
     case 'invoice.payment_succeeded':
       db.updateOne({subID: data.object.subscription}, {$set: {atYear: new Date()}})
       break;
     case 'invoice.payment_failed':
       db.deleteOne({subID: data.data.object.lines.data[0].subscription})
       break;
     default:
       console.log(`Unhandled event type ${event.type}`);
   }
  })

  res.send();
});

app.post('/DeleteAff', async (req, res) => {
  if (req.session.user){
    MongoClient.connect(dbURL, async function(err, client) {
      db = client.db("immo-surf").collection("affiches")
      const result = await db.deleteOne({_id: ObjectId(req.body.id), mail: req.session.user.email})
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
      const result = await db.updateOne({_id: ObjectId(req.body.id), mail: req.session.user.email}, {$set: {title: req.body.title, description: req.body.description, prix: req.body.prix}})
      res.send("Hi")
    })
  } else {
    res.send(0)
  }
})

app.post('/newAffSub', async (req, res) => {
  const addr = validator.escape(req.body.addr)
  const mail = validator.escape(req.body.mail)
  const tel = validator.escape(req.body.tel)
  const prix = validator.escape(req.body.prix)
  const description = validator.escape(req.body.description)
  const locvent = validator.escape(req.body.locvent)
  const titre = validator.escape(req.body.titre)
  const affLoc = validator.escape(req.body.affLoc)
  const affID = new ObjectId();

  if (req.session.user){
    MongoClient.connect(dbURL, async function(err, client) {
      abonnement = client.db("immo-surf").collection("abonnement")
      affiches = client.db("immo-surf").collection("affiches")
      abonnement.findOne({subID: req.body.subID, userID: req.session.user.userID}, async function(err, result){
        if (result){
          if (result.affs > 0){
            if (result.affExpire == 5){
              await affiches.insertOne({
                userIDs: [req.session.user.userID],
                mails: [],
                tels: [],
                location: affLoc,
                address: addr,
                title: titre,
                locvent: locvent,
                description: description,
                mail: mail,
                tel: tel,
                prix: prix,
                FiveMonth: new Date()
              })
            } else {
              await affiches.insertOne({
                userIDs: [req.session.user.userID],
                mails: [],
                tels: [],
                location: affLoc,
                address: addr,
                title: titre,
                locvent: locvent,
                description: description,
                mail: mail,
                tel: tel,
                prix: prix,
                FourMonth: new Date()
              })
            }
            abonnement.updateOne({subID: req.body.subID, userID: req.session.user.userID}, {$set : {affs: (result.affs - 1)}})
            res.redirect('/')
          } else {
            res.redirect('/')
          }
        } else {
          res.redirect('/')
        }
      })
    })
  } else {
    res.redirect('/')
  }
})

app.post('/editProfile', async function(req, res) {
  const name = validator.escape(req.body.name)
  const mail = validator.escape(req.body.mail)
  var tel = validator.escape(req.body.tel)

  if (req.session.user && (name && mail && tel)){
    tel = tel.replace(/\D/g, '');
    if (validator.isEmail(mail) && /^\d+$/.test(tel)){
      MongoClient.connect(dbURL, async function(err, client){
        users = client.db("immo-surf").collection("users")
        affiches = client.db("immo-surf").collection("affiches")
        await users.updateOne({_id: ObjectId(req.session.user.userID)}, {$set: {name: name, email: mail, tel: tel}})
        await affiches.update({mail: req.session.user.email, tel: req.session.user.tel, userIDs: {$ne: req.session.user.userID}}, {$push: {userIDs: req.session.user.userID}})
        req.session.user.name = name
        req.session.user.email = mail
        req.session.user.tel = tel
        res.send("success")
      })
    }
  }
})

app.post('/addUserToAff', async function (req, res) {
  const affID = validator.escape(req.body.affID)
  const mail = validator.escape(req.body.mail)
  var tel = validator.escape(req.body.tel)

  if (req.session.user && mail && tel && affID){
    tel = tel.replace(/\D/g, '');
    if (validator.isEmail(mail) && /^\d+$/.test(tel)){
      MongoClient.connect(dbURL, async function(err, client){
        users = client.db("immo-surf").collection("users")
        affiches = client.db("immo-surf").collection("affiches")
        await users.findOne({email: mail, tel: tel}, async (err, result) => {
          if (result){
            await affiches.updateOne({_id: ObjectId(affID)}, {$push: {userIDs: result._id.toString()}})
          } else {
            await affiches.updateOne({_id: ObjectId(affID)}, {$push: {mails: mail, tels: tel}})
          }
          res.send("success")
        })
      })
    }
  }
})

app.use(express.static('content/static'));

https.createServer({
  key: fs.readFileSync("immo.surf.key"),
  cert: fs.readFileSync('immo.surf.crt'),
  ca: fs.readFileSync('immo.surf.ca-bundle')
}, app).listen(443)
