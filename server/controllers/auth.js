var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Pick = mongoose.model('Pick');
var Game = mongoose.model('Game');
var encrypt = require('../utilities/encryption');

exports.authenticate = function(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.send({success: false})
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send({success: true, user: user});
        })
    });
    auth(req, res, next);
};

exports.logout = function(req, res) {
    req.logout();
    res.end();
};

exports.isAuthenticated = function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};

exports.getUsers = function(req, res) {
    User.find({}).exec(function (err, collection) {
        res.send(collection);
    })
};

exports.createUser = function(req, res, next) {
    var userData = req.body;
    userData.username = userData.username.toLowerCase();
    userData.salt = encrypt.createSalt();
    userData.password = encrypt.hashPwd(userData.salt, userData.password);

    Game.find({}).exec(function(err, collection) {
        collection.forEach(function(game) {
            Pick.create({
                user: userData.username,
                week: game.week,
                game: game.id,
                scheduled: game.scheduled,
                teams: [game.homeTeam, game.awayTeam],
                pick: "",
                stadium: game.stadium,
                city: game.city,
                state: game.state,
                field: game.field,
                type: game.type
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

}

exports.isAdmin = function(role) {
    return function (req, res, next) {
        if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    }
};


