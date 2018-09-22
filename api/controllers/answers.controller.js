var mongoose = require('mongoose');
var Answers = mongoose.model('Asnswers');
var Users = mongoose.model('Users');

module.exports.getAllAnswers = function (req, res) {
    Answers.find((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length == 0) {
            res.status(404).send("No content found");
        } else {
            res.status(200).json(result);
        }
    });
};
module.exports.getOneAnswer = function (req, res) {
    var answerId = req.params.answerId;
    Answers.findById(answerId, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (!result) {
            res.status(404).send("No content found");
        } else {
            var ownerId = result.owner;
            Users.findById(ownerId, (err, owner) => {
                var user = {
                    "owner": owner
                };
                res.status(200).json([result, user]);
            });
        }
    });
};

module.exports.addAnswer = function (req, res) {
    var answer = new Answers(req.body);
    answer.save((err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(201).json(result);
        }
    });
};

module.exports.updateOneAnswer = function (req, res) {
    var answerId = req.params.answerId;
    Answers.findByIdAndUpdate(answerId, {
        owner: req.body.owner,
        Content: req.body.Content,
        is_accepted: req.body.is_accepted,
        score: req.body.score
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(204).json();
        }
    });
};

module.exports.deleteOneAnswer = function (req, res) {
    var answerId = req.params.answerId;
    Answers.findByIdAndRemove(answerId, (err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(204).json();
        }
    });
};