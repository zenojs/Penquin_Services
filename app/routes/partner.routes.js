module.exports = function (app) {

    var partner = require('../controllers/partner.controller.js');
    
    //Route to authenticate a user
    app.post('/api/authenticate', partner.authenticate);

    // Create a new partner
    app.post('/partner', partner.create);

    // Retrieve all
    app.get('/partner', partner.findAll);

    // Retrieve by partnerID
    app.get('/partner/:partnerID', partner.findOne);

    // Update
    app.put('/partner/:partnerID', partner.update);

    // Delete
    app.delete('/partner/:partnerID', partner.delete);
}