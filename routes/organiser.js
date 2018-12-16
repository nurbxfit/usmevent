var express = require('express');
var router = express.Router();
var Events = require('../models/events');
//routers for organiser to add events
router.get('/addevent',function(req,res){
    if(req.isAuthenticated())
    {
        res.render('addevent',{isLogin:true});
    }
    else{
        res.render('login',{status:"Not Login"})
    }
    
});

router.post('/addevent',function(req,res){
    if(req.isAuthenticated())
    {
    var name = req.body.name;
    var date = req.body.date;
    var club = req.body.club;
    var location = req.body.location;
    var geo = req.body.geo;
    var description = req.body.description;

    console.log("Inside Post Geo:"+ geo);

    // form validation
    req.checkBody('name', 'Name of event is required').notEmpty();
    req.checkBody('date', 'Date of event is required').notEmpty();
    req.checkBody('club', 'Organizer is required').notEmpty();
    req.checkBody('location', 'Location of the event is required').notEmpty();
    req.checkBody('geo', 'Valid geolocation is required').notEmpty();
    req.checkBody('description', 'Description of event is required').notEmpty();

    //validation before add to database
    var errors = req.validationErrors();
    if(errors){
        console.log("Error Occurs");
        res.render('addevent',{errors:errors,isLogin:true});
    }
    else{
        //find if event is already in database
        Events.findOne({name:{ "$regex": "^" + name + "\\b", "$options": "i" }}, function (err,event){
            //if we can find event with the same name.
            if(event){
                console.log("Alread Existed");
                //render back the addevent page with errors
                res.render('addevent',{signstat: 'Event already existed',isLogin:true});
            }
            else //else if we cannot found in database
            {
                //create new event objects and add it to database
                var newEvent = new Events({
                    name:name,
                    date:date,
                    club:club,
                    location:location,
                    geo:geo,
                    description:description,
                    participant:0,
                });

                Events.createEvent(newEvent,function(err,event){
                    if(err) throw err;
                    console.log(event);
                    console.log(event.name);
                    res.redirect("/event/eventdetails?name="+event.name);
                });
                
            }
        });
        
    }
    }
    else{
        res.render('login',{status:"Not Login"})
    }
});


module.exports = router;