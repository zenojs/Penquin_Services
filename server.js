var jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// create express app
var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log(req.url);
    if (req.url.indexOf('login') >= 0 && (!req.session || !req.session.authenticated)) {
        //if(req.body.url
        var token = (req.headers && req.headers.authorization) || (req.body.token || req.query.token || req.headers['x-access-token']);
        if (token) {
            console.log("verfiying token");
            //Decode the token
            jwt.verify(token, dbConfig.secret, (err, decod) => {
                if (err) {
                    res.status(403).json({ message: "Wrong Token" });
                }
                else {
                    //If decoded then call next() so that respective route is called.
                    req.decoded = decod;
                    next();
                }
            });
        }
        else {
            res.status(403).json({ message: "No Token" });
        }
    }
    next();
});

app.use(function (req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

// Configuring the database
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function () {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function () {
    console.log("Successfully connected to the database");
})

// define a simple route
app.get('/', function (req, res) {
    res.json({ "message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

require('./app/routes/user.routes.js')(app);
require('./app/routes/partner.routes.js')(app);


// listen for requests
app.listen(port, function () {
    console.log("Server is listening on port 3000");
});