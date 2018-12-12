var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//router.use(expressValidator);
/* GET users listing. */

//login router
router.get('/login', function(req,res){
  res.render('login');
});

//signup route
router.get('/signup', function(req,res){
  res.render('signup');
});



// POST signup route
router.post('/signup', function(req,res){
  var username = req.body.username;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var pass = req.body.pass;

  //validation
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('fname','First Name is required').notEmpty();
  req.checkBody('lname','Last Name is required').notEmpty();
  req.checkBody('email','Valid Email is required').isEmail();
  req.checkBody('pass','password is required').notEmpty();
  req.checkBody('pass2','password must be the same').equals(req.body.pass);


  var errors = req.validationErrors();
  if(errors){
    console.log("Error Occurs");
    res.render('signup',{
      errors:errors
    });
  }
  else{
    //check if username is already in the database
    User.findOne({username:{"$regex": "^" + username + "\\b", "$options": "i"}}, function(err,user){
      //check if email already in used
      User.findOne({email:{
        "$regex": "^" + email + "\\b", "$options": "i"
      }},function(err,mail){
        if(user||mail){
          console.log("already in Used");
          res.render('signup',{signstat:'Username or Email already in Use.'});
        }
        else{
          var newUser = new User({
            username: username,
            fname: fname,
            lname: lname,
            email: email,
            password: pass
          });

          User.createUser(newUser,function(err,user){
            if(err) throw err;
            console.log(user);  
          });
          res.render('login',{status:"Sign Up Sucess, You can now Login."})
        }
      })
    });
  }
});


//pasport local stratgery
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserbyUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
        return done(null, false, { message: 'Unknown User' });
        
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserbyId(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
    res.redirect('/users/profile/'+req.user.username);
  });

router.get('/profile/',function(req,res){
  console.log('in profile: req.user.username:' + req.user.username);
  res.redirect('/users/profile/'+req.user.username);
});

router.get('/profile/:username',function(req,res){
  console.log("Params:"+req.params.username);
  console.log("req.user:" + req.user.username); //if we user the req.user, this route will automatic reject if there is no session.
  res.render('profile',{fname:req.user.fname});
});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});



module.exports = router;
