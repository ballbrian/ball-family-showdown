var controller = require('../controllers/auth');

module.exports = function(app) {
    app.post('/login', controller.authenticate);
    app.post('/logout', controller.logout);
}