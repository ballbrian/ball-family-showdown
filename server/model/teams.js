var mongoose = require('mongoose');
var request = require('request');

var teamSchema = mongoose.Schema({
    id: String,
    city: String,
    name: String
});

var Team = mongoose.model('Team', teamSchema);

exports.createTeams = function() {
    Team.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            request.get({
                    uri: "http://api.sportsdatallc.org/nfl-t1/teams/hierarchy.json?api_key=bdw3a2s24mksfv4e989t3t22",
                    json: true,
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                },
                function(error, res, object) {
                    if(error) {
                        console.log(error.message);
                    }
                    else
                    {
                        object.conferences.forEach(function(conference) {
                            conference.divisions.forEach(function(division) {
                                division.teams.forEach(function(team) {
                                    Team.create({
                                        id: team.id,
                                        name: team.name,
                                        city: team.market
                                    })
                                });
                            });
                        });
                    }
                })
        }
    });
}
