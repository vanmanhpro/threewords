const express = require('express');
const mongoose = require('mongoose');

const Router = express.Router();

const notiController = require('./notifications/notiController.js');

Router.get('/:userId/:skip', (req, res) => {
	let userId = req.params.userId;
	let skip = req.params.skip;
	notiController.getNoti(userId, skip)
	.then((data) => {
		res.send(data);
	})
	.catch((err) => {
		console.log(err);
	})
});

Router.post('/', (req, res) => {
	let notiData = req.body;
	if(notiData.type == "vote"){
		notiController.updateNoti(notiData)
		.then((data) => {
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		})
	} else {
		notiController.createNoti(notiData)
		.then((data) => {
			console.log("created noti");
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		})
	}
})

module.exports = Router;
