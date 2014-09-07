var mongoose = require('mongoose');
var crypto = require('crypto');
var encrypt = require('../utilities/encryption');
var schedule = require('node-schedule');

var teamModel = require('../model/teams'),
    userModel = require('../model/user'),
    picksModel = require('../model/picks'),
    weeksModel = require('../model/weeks'),
    adminModel = require('../model/admin');

var GamesController = require('../controllers/games');
var TeamsController = require('../controllers/teams');
var adminController = require('../controllers/admin');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('ballshowdown db opened');
    });

    adminController.defaultAdminOptions();

//    userModel.createDefaultUsers();

    TeamsController.createTeams();
    setTimeout(function() {
        GamesController.createWeeksAndGames(function() {
            console.log("Created Weeks and Games Callback");
        });
    }, 5000);

    //CST is -500 UTC
    // 7 = 0
    // 8 = 1
    // 9 = 2
    // 10 = 3
    // 11 = 4


    setTimeout(function() {
        RunUpdate();
    }, 10000);

    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, 1, 5];
    rule.hour = new schedule.Range(0, 4);
    rule.minute = [0, 15, 30, 45];

    schedule.scheduleJob(rule, function() {
        RunUpdate();
    })

    rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0];
    rule.hour = new schedule.Range(17, 23); //23 - 6, 22 - 5, 21 - 4, 20 - 3, 19 - 2, 18 - 1, 17 - 12,
    rule.minute = [0, 15, 30, 45];

    schedule.scheduleJob(rule, function() {
        RunUpdate();
    })

}

var RunUpdate = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    GamesController.updateGames(today);

    today = mm+'/'+dd+'/'+yyyy + " - " + hh+":"+mm+":"+ss;

    console.log('Job Ran: ' + today);
}
