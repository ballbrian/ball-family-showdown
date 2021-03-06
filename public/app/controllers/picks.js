angular.module('app').controller('picksController', function($scope, $location, dateFormatter, bfNotifier, bfIdentity, bfPicks, bfWeeks, bfGames, bfTeams) {
    $scope.maxPoints = [];

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

    $scope.sortWeeks = function(week) {
        return parseInt(week.week);
    }

    $scope.getPoints = function(score, status) {
        status = status.toLowerCase();
        if(status == "inprogress" || status == "closed" || status == "complete" || status == "delayed") {
            return score;
        } else {
            return "";
        }
    }

    $scope.getGameStatus = function(status) {
        status = status.toLowerCase();
        if(status == "closed" || status == "complete") {
            return "Final";
        } else if (status == "inprogress") {
            return "In Progress";
        } else if (status == "delayed") {
            return "Delayed";
        } else if (status == "scheduled") {
            return "";
        }
    }

    $scope.disablePick = function(status) {
        status = status.toLowerCase();
        if (status == "inprogress" || status == "closed" || status == "delayed" || status == "complete") {
            return true;
        } else {
            return false;
        }
    }

    $scope.formattedDate = function(date) {
        var formattedDate = new Date(date);
        return dateFormatter.FormatDate(formattedDate, "dddd MMM d, yyyy @ h:mmtt", "");
    }

    $scope.getWeek = function(week) {
        if(week != null) {
            $scope.picks = bfPicks.query({"week": week.week, "user": bfIdentity.currentUser.username}, function(picks) {
                $scope.maxPoints = [];
                var point = 0;
                $scope.maxPoints.push(point);
                point++;
                picks.forEach(function(pick) {
                    $scope.maxPoints.push(point);
                    point++;
                })
            });
        }
    }

    $scope.getAvailablePoints = function(currentPick) {
        var availablePoints = $scope.maxPoints.slice(0);
        $scope.picks.forEach(function (pick) {
            if(pick.game != currentPick.game) {
                var index = availablePoints.indexOf(pick.points);
                if(index != -1) {
                    availablePoints.splice(index, 1);
                }
            }
        })
        return availablePoints;
    }

    $scope.updatePicks = function() {
        bfPicks.update($scope.picks, function() {
            bfNotifier.notify("Picks Updated");
        });
    }
})
