const path = require('path');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const notiModel = require('./notiSchema');

const getNoti = (userId, skipNumber) => {
	return new Promise(function(resolve,reject){
		notiModel.find({userId: objectId(userId)})
		.sort(['updatedAt', -1])
		.skip(skipNumber)
		.lean()
		.exec((err, data) => {
			if(err) reject(err);
				else {
					console.log(data.updated_at);
					resolve(data);
				}
		})
	})
}

const updateNoti = (notiData) => {
	return new Promise(function(resolve,reject){
		console.log(notiData.notiObject);

		notiModel.findOne({
			type: notiData.type,
			userId: notiData.userId,
			imageId: notiData.notiObject.image.id,
			commentId: notiData.notiObject.comment.id
		})
		.exec((err, data) => {
			if(data){
				data = new notiModel({
					type: notiData.type,
					userId: notiData.userId,
					imageId: notiData.notiObject.image.id,
					imageName: notiData.notiObject.image.name,
					commentId: notiData.notiObject.comment.id,
					commentContent: notiData.notiObject.comment.content
				})
				// touch the data to change update timestamp for sorting
				data.save((err, data) => {
					if(err) reject(err);
						else {
							console.log("updated noti");
							resolve(data);
						}
				})
			} else {
				// create new noti
				createNoti(notiData)
				.then((data) => {
					console.log("created noti");
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				})
			}
		})
	})
}

const createNoti = (notiData) => {
	return new Promise(function(resolve,reject){
		newNoti = new notiModel({
			type: notiData.type,
			userId: notiData.userId,
			imageId: notiData.notiObject.image.id,
			imageName: notiData.notiObject.image.name,
			commentId: notiData.notiObject.comment.id,
			commentContent: notiData.notiObject.comment.content
		})
		newNoti.save((err, data) => {
			if(err) reject(err);
				else resolve(data);
		})
	})
}

module.exports = {
	getNoti,
	updateNoti,
	createNoti
}