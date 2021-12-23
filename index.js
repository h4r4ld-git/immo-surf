const express = require('express');
const consolidate = require('consolidate');
const app = express();
const bodyParser = require('body-parser');
const sessions = require('express-session');
const fs = require('fs');
const dotenv = require('dotenv');

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

app.use(express.static('content/static'));

app.listen(8080)
