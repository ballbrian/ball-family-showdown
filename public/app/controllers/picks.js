angular.module('app').controller('picksController', function($scope, bfPicks, bfWeeks, bfGames, bfTeams) {
    $scope.teamsMap = {};
    var teams = bfTeams.query(function() {
        for(var i = 0; i < teams.length; i++) {
            $scope.teamsMap[teams[i].id] = teams[i];
        }
    });

    $scope.weeks = bfWeeks.query();

    $scope.getWeek = function(week) {
        if(week != null) {
            $scope.games = bfGames.query({"week": week.week});
        }
    }

    $scope.selectPick = function(game, pick) {
        console.log(game);
        console.log(pick);
    }
})
