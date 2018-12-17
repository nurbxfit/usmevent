var express = require('express');
var router = express.Router();
var moongose = require('mongoose');
var {sanitizeBody} = require('express-validator/filter');
/* GET home page. */
// using moongose to fetch event list from database
moongose.connect('mongodb://user:password12345@ds127604.mlab.com:27604/usmevent', { useNewUrlParser: true });
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
  
  Events.find({}).sort({date: -1 }).exec(function(err,event){
    //console.log("User Session:"+req.user.username);
    if(err) throw err;
    console.log("Is Auth:"+req.isAuthenticated());
    if(req.isAuthenticated()){
      console.log("Authenticated");
      res.render('index',{title: 'USM Event', titleArray:event , isLogin:true, testData:JSON.stringify(event)});
    }
    else{
      res.render('index',{title: 'USM Event', titleArray:event, testData:JSON.stringify(event)});
    }
    
  });
  //res.render('index', { title: 'USM_EVENT', condition : true, titleArray : event_data });
});

router.get('/about', function(req,res){
  console.log("Is Auth:"+req.isAuthenticated());
  if(req.isAuthenticated()){
    console.log("Authenticated");
    res.render('about',{isLogin:true});
  }
  else{
    res.render('about');
  }
  
});

router.get('/events', function(req,res){
  Events.find({},function(err,event){
    if(req.isAuthenticated()){
      res.render('events',{title: 'Event', titleArray:event,isLogin:true});
    }
    else{
      res.render('events',{title: 'Event', titleArray:event});
    }
  });
});


router.get('/event/eventdetails',function(req,res){
  var eventname = req.query.name;
  if(req.isAuthenticated())
  {
    console.log("Event Name:"+ eventname);
    Events.find({name:eventname},function(err,eventresult){
      if(err) throw err;
      console.log(eventresult);
      res.render('eventdetails',{eventD:eventresult, testData:JSON.stringify(eventresult),isLogin:true});
    });
  }
  else{
    res.render('login',{status:"Not Login"});
  }
  
  
});

router.get('/event/bookevent',function(req,res){
  var eventname = req.query.name;
  
  console.log("Book For:"+eventname);
  if(req.isAuthenticated())
  {
    var fullname = req.user.fname + " " + req.user.lname;
    var email = req.user.email;
    Events.findOne({name:eventname},function(err,eventresult){
      if(err) throw err;
      console.log(eventresult);
      res.render('book',{titleArray:eventresult,isLogin:true,username:fullname, email:email});
    });
  }else{
    res.render('login',{status:"Not Login"});
  }
});


router.post('/event/bookevent',function(req,res){
  if(req.isAuthenticated())
  {
    var eventname = req.body.eventname;
    var name = req.body.name;
    var matricno = req.body.matricno;
    var phoneno = req.body.phoneno;
    var email = req.body.email;

    // form validation
    req.checkBody('name', 'Name of event is required').notEmpty();
    req.checkBody('matricno', 'Date of event is required').notEmpty();
    req.checkBody('phoneno', 'Organizer is required').notEmpty();
    req.checkBody('email', 'Location of the event is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        console.log("Error Occurs");
        res.render('book',{errors:errors,isLogin:true});
    }
    else{
      Events.findOne({name:eventname},function(err,result){
        if(err) throw err;
        var participant = result.participant;
        var participantList = result.participantList;
        var participantInfo = {name:name,matricno:matricno,phoneno:phoneno,email:email};
        result.participant = participant + 1;
        participantList.push(participantInfo);
        result.participantList = participantList;
        console.log(result.participantList);
        result.save(function(err){
          if(err) throw err;
          console.log("Saved");
          res.redirect("/");
        });
      });
    }

  }
  else
  {
    res.render('login',{status:"Not Login"});
  }
});



router.get('/maps/search',function(req,res){
  var search = req.query.key;
  console.log("search:"+ search);
  Events.find({name: {'$regex':search,'$options':'i'}}).exec(function(err,result){
    if(err) throw err;
    res.render('index',{title: 'USM Event',titleArray:result,testData:JSON.stringify(result)});
  });
});


module.exports = router;
