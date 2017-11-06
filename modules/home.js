const express = require('express');
const mongoose = require('mongoose');

const Router = express.Router();

const userController = require('./users/userController.js');

Router.get('/', (req, res) => {
	res.render('home');
});

Router.get('/page/:id', (req, res) => {
	let pageNumber = req.params.id;
	userController.getPage(pageNumber * 10)
	.then((data) => {
		res.send(data);
	})
});

Router.get('/skip/:id', (req, res) => {
	let skipNumber = parseInt(req.params.id);
	userController.getPage(skipNumber)
	.then((data) => {
		res.send(data);
	})
	.catch((err) => {
		console.log(err);
	})
})

module.exports = Router;
