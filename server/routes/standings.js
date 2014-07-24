var controller = require('../controllers/standings');

module.exports = function(app) {
    app.get('/api/standings', controller.getStandings);
}
