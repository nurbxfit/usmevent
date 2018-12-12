var express = require('express');
var router = express.Router();
var moongose = require('mongoose');


/* GET home page. */
// using moongose to fetch event list from database
moongose.connect('mongodb://yourusername:yourpassword12345@yourmongodbhost:27604/usmevent', { useNewUrlParser: true });
let db = moongose.connection;

//check if connected
db.once('open',function(){
  console.log("Connected to MongoDB");
});

//check if error
db.on('error',function(err){
  console.log(err);
});

//event variable using the article model shcema
var Events = require('../models/events');

router.get('/', function(req, res, next) {
  Events.find({},function(err,event){
    //console.log("User Session:"+req.user.username);
    console.log("Is Auth:"+req.isAuthenticated());
    if(req.isAuthenticated()){
      console.log("Authenticated");
      res.render('index',{title: 'USM Event', titleArray:event , isLogin:true});
    }
    else{
      res.render('index',{title: 'USM Event', titleArray:event});
    }
    
  });
  //res.render('index', { title: 'USM_EVENT', condition : true, titleArray : event_data });
});

router.get('/about', function(req,res){
  res.render('about');
});

router.get('/events', function(req,res){
  Events.find({},function(err,event){
    res.render('events',{title: 'Event', titleArray:event});
  });
});
module.exports = router;
