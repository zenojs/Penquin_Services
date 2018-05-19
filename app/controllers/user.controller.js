const User = require('../models/user.model.js');
const dbConfig = require('../../config/database.config');
var jwt = require('jsonwebtoken');

exports.authenticate = function (req, res) {
    let userData = req.body;
    User.findOne({ email: userData.email }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
            else {
                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = { admin: user._id };
                var token = jwt.sign(payload, dbConfig.secret, { expiresIn: '1h' });

                // return the information including token as JSON
                res.status(200).send({ token });
                //res.json({ success: true, message: 'Enjoy your token!', token: token });
            }
        }
    })
    console.log(6);
}

exports.register = function (req, res) {
    // Create and Save a new user
    if (!req.body.name) {
        return res.sendStatus(400).send({ message: "user can not be empty" });
    }

    var user = new User({
        userid: req.body.userid,
        name: req.body.name,
        gender: req.body.gender,
        dateofbirth: req.body.dateofbirth,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        thumbnailurl: req.body.thumbnailurl || "http://imgs.bharatmatrimony.com/bmimgs/vp-avatar-f.gif",
        isauthorized: req.body.isauthorized
    });

    user.save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: "Some error occurred while creating the partner." });
        } else {
            let payload = { admin: data._id }
            let token = jwt.sign(payload, dbConfig.secret);
            return res.status(200).send({ token });
        }
    });
};

exports.getusers = function (req, res) {
    //console.log('Token Verified');
    // Retrieve and return all partners from the database.
    User.find(function (err, users) {
        if (err) {
            return res.status(500).send({ message: "Some error occurred while retrieving partners." });
        } else {
            return res.send(users);
        }
    });
};