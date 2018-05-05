var mongoose = require('mongoose');

var PartnerSchema = mongoose.Schema(
    {
        title: String,
        content: String,
        password: String, 
        admin: Boolean 
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model('Partner', PartnerSchema);

