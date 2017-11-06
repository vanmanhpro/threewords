const path = require('path');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const imageModel = require('./imageSchema');

const addImage = (newImageData) => {
	return new Promise(function(resolve, reject){
		var newImage = new imageModel({
			ownerId : newImageData.ownerId,
			url : newImageData.url,
			caption : newImageData.caption
		})

		newImage.save( (err) => {
			if(err) reject(err);
				else resolve(newImage._id.toString());
		});
	});
}

const getById = (imageId) => {
	return new Promise(function(resolve, reject){
		imageModel.findOne({"_id": objectId(imageId)})
		.populate({
			path: 'words',
			options: { sort: {vote: -1}}
		})
		.lean()
		.exec((err, data) => {
			if(err) reject(err);
				else resolve(data);
		})
	})
}

const getAll = () => {
	return new Promise(function(resolve, reject){
		imageModel.find()
		.lean()
		.exec( (err, data) => {
			if (err) reject(err);
				else resolve(data);
		})
	})
}

const appendWord = (addedWordId, imageId) => {
	return new Promise(function(resolve, reject){
		imageModel.findOne({ _id:objectId(imageId)})
		.exec((err, data) => {
			let exist = false;
			for(let i = 0, n = data.words.length; i < n; i++){
				if(data.words[i] == addedWordId){
					exist = true;
					break;
				}
			}

			if (exist){
				console.log("Exist!")
				resolve(data);
			} else {
				data.words.push(objectId(addedWordId));

				data.save((err, updatedData) => {
					if (err) reject(err);
						else {
							console.log("Written!")
							resolve(updatedData);
						}
				})
			}
		})
	})
}

const updateImage = (updatedImage) => {
	return new Promise(function(resolve, reject){
		imageModel.findOne( { "_id": updatedImage._id })
		.exec((err, data) => {
			data.voters = updatedImage.voters;
			data.words = (updatedImage.words) ? updatedImage.words : [];

			data.save((err, updatedData) =>{
				if (err) reject(err);
					else resolve(updatedData);
			})
		})
	})
}

module.exports = {
	addImage,
	getAll,
	getById,
	appendWord,
	updateImage
}