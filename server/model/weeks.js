var mongoose = require('mongoose');
var gameModel = require('./games');
var request = require('request');

var weekSchema = mongoose.Schema({
    week: String,
    start: Date
});

var Week = mongoose.model('Week', weekSchema);
var Game = mongoose.model('Game');

var api_key = "xfw4ebcua3pe2tvgwkfhxwyc";

exports.createWeeksAndGames = function() {
    Week.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            request.get({
                uri: "http://api.sportsdatallc.org/nfl-t1/2014/REG/schedule.json?api_key="+api_key,
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
                    object.weeks.forEach(function(week) {
                        Week.create({
                            week: week.number,
                            start: week.games[0].scheduled
                        })
                        var gameNumber = 1;
                        week.games.forEach(function(game) {
                            var game = Game.create({
                                id: game.id,
                                game: gameNumber,
                                week: week.number,
                                scheduled: game.scheduled,
                                homeTeam: game.home,
                                awayTeam: game.away,
                                stadium: game.venue.name,
                                city: game.venue.city,
                                state: game.venue.state,
                                field: game.venue.surface,
                                type: game.venue.type
                            })
                            gameNumber++;
                        });
                    });
                    console.log("Weeks and Games Created");
                }
            })
        }
    });
}
