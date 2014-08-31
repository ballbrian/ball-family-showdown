var controller = require('../controllers/admin');

module.exports = function(app) {
    //API
    app.get('/api/adminOptions', controller.getAdminOptions);
    app.put('/api/adminOptions', controller.saveAdminOptions);
}
