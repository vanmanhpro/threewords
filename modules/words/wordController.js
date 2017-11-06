const path = require('path');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId();

const wordModel = require('./wordSchema');

const addWord = (word) => {
	return new Promise(function(resolve, reject){
		var newWord = new wordModel({
			content : word.content,
			targetOwner : word.targetOwner,
			targetPicture : word.targetPicture,
			voters : [word.authorId]
		});

		newWord.save( (err, data) => {
			if(err) reject(err);
				else resolve(data);
		});
	});
}

const updateWord = (updatedWord) => {
	return new Promise(function(resolve, reject){
		wordModel.findOne( { "_id": updatedWord._id })
		.exec((err, data) => {
			data.vote = updatedWord.vote;
			data.voters = updatedWord.voters;
			if(updatedWord.voters === undefined){
				data.vote = 0;
				data.voters = [];
			};

			data.save((err, updatedData) =>{
				if (err) reject(err);
					else resolve(updatedData);
			})
		})
	})
}

module.exports = {
	addWord,
	updateWord
}