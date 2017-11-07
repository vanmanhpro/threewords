const path = require('path');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const userModel = require('./userSchema');
const userLogModel = require('./userLogSchema');

const checkExistAccount = (userInfo) => {
	return new Promise( function( resolve, reject){
		userModel.findOne({ id : userInfo.id})
		.lean()
		.exec( (err, user) => {
			if (err) reject(err);
				else resolve(user);
		})
	});
}

const createNewAccount = (newUserData, imageId) => {
	return new Promise(function(resolve, reject){
		var newUser = new userModel({
			id: newUserData.id,
			name: newUserData.name,
			smallURL: `https://graph.facebook.com/${newUserData.id}/picture?width=300`,
			currentImageId: imageId
		})

		newUser.save( (err, data) => {
			if(err) reject(err);
				else resolve(data);
		});
	});
}

const updateAccount = (newUserData) => {
	return new Promise(function(resolve, reject){
		userModel.findById(newUserData._id)
		.exec((err, data) => {
			if(err) reject(err);
			data.set(newUserData);
			data.save( (err, updatedData) => {
				if(err) reject(err);
					else resolve();
			})
		})
	});
}

const updateAccountImage = (accountId, imageId, imageURL) => {
	return new Promise(function(resolve, reject){
		userModel.findOne( { id: accountId})
		.select('currentImageId smallURL')
		.exec((err, data) => {
			if(err) reject(err);
			data.currentImageId = imageId;
			data.smallURL = imageURL;
			data.save( (err, updatedData) => {
				if(err) reject(err);
					else resolve(updatedData);
			})
		})
	});
}

const getPage = (skipNumber) => {
	return new Promise(function(resolve, reject){
		userModel.find()
		.skip(skipNumber)
		.limit(10)
		.sort({created_at: 1})
		.lean()
		.exec((err, users) => {
			if(err) reject(err);
				else resolve(users);
		})
	});
}

const getAll = () => {
	return new Promise(function(resolve, reject){
		userModel.find( (err, users) => {
			if(err) reject(err); 
				else resolve(users);
		});
	});
}

const getUserById = (userID, callback)=>{
	return new Promise(function (resolve, reject) {
		userModel.findOne({"_id": objectId(userID)})
		.exec((err, data)=>{
			if(err) reject(err)
			else resolve(data);
		})
	})
}
module.exports = {
	createNewAccount,
	getAll,
	getPage,
	checkExistAccount,
	updateAccount,
	updateAccountImage,
	getUserById
}