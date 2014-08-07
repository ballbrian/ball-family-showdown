var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var User = mongoose.model('User');

exports.getStandings = function(req, res) {
    User.find({}).exec(function (err, collection) {
        if(err){
            res.status(404);
            res.send({message: "No Users Found"});
        } else {
            var standings = []
            collection.forEach(function (user) {
                standings.push({username: user.username, firstName: user.firstName, lastName: user.lastName, score: user.score, correct: user.correct, total: user.total});
            })

            res.status(200);
            res.send(standings);
        }
    })
};