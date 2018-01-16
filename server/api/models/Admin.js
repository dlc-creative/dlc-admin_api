"use strict";

var uuid = require('uuid');
var N1qlQuery = require('couchbase').N1qlQuery;
var bucket = require('../../db/couchbase').bucket;

const BASE_GET_ALL_ADMIN = `
	SELECT properties, meta(properties) AS meta
	FROM \`${bucket._name}\` properties
	WHERE __type = "Admin"
`;

const BASE_WHERE_ADMIN = `WHERE __type = "Admin"`;

const GET_ALL_ADMIN_SORT = N1qlQuery.fromString(`
	${BASE_GET_ALL_ADMIN}
	ORDER BY data.deadline ASC
`).adhoc(false);

const GET_ALL_ADMIN_CLIENTS = N1qlQuery.fromString(`
	SELECT clients FROM \`${bucket._name}\` ${BASE_WHERE_ADMIN}
`).adhoc(false);

const GET_ALL_ADMIN_PROJECTS = N1qlQuery.fromString(`
	SELECT projects FROM \`${bucket._name}\` ${BASE_WHERE_ADMIN}
`).adhoc(false);

class Admin {

	static getAllAdmin(callback) {
		bucket.query(GET_ALL_PROJECTS_SORT, function(err, res) {
			if (err) {
				console.error('admin model get all admins error', err);
				return callback(err, null);
			}
			callback(null, res);
		});
	}

	static getListData(type, callback) {
		var statement;
		switch(type.toLowerCase()) {
			case "clients":
				statement = GET_ALL_ADMIN_CLIENTS;
				break;
			case "projects":
				statement = GET_ALL_ADMIN_PROJECTS;
				break;
		}
		bucket.query(statement, function(err, res) {
			if (err) {
				console.error('admin model get list error', err);	
				return callback(err, null);
			}
			callback(null, res);
		});
	}

	static createProject(data, callback) {
		var admin = {
			__type: "Admin",
			data,
			timestamp: (new Date())
		};
		// console.log('data id', typeof(data.id));
		// return;
		let doc_id = uuid.v4();
		bucket.upsert(admin.__type, admin, function(err, res) {
			if (err) {
				console.error('admin model add new admin error', err);
				return callback(err, null);
			}
			callback(null, res);
		});
	}

}

module.exports.Admin = Admin;
module.exports.AdminModel = Admin;