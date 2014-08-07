var mongoose = require('mongoose');
var gameModel = require('./games');
var request = require('request');

var weekSchema = mongoose.Schema({
    week: String,
    start: Date,
    completed: Boolean
});

var Week = mongoose.model('Week', weekSchema);
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var Pick = mongoose.model('Pick');

var api_key = "xfw4ebcua3pe2tvgwkfhxwyc";

exports.createWeeksAndGames = function() {
    Week.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            request.get({
                uri: "http://api.sportsdatallc.org/nfl-t1/2014/PRE/schedule.json?api_key="+api_key,
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
                            start: week.games[0].scheduled,
                            completed: false
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

exports.updateGames = function(today) {
    var currentWeek = 0;
    Week.find({}).exec(function(err, collection) {
        if(err) {

        } else {
            loopIterate(collection, function() {
                console.log("Done");
            }, 5000);
//            collection.forEach(function(week) {
//
//            })
        }
    });
}

function loopIterate(array, callback, interval) {
    process();

    function process() {
        var week = array.shift();
        if(week != null)
        {
            var currentDate = new Date();
            var startDate = new Date(week.start);
            if (week.completed == false) {
                console.log("Checking Week " + week.week);
                if (currentDate.getTime() > startDate.getTime()) {
                    var currentWeek = week.week;
                    console.log("Grabbing Week");
                    request.get({
                        uri: "http://api.sportsdatallc.org/nfl-t1/2014/PRE/" + currentWeek + "/boxscore.json?api_key=" + api_key,
                        json: true,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    },
                    function (error, res, object) {
                        if (error) {
                            console.log(error.message);
                        }
                        else {
                            var games = object.games;
                            getGames(games);

                            console.log("Games For Week " + currentWeek + " Updated");
                        }
                    })
                }

                Pick.find({week: week.week, status: {$ne: 'closed'}}, function(err, picks) {
                    if(err) {
                        console.log(err.message);
                    } else {
                        if(picks.length === 0) {
                            week.completed = true;
                            week.save(function(err) {
                                if(err) {
                                    console.log(err.message);
                                } else {
                                    console.log("Week Completed");
                                }
                            })
                        }
                    }
                })

            }
        }
        else {
            callback;
        }

        setTimeout(process, interval);
    }
};

function getGames(games) {
    update();

    function update()
    {
        var game = games.shift();
        if(game != null) {
            Pick.find({game: game.id}, function (err, picks) {
                console.log(picks);
                if (err) {
                    console.log(err.message);
                } else {
                    if (picks.length === 0) {
                        console.log("No Picks Exists")
                    } else {
                        console.log("Updating Picks");
                        updatePicks(picks, game);
                    }
                }
            });
            update();
        }
    }
}

var updatePicks = function(picks, game) {
    update();

    function update()
    {
        var pick = picks.shift();
        if(pick != null) {
            pick.status = game.status;
            pick.scores = [game.home_team.points, game.away_team.points];

            if(game.status == 'closed') {
                if(pick.calculated === false) {
                    var winner = 0;
                    if (game.away_team.points > game.home_team.points) {
                        winner = 1;
                    }
                    console.log(pick.user);
                    User.findOne({username: pick.user}, function (err, user) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            if (user.length === 0) {

                                console.log("ERROR: User Not Found");
                            } else {
                                if (pick.pick == pick.teams[winner] && pick.pick != null) {
                                    user.score += pick.points;
                                    user.correct++;
                                }

                                pick.calculated = true;
                                user.total++;

                                console.log('Pick Updated');

                                user.save(function (err) {
                                    if (err) {
                                        console.log(err.message);
                                    } else {
                                        console.log("User Points Updated");
                                    }
                                })

                                pick.save(function(err) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        console.log("Game Updated");
                                    }
                                });
                            }
                        }
                    })
                }
            }

            update();
        };
    }
}



