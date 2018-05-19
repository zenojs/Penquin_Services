module.exports = function (app) {

    var partner = require('../controllers/partner.controller.js');

    // Create a new partner
    app.post('/partner',  partner.create);

    // Retrieve by partnerID
    app.get('/partner/:partnerID', partner.findOne);

    // Retrieve all
    app.get('/partner', partner.findAll);

    // Update
    app.put('/partner/:partnerID', partner.update);

    // Delete
    app.delete('/partner/:partnerID', partner.delete);
}