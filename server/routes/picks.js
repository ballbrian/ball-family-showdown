var controller = require('../controllers/picks');

module.exports = function(app) {
    app.get('/api/teams', controller.getTeams);

    app.get('/api/weeks', controller.getWeeks);

    app.get('/api/games/:week', controller.getGamesForWeek);

    app.get('/api/picks/:week/:user', controller.getPicksForUserForWeek);

    app.put('/api/picks', controller.savePicks);
};

