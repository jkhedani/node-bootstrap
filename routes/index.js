var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var Q          = require('q');

/**
 * Helper Functions
 *
 */

 // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

// http://stackoverflow.com/questions/4994201/is-object-empty
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

/**
 * User
 * Handle User Login/Logout/Signup & Profile
 *
 */
router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', {
      message: req.flash('loginMessage')
    });
});
// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/scenarios', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// Signup
router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup', {
      // message: req.flash('signupMessage')
    });
});
// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/scenarios', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// Signup
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
// router.get('/profile', function(req, res, next) {
//   // if user is authenticated in the session, carry on
//   if (req.isAuthenticated())
//     next();
//
//   // if they aren't redirect them to the home page
//   res.redirect('/');
// });
router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('profile', {
      title: 'Profile',
      user : req.user // get the user out of session and pass to template
    });
});

// Logout
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * View Routes
 */
router.get('/', function(req, res) {
    res.render('index',{
      title: 'Node Bootstrap'
    }); // load the index.ejs file
});


module.exports = router;
