var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var asnswers = mongoose.Schema({
    owner: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    is_accepted: {
        type: Boolean
    },
    score: {
        type: Number
    },
    Content: {
        type: String
    },
    creation_date: {
        type: Date,
        "default": Date.now
    }
});

mongoose.model('Asnswers', asnswers);