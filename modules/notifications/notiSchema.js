const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const notiSchema = new Schema({
	type: {
		type: String,
		require: true
	},
	userId:{
		type: String,
		require: true
	},
	imageId: String,
	imageName: String,
	commentId: String,
	commentContent: String
	// obj:{
	// 	image:{
	// 		id: String,
	// 		name: String
	// 	},
	// 	comment:{
	// 		id: String,
	// 		content: String
	// 	}
	// }
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.model('notifications', notiSchema);