"use strict";

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var path = require('path');
var jwt = require('jsonwebtoken');
var socket = require('socket.io');

const couchbaseConnection = require('./db/couchbase');
const config = require('./config').current;

var app = express();

app.options('*', cors());
app.use(cors());

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

couchbaseConnection.bucketPromise
    .then(bucket => {
        console.log('Couchbase: connected to', couchbaseConnection.url, 'and bucket', couchbaseConnection.bucketName);
    })
    .catch(err => {
        console.error('Couchbase: failed to connect to', couchbaseConnection.url);
        console.error(err);
        console.error('config:', JSON.stringify(config, null, 4));
    })
;

var routes = require("./api/routes")(app, jwt);

var server = app.listen(config.port, (err) => {
	if (err) {
		console.error(err);
	}
	console.log(`Listening on port ${config.port}`);
});

var io = socket(server);

io.on('connection', function(socket) {
    console.log(`
        -----------------------------------
        socket connected => id: ${socket.id}
        -----------------------------------
        `);
    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
    socket.on('chat', function(data) {
        io.sockets.emit('chat', data);
    });
    socket.on('createproject', function(data) {
        console.log('server project data >> ', data);
        io.sockets.emit('createproject', data);
    });
});