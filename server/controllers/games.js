var mongoose = require('mongoose');
var request = require('request');

var winston = require('winston');

var Week = mongoose.model('Week');
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var Pick = mongoose.model('Pick');
var Admin = mongoose.model('AdminOption');

var api_key = "xfw4ebcua3pe2tvgwkfhxwyc";

exports.createWeeksAndGames = function(callback) {

    var season = "PRE";

    Admin.find({}, function(err, collection) {
        if(err) {
            console.log("Error finding Admin Options");
        } else {
            season = collection[0].season;
        }
    });

    Week.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            request.get({
                    uri: "http://api.sportsdatallc.org/nfl-t1/2014/"+season+"/schedule.json?api_key="+api_key,
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
                        callback();
                    }
                })
        }
    });

}

exports.removeGames = function(callback) {
    Week.remove({}, function(err) {
        if(err) {
            callback(err);
        } else {
            Game.remove({}, function(err) {
                if(err) {
                    callback(err);
                }
                callback();
            })
        }
    })
}

exports.updateGames = function(today) {
    Week.find({}).exec(function(err, collection) {
        if(err) {

        } else {
            loopIterate(collection, function() {
                winston.log("info", "Finished");
                console.log("Done");
            }, 5000);
        }
    });
}


//TODO


function loopIterate(array, callback, interval) {
    process();

    function process() {
        var week = array.shift();
        if(week != null)
        {
            var season = "PRE";

            Admin.find({}, function(err, collection) {
                if(err) {
                    console.log("Error finding Admin Options");
                } else {
                    season = collection[0].season;
                    var currentDate = new Date();
                    var startDate = new Date(week.start);
                    if (week.completed == false) {
                        console.log("Checking Week " + week.week);
                        if (currentDate.getTime() > startDate.getTime()) {
                            var currentWeek = week.week;
                            console.log("Grabbing Week");
                            request.get({
                                    uri: "http://api.sportsdatallc.org/nfl-t1/2014/"+season+"/" + currentWeek + "/boxscore.json?api_key=" + api_key,
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
                                        getGames(games, function() {
                                            console.log("Games For Week " + currentWeek + " Updated");
                                            winston.log("info", "Games For Week " + currentWeek + " Updated");
                                        });
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
            });
        }
        else {
            callback();
        }

        setTimeout(process, interval);
    }
};

function getGames(games, callback) {
    update();

    function update()
    {
        var game = games.shift();
        if(game != null) {
            Pick.find({game: game.id}, function (err, picks) {
                if (err) {
                    console.log(err.message);
                } else {
                    if (picks.length === 0) {
                        console.log("No Picks Exists")
                    } else {
                        console.log("Updating Picks");
                        winston.log("info", "Updating Picks");
                        updatePicks(picks, game, function() {
                            console.log("back");
                            update();
                        });
                    }
                }
            });
        } else {
            callback();
        }
    }
}

var updatePicks = function(picks, game, callback) {
    update();

    function update()
    {
        var pick = picks.shift();
        if(pick != null) {
            console.log(game);
            pick.status = game.status;
            pick.scores = [game.home_team.points, game.away_team.points];
            if(game.status == 'closed' || game.status == 'complete') {
                console.log("Game Closed");
                if(pick.calculated === false) {
                    var winner = 0;
                    if (game.away_team.points > game.home_team.points) {
                        winner = 1;
                    }
                    console.log("Winner: " + winner);
                    User.findOne({username: pick.user}, function (err, user) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            if (user.length === 0) {
                                console.log("ERROR: User Not Found");
                            } else {
                                console.log("jdlkfajsdfj");
                                if (pick.pick == pick.teams[winner] && pick.pick != null) {
                                    user.score += pick.points;
                                    user.correct += 1;
                                }

                                pick.calculated = true;
                                user.total += 1;

                                console.log("User: " + pick.user + " Pick: " + pick.pick);
                                console.log('Pick Updated');
                                winston.log("info","User: " + pick.user + " Pick: " + pick.pick);
                                winston.log("info",'Pick Updated');

                                user.save(function (err) {
                                    if (err) {
                                        console.log(err.message);
                                    } else {
                                        winston.log("info", "User Points Updated");
                                        console.log("User Points Updated");

                                        pick.save(function(err) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                winston.log("info", "Game Updated - Saved");
                                                console.log("Game Updated");
                                            }
                                            update();
                                            console.log("update called")
                                        });
                                    }
                                })
                            }
                        }
                    })
                } else {
                    update();
                }
            } else {
                console.log("I'm Here");
                pick.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        winston.log("info", "Game Updated");
                        console.log("Game Updated");
                    }
                    update();
                });
            }
        } else {
            console.log("callback");
            callback();
        }
    }
}


