var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Activity = require('../models/activity');


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/users/login');
}

router.get('/createactivity', function(req, res, next) {
  res.render('createactivity', {title: 'New Activity'});
});

router.post('/createactivity', function(req, res, next) {
  var name = req.body.name;
  var description = req.body.description;

  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('description', 'description field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();

  if(errors) {
  	res.render('createactivity', {
  		errors: errors
  	});
  } else {
  	var newActivity = new Activity({
  		name: name,
  		description: description
  	});

  	Activity.createActivity(newActivity, function(err, activity){
  		if(err) throw err;
  		console.log(activity);
  	});

  	req.flash('success', 'You are now registered and can login');

  	res.location('/');
  	res.redirect('/');
  }

});

module.exports = router;