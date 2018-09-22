var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = mongoose.Schema({
    reputation: {
        type: Number
    },
    user_type: {
        type: String
    },
    accept_rate: {
        type: Number
    },
    profile_image: {
        type: String
    },
    display_name: {
        type: String
    },
    link: {
        type: String
    }
});

mongoose.model('Users', users);