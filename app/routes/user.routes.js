module.exports = function (app) {

    var user = require('../controllers/user.controller.js');

    app.post('/api/getusers', user.getusers);

    //Route to authenticate a user
    app.post('/api/authenticate', user.authenticate);

    //Route to register a user
    app.post('/api/register', user.register);    
}