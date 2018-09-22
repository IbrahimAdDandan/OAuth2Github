var mongoose = require('mongoose');
var Users = mongoose.model('Users');

module.exports.getAllUsers = function (req, res) {
    Users.find((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length == 0) {
            res.status(404).send("No content found");
        } else {
            res.status(200).json(result);
        }
    });
};

module.exports.addUser = function (req, res) {
    var user = new Users(req.body);
    user.save((err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(201).json(result);
        }
    });
};