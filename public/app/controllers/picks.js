angular.module('app').controller('picksController', function($scope, dateFormatter, bfNotifier, bfIdentity, bfPicks, bfWeeks, bfGames, bfTeams) {
    $scope.teamsMap = {};
    var teams = bfTeams.query(function() {
        for(var i = 0; i < teams.length; i++) {
            $scope.teamsMap[teams[i].id] = teams[i];
        }
    });

    $scope.weeks = bfWeeks.query(function(data) {
        var weekFound = false;
        $scope.weeks.forEach(function(week) {
            if(weekFound == false) {
                var currentDate = new Date();
                var startDate = new Date(week.start);
                if(startDate.getTime() > currentDate.getTime()) {
                    $scope.selectedWeek = week;
                    $scope.getWeek(week);
                    weekFound = true;
                }
            }
        })
    });

    $scope.formattedDate = function(date) {
        var formattedDate = new Date(date);
        return dateFormatter.FormatDate(formattedDate, "dddd MMM d, yyyy @ h:mmtt", "");
    }

    $scope.getWeek = function(week) {
        if(week != null) {
            $scope.picks = bfPicks.query({"week": week.week, "user": bfIdentity.currentUser.username});
        }
    }

    $scope.updatePicks = function() {
        bfPicks.update($scope.picks, function() {
            bfNotifier.notify("Picks Updated");
        });
    }
})
