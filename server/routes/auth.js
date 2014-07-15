var controller = require('../controllers/auth');

module.exports = function(app) {
    app.post('/login', controller.authenticate);
    app.post('/logout', controller.logout);

    //Api
    app.get('/api/users', controller.isAdmin('admin'), controller.getUsers);
    app.post('/api/users', controller.createUser);
}