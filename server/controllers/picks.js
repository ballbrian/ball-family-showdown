var Team = require('mongoose').model('Team');
var Week = require('mongoose').model('Week');
var Game = require('mongoose').model('Game');
var Pick = require('mongoose').model('Pick');

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
    Game.find({week: req.params.week}).exec(function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            res.send(collection);
        }
    })
}

exports.getPicksForUserForWeek = function(req, res) {
    Pick.find({user: req.params.user, week: req.params.week}).exec(function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            res.send(collection);
        }
    })
}

exports.savePicks = function(req, res) {
    var picks = req.body;

    picks.forEach(function(updatedPick) {
        Pick.findOne({game: updatedPick.game, user: updatedPick.user}, function(err, pick) {
            pick.pick = updatedPick.pick;
            pick.save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Updated");
                }
            })
        })
    });

    console.log("Done");
}
