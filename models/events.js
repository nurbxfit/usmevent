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
    }
});


var Event = module.exports = mongoose.model('Event',eventSchema);
