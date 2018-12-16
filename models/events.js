var mongoose = require('mongoose');

//event schema

let eventSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    date:{
        type: String,
        require:true
    },
    club:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true
    },
    geo:{
        type:Array,
        require:true
    },
    description:{
        type:String,
        require: true
    },
    participant:{
        type: Number,
        require: true,
    },
    participantList:{
        type:Array,
    }
});


var Event = module.exports = mongoose.model('Event',eventSchema);

module.exports.createEvent = function (newEvent, callback) {
    newEvent.save(callback);
}

module.exports.getEventbyname = function (name, callback) {
    var query = { name: name };
    Event.findOne(query, callback);
}

module.exports.getEventbyLocation = function (location, callback) {
    var query = { location: location };
    Event.findOne(query, callback);
}