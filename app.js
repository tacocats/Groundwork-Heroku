var http = require ('http');
var mongoose = require ("mongoose");
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');

var hbs = require('express-handlebars');
var index = require('./routes/index');
var app = express();
// Here we find an appropriate database to connect to
var uristring = process.env.MONGODB_URI || 'mongodb://localhost/HelloMongoose';
// The http server will listen to an appropriate port
var theport = process.env.PORT || 5000;

//set view engine to handlebars
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');


app.use('/', index);
app.use(express.static(path.join(__dirname, 'public')));

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

app.listen(theport, function() {
    console.log('listening on port: '+theport);
});

module.exports = app;