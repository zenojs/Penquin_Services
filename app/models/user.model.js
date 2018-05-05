// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema(
    {
        userid: String, 
        name: String,  
        gender: String,  
        dateofbirth: String,  
        email: String,  
        mobile: Number,  
        password: String,  
        thumbnailurl: String,
        isauthorized: Boolean
    },
    {
        timestamps: true
    });

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);