var http = require ('http');
var mongoose = require ("mongoose");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var flash = require('connect-flash');

var hbs = require('express-handlebars');
var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
// Here we find an appropriate database to connect to
var uristring = process.env.MONGODB_URI || 'mongodb://localhost/HelloMongoose';
// The http server will listen to an appropriate port
var theport = process.env.PORT || 5000;

//set view engine to handlebars
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));



//Handle Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



app.use('/', index);
app.use('/users', users);


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


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;