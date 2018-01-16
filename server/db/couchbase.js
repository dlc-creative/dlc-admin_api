'use strict';
const couchbase = require('couchbase');
const Promise = require('bluebird');
const config = require('../config').current;

const couchbaseConnection = module.exports = {};

couchbaseConnection.url = `couchbase://${config.db_host}`;
couchbaseConnection.cluster = new couchbase.Cluster(couchbaseConnection.url);
couchbaseConnection.bucketName = config.db_name;
couchbaseConnection.bucketPassword = config.db_password;
couchbaseConnection.bucketPromise = new Promise((resolve, reject) => {
    couchbaseConnection.bucket = couchbaseConnection.cluster.openBucket(couchbaseConnection.bucketName, couchbaseConnection.bucketPassword, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve(couchbaseConnection.bucket);
        }
    });
});
