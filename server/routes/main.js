var controller = require('../controllers/main');

module.exports = function(app) {
    app.get('*', controller.index);
}
