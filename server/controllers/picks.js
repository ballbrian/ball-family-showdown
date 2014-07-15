var Team = require('mongoose').model('Team');
var Week = require('mongoose').model('Week');
var Game = require('mongoose').model('Game');

exports.getTeams = function(req, res) {
    Team.find({}).exec(function(err, collection) {
        if(err) {
            console.log("ERROR");
            console.log(err);
        } else {
            console.log("SUCCESS");
            res.send(collection);
        }
    })
}

exports.getWeeks = function(req, res) {
    Week.find({}).exec(function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            res.send(collection);
        }

    })
}

exports.getGamesForWeek = function(req, res) {
    console.log(req.params.week);
    Game.find({week: req.params.week}).exec(function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            res.send(collection);
        }
    })
}
