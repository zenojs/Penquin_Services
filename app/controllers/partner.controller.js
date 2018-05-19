var Partner = require('../models/partner.model.js');
var dbConfig = require('../../config/database.config');
var jwt = require('jsonwebtoken');

exports.create = function (req, res) {
    
    // Create and Save a new partner
    if (!req.body.content) {
        return res.sendStatus(400).send({ message: "partner can not be empty" });
    }

    var partner = new Partner({
        title: req.body.title || "Untitled partner",
        content: req.body.content,
        password: req.body.password,
        admin: req.body.admin
    });

    partner.save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: "Some error occurred while creating the partner." });
        } else {
            return res.send(data);
        }
    });
};

exports.findAll = function (req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, dbConfig.secret, function (errMsg, decoded) {
        if (errMsg) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        //res.status(200).send(decoded);

        // Retrieve and return all partners from the database.
        Partner.find(function (err, partner) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Some error occurred while retrieving partners." });
            } else {
                return res.send(partner);
            }
        });
    });
};

exports.findOne = function (req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, dbConfig.secret, function (errMsg, decoded) {
        if (errMsg) return res.status(500).send({ auth: false, message: errMsg });
        console.log(decoded);
        //res.status(200).send(decoded);
        //});
        //if (!req.authenticated) return res.status(501).send({ message: "Authentcation failed !!!" });

        // Find a single partner with a partnerId
        Partner.findById(req.params.partnerID, function (err, partner) {
            if (err) {
                console.log(err);
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({ message: "partner not found with id " + req.params.partnerId });
                }
                return res.status(500).send({ message: "Error retrieving partner with id " + req.params.partnerId });
            }

            if (!partner) {
                return res.status(404).send({ message: "partner not found with id " + req.params.partnerId });
            }

            res.send(partner);
        });
    });
};

exports.update = function (req, res) {
    // Update a partner identified by the partnerId in the request
    Partner.findById(req.params.partnerID, function (err, partner) {
        if (err) {
            console.log(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: "partner not found with id " + req.params.partnerId });
            }
            return res.status(500).send({ message: "Error finding partner with id " + req.params.partnerId });
        }

        if (!partner) {
            return res.status(404).send({ message: "partner not found with id " + req.params.partnerId });
        }

        partner.title = req.body.title;
        partner.content = req.body.content;

        partner.save(function (err, data) {
            if (err) {
                return res.status(500).send({ message: "Could not update partner with id " + req.params.partnerId });
            } else {
                return res.send(data);
            }
        });
    });
};

exports.delete = function (req, res) {
    // Delete a partner with the specified partnerId in the request
    Partner.findByIdAndRemove(req.params.partnerId, function (err, partner) {
        if (err) {
            console.log(err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: "partner not found with id " + req.params.partnerId });
            }
            return res.status(500).send({ message: "Could not delete partner with id " + req.params.partnerId });
        }

        if (!partner) {
            return res.status(404).send({ message: "partner not found with id " + req.params.partnerId });
        }

        return res.send({ message: "partner deleted successfully!" })
    });
};