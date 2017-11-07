const express = require('express');

const userController = require('./users/userController.js');
const imageController = require('./images/imageController.js');

const Router = express.Router();

Router.post('/createAccount', (req, res) => {
	let userInfo = req.body;
	// console.log(userInfo);
	if (userInfo.id) {
		userController.checkExistAccount(userInfo)
			.then((user) => {
				if (user) {
					console.log(user);
					console.log('userExist');
					res.send(user);
				} else {
					let newImage = {
						ownerId: userInfo.id,
						url: `https://graph.facebook.com/${userInfo.id}/picture?width=500`
					};
					imageController.addImage(newImage)
						.then((imageId) => {
							userController.createNewAccount(userInfo, imageId)
								.then((newUser) => {
									res.send(newUser);
									console.log('Account created');
								})
								.catch((err) => {
									console.log('err');
								})
						})
						.catch((err) => {
							console.log('err');
						})
				}
			})
			.catch((err) => {
				console.log(err)
			});
	}
});

Router.post('/image', (req, res) => {
	userController.updateAccountImage(req.body.accountId, req.body.imageURL)
		.then((data) => {
			res.send(req);
		})
		.catch((err) => {
			console.log(err);
		})
});
Router.get('/:id', (req, res) => {
	userController.getUserById(req.params.id).then((data) => {
		console.log(data);
		imageID = data.currentImageId;
		imageController.getById(imageID).then((dataImage)=>{
			console.log('data image', dataImage);
			// res.render("user", {
			// 	dataImage
			// });
			res.send(dataImage);
		}).catch((err)=>{
			console.log(err);
		});
		// res.render("user", {
		// 	data
		// });
	}).catch((err) => {
		console.log(err);
	});
})

module.exports = Router;