var Admin = require('mongoose').model('AdminOption');
var Week = require('mongoose').model('Week');
var Game = require('mongoose').model('Game');
var Pick = require('mongoose').model('Pick');
var User = require('mongoose').model('User');

var GameController = require('../controllers/games');
var PickController = require('../controllers/picks');
var UserController = require('../controllers/user');

exports.getAdminOptions = function(req, res) {
    Admin.find({}).exec(function(err, collection) {
        if(err) {
            res.status(404);
            res.send({message: "No Admin Options Found"})
        } else {
            res.status(200);
            res.send(collection);
        }
    })
}

exports.defaultAdminOptions = function() {
    Admin.find({}).exec(function(err, collection) {
        if(err) {
            console.log("Error Getting Admin Options")
        } else {
            if(collection.length === 0) {
                console.log("Creating Admin Options");
                Admin.create({season: "PRE"}).then(function() {
                    console.log("Default Admin Options Created!")
                })
            } else {
                console.log("Admin Options Loaded");
            }
        }
    })
}

exports.saveAdminOptions = function(req, res) {
    var adminOptions = req.body;

    Admin.findOneAndUpdate({}, {season: adminOptions.season}, function(err) {
        if(err) {
            SendAPIResponse(res, 404, "Error Finding Admin Options");
        } else {
            console.log("Updated Admin Options and Now Creating New Season");

            GameController.removeGames(function(err) {
                if (err) {
                    SendAPIResponse(res, 403, "Error Removing Games");
                } else {
                    PickController.removePicks(function (err) {
                        if (err) {
                            SendAPIResponse(res, 403, "Error Removing Picks");
                        } else {
                            if (adminOptions.reset === true) {
                                UserController.resetScores(function(err) {
                                    if(err) {
                                        SendAPIResponse(res, 403, "Error Reseting Users");
                                    }
                                });
                            }

                            GameController.createWeeksAndGames( function() {
                                User.find({}).exec(function (err, users) {
                                    if(err) {
                                        SendAPIResponse(res, 403, "Error Creating New Picks");
                                    } else {
                                        users.forEach(function(user) {
                                            UserController.createPicks(user, function(err) {
                                                if(err) {
                                                    SendAPIResponse(res, 403, "Error Creating New Picks");
                                                }
                                            })
                                        });

                                        SendAPIResponse(res, 200, "Success");

                                    }
                                })
                            });
                        }
                    })
                }
            })
        }
    });
}

var SendAPIResponse = function(res, status, message) {
    console.log("Status: "+status+", Message: "+message);
    res.status(status);
    res.send({message: message});
}