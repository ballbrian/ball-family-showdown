var mongoose = require('mongoose');
var crypto = require('crypto');
var encrypt = require('../utilities/encryption');
var schedule = require('node-schedule');

var teamModel = require('../model/teams'),
    userModel = require('../model/user'),
    picksModel = require('../model/picks'),
    weeksModel = require('../model/weeks');

var TeamsController = require('../controllers/teams');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('ballshowdown db opened');
    });

//    userModel.createDefaultUsers();

    TeamsController.createTeams();
    setTimeout(function() {
        weeksModel.createWeeksAndGames();
    }, 5000);

    //CST is -500 UTC
    // 7 = 0
    // 8 = 1
    // 9 = 2
    // 10 = 3
    // 11 = 4


    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(5,6)];
    rule.hour = new schedule.Range(0, 4);
    rule.minute = [0, 15, 30, 45];

    schedule.scheduleJob(rule, function() {
//    schedule.scheduleJob("*/15 19,20,21,22 * * 4,5,6", function() {
        RunUpdate();
    })

    setTimeout(function() {
        RunUpdate();
    }, 10000);

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

    weeksModel.updateGames(today);

    today = mm+'/'+dd+'/'+yyyy + " - " + hh+":"+mm+":"+ss;

    console.log('Job Ran: ' + today);
}
