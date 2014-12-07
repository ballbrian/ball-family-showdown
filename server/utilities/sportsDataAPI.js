var request = require('request');

//var api_key = "xfw4ebcua3pe2tvgwkfhxwyc";
var api_key = "53kk23z65fh3prjzb8d9p559";
var TeamsURI = "http://api.sportsdatallc.org/nfl-t1/teams/hierarchy.json?api_key=";

exports.GetSchedule = function() {

}

exports.GetWeeklyBoxScore = function () {
    
}

exports.GetTeams = function (callback) {
    request.get({
            uri: TeamsURI+api_key,
            json: true,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        },
        function(error, res, object) {
            if (error) {
                console.log(error.message);
            }
            else {
                if (object.length === 0) {
                    console.log("No Teams Found From API");
                } else {
                    callback(object);
                }
            }
        })
}