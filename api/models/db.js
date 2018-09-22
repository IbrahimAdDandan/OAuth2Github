var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/oauth_protocol');

require('./answers');
require('./users');