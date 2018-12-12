var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

 var randomsalt = "usmevent!@#$harrypotter&*()something!#$$%*avengers!$*$";
//user schema
let UserSchema = mongoose.Schema({
    username:{
        type:String
    },
    fname:{
        type:String,
        index:true
    },
    lname:{
        type:String,
        index:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String
    }

});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,10,function(err,hash){
            //store hash in password field in schema
            //console.log("Password:" + newUser.password);
            
            newUser.password=hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserbyUsername= function(username,callback){
    var query = {username:username};
    User.findOne(query,callback);
}

module.exports.getUserbyId= function(id,callback){
    User.findById(id,callback);
}

module.exports.comparePassword = function(inputpassword,hash,callback){
    bcrypt.compare(inputpassword,hash,function(err,isMatch){
        if(err) throw err;
        callback(null,isMatch);
        //console.log("Compare:"+ inputpassword);
    });
}