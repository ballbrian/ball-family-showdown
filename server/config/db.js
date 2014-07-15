var mongoose = require('mongoose');
var crypto = require('crypto');
var encrypt = require('../utilities/encryption');

var userModel = require('../model/user'),
    teamsModel = require('../model/teams'),
    weeksModel = require('../model/weeks');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('ballshowdown db opened');
    });

    userModel.createDefaultUsers();
    teamsModel.createTeams();
    weeksModel.createWeeksAndGames();

}
