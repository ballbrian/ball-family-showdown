var userController = require('../controllers/user');
var authController = require('../controllers/auth');

module.exports = function(app) {
    app.get('/api/users', authController.isAdmin('admin'), userController.getUsers);
    app.post('/api/users', userController.createUser);
}