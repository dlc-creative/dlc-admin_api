"use strict";

const config = {
	env: process.env.NODE_ENV || 'local',
	production: {},
	development: {},
	local: {
		port: process.env.PORT || 5000,
		api_url: process.env.API_URL || 'http://localhost:5000/',
		db_host: process.env.DB_HOST || 'localhost:8091/',
		db_name: process.env.DB_NAME || 'dlc-admin',
		db_password: process.env.DB_PASSWORD || 'dlc',
		mj_apikey_public: process.env.MJ_APIKEY_PUBLIC || 'b95bfa18068da563e52c8832f95b3b60',
		mj_apikey_secret: process.env.MJ_APIKEY_SECRET || '78b1e559a56b4439cc021cd106a0ea7c',
		jwt_secret: 'dlc'
	},
	get current() {
		return this[this.env];
	}
};

module.exports = config;