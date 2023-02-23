var express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
var app = express();


const cors=require("cors");
app.use(cors());


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

const TWO_HOURS = 1000 * 60 * 60 * 2
const redis = require('./redis');
redis.redisInit();

app.use(session({
  name: 'name',
  resave: false,
  saveUninitialized: false,
  store:  redis.sessionStore,
  secret: 'secret',
  cookie: {
    maxAge: TWO_HOURS,
    sameSite: true,
    secure: false
  }
}))

require('./routes')(app);


app.listen(8080, function(){
  console.log("Live at Port 8080");
});