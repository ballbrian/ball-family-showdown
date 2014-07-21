var mongoose = require('mongoose');
var gameModel = require('./games');
var request = require('request');

var weekSchema = mongoose.Schema({
    week: String
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
                    console.log(object);
                    object.weeks.forEach(function(week) {
                        Week.create({
                            week: week.number
                        })
                        var gameNumber = 1;
                        week.games.forEach(function(game) {
                            var game = Game.create({
                                id: game.id,
                                game: gameNumber,
                                week: week.number,
                                scheduled: game.scheduled,
                                homeTeam: game.home,
                                awayTeam: game.away
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
