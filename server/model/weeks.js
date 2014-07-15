var mongoose = require('mongoose');
var gameModel = require('./games');
var request = require('request');

var weekSchema = mongoose.Schema({
    week: String
});

var Week = mongoose.model('Week', weekSchema);
var Game = gameModel.getGameModel;

exports.createWeeksAndGames = function() {
    Week.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            request.get({
                uri: "http://api.sportsdatallc.org/nfl-t1/2014/REG/schedule.json?api_key=bdw3a2s24mksfv4e989t3t22",
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
                            week: week.number
                        })
                        week.games.forEach(function(game) {
                            var game = Game.create({
                                id: game.id,
                                week: week.number,
                                homeTeam: game.home,
                                awayTeam: game.away
                            })
                        });
                    });
                }
            })
        }
    });
}
