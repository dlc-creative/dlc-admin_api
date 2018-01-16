"use strict";

var _ = require('lodash');
var pdf = require('pdfkit');
var bs = require('blob-stream');
var uuid = require('uuid');
const config = require('../config').current;
var mailjet = require('node-mailjet').connect(config.mj_apikey_public, config.mj_apikey_secret);

var AdminModel = require('./models/admin').AdminModel;


var router = function(app, jwt) {

	app.get("/api/clients", function(req, res) {

		console.log('Api Req: ' + req.method + ' ' + req.originalUrl);
		AdminModel.getListData('clients', function(error, response) {
			if (error) {
				console.error(req.originalUrl + ' => ' + req.method + ' error', error);
				return res.sendStatus(400).send(error);
			}
			console.log('routes res', response[0]);
			res.send(response[0]);
		})

	});

	app.get("/api/projects", function(req, res) {

		console.log('Api Req: ' + req.method + ' ' + req.originalUrl);
		AdminModel.getListData('projects', function(error, response) {
			if (error) {
				console.error(req.originalUrl + ' => ' + req.method + ' error', error);
				return res.sendStatus(400).send(error);
			}
			console.log('routes res', response[0]);
			res.send(response[0]);
		})

	});

	app.post("/api/email", function(req, res) {

		var request = mailjet.post("send").request({
				        "FromEmail":"banksdr@miamioh.edu",
				        "FromName":"DLC CREATIVE",
				        "Subject":"DLC Admin Portal",
				        "Text-part":"The Vulcan.",
				        "Html-part":"<h3>DLC CREATIVE TEST EMAIL</h3>",
				        "Recipients":[
			                {"Email": "chazmanweeden3@gmail.com"},
	                        {"Email": "ltbates89@gmail.com"},
		                    {"Email": "banksdr@muohio.edu"}
				        ]
				    });

		request
	    .then(result => {
	        console.log(result.body)
	    })
	    .catch(err => {
	        console.log(err.statusCode)
	    })


	});

	app.get("/api/pdf", function(req, res) {

		const doc = new pdf();
		const stream = doc.pipe(bs());
		const invoiceData = JSON.parse(req.query.data);
		const BASE_X_AXIS = 50;
		console.log('pdf api generated', doc.page.width);
		let id = uuid.v4();
		var uniqueInvoiceName = `Invoice: ${ id }`;
		// console.log('data', req.query.data);
		// console.log('invoice data', invoiceData);

		// res.setHeader('Content-type', 'application/pdf');
		res.setHeader('Access-Control-Allow-Origin', '*');
		// res.setHeader('Content-disposition', `attachment; filename="Invoice"`);

		doc.image('assets/img/DLC-Horizontal.png', (doc.page.width - 250) / 2).moveDown(2);

		doc.font('Helvetica')
			.fontSize(16)
			.fill('#000')
			.text(uniqueInvoiceName, BASE_X_AXIS).moveDown();

		doc.fontSize(12)
			.fill('#000000');				

		doc.text('CLIENT', BASE_X_AXIS, 230)
		   .moveTo(145, 242)
		   .text(invoiceData.client.value, 145, 230)
		   .lineTo(350, 242)
		   .stroke();

		doc.text('PROJECT', BASE_X_AXIS, 250)
		   .moveTo(145, 262)
		   .text(invoiceData.project.value, 145, 250)
		   .lineTo(350, 262)
		   .stroke();

		doc.pipe(res);

		doc.end();

	});

}

module.exports = router;