var controller = require('../controllers/picks');

module.exports = function(app) {
    app.get('/api/teams', controller.getTeams);

    app.get('/api/weeks', controller.getWeeks);

    app.get('/api/games/:week', controller.getGamesForWeek);
};

