var mongoose = require('mongoose');
var User = mongoose.model('User');
var Pick = mongoose.model('Pick');
var Game = mongoose.model('Game');
var encrypt = require('../utilities/encryption');

exports.createUser = function(req, res, next) {
    var userData = req.body;
    userData.username = userData.username.toLowerCase();
    userData.salt = encrypt.createSalt();
    userData.password = encrypt.hashPwd(userData.salt, userData.password);
    userData.score = 0;
    userData.correct = 0;
    userData.total = 0;

    Game.find({}).exec(function(err, collection) {
        collection.forEach(function(game) {

            var field = game.field.split("_").join(" ");
            field = field.charAt(0).toUpperCase() + field.substring(1);
            var type = game.type.split("_").join(" ");
            type = type.charAt(0).toUpperCase() + type.substring(1);

            Pick.create({
                user: userData.username,
                points: 0,
                week: game.week,
                game: game.id,
                scheduled: game.scheduled,
                scores: [0, 0],
                teams: [game.homeTeam, game.awayTeam],
                pick: "",
                stadium: game.stadium,
                city: game.city,
                state: game.state,
                field: field,
                type: type,
                status: "Scheduled",
                calculated: false
            })
        });
    });

    User.create(userData, function(err, user) {
        if(err) {
            if(err.toString().indexOf('E11000') > 1) {
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }
        req.logIn(user, function(err) {
            if(err) {return next(err);}
            res.send(user);
        })
    })
};

exports.updateUser = function(req, res) {
    var userUpdate = req.body;

    if(req.user.id != userUpdate.id && !req.user.hasRole('admin')) {
        res.status(403);
        return res.end();
    }

    req.user.firstName = userUpdates.firstName;
    req.user.lastName = userUpdates.lastName;
    req.user.username = userUpdates.username;
    req.user.email = userUpdates.email;

    if(userUpdates.password && userUpdates.password.length > 0) {
        req.user.salt = encrypt.createSalt();
        req.user.password = encrypt.hashPwd(req.user.salt, userUpdates.password);
    }

    req.user.save(function(err) {
        if(err) {
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            res.send(req.user);
        }
    })
};

exports.getUsers = function(req, res) {
    User.find({}).exec(function (err, collection) {
        res.send(collection);
    })
};
