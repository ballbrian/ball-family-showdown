var sportsAPI = require('../utilities/sportsDataAPI');

var mongoose = require('mongoose');
var Team = mongoose.model('Team');

exports.createTeams = function() {
    Team.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            sportsAPI.GetTeams(function(teams) {
                teams.conferences.forEach(function (conference) {
                    conference.divisions.forEach(function (division) {
                        division.teams.forEach(function (team) {
                            Team.create({
                                id: team.id,
                                name: team.name,
                                city: team.market
                            })
                        });
                    });
                });
                console.log("Teams Created");
            })
        }
    })
}
