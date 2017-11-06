const express = require('express');
const path = require('path');
const multer = require('multer');
const imgur = require('imgur');

const userController = require('./users/userController.js');
const imageController = require('./images/imageController.js');

const Router = express.Router();

// Set Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads',
	filename: function(req, file, callback){
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
})

// Init Upload
const photoMaxSize = 100000;
const upload = multer({
	storage: storage,
    limits: {fileSize: photoMaxSize}
}).single('photo');

// Init imgur
imgur.setClientId('1952d184b08dc41');
 
// Saving to disk. Returns a promise. 
// NOTE: path is optional. Defaults to ~/.imgur 
imgur.saveClientId(path)
.then(function () {
    console.log('Saved.');
})
.catch(function (err) {
    console.log(err.message);
});

Router.post('/', (req, res) => {
    upload(req, res, (err) => {
    	if(err){
    		res.send(err);
    	} else {
            // upload to imgur
            console.log(req.file.filename);
            imgur.uploadFile(`./public/uploads/${req.file.filename}`)
            .then(function (json) {
                console.log(json.data.link);
                let newImageURL = json.data.link;
                let userId = req.body.userId;
                let newImageData = {
                    caption: req.body.caption,
                    ownerId: req.body.userId,
                    url: newImageURL
                }
                imageController.addImage(newImageData)
                .then((data) => {
                    //change current image id of user
                    let newImageId = data;
                    userController.updateAccountImage( userId, newImageId, newImageURL)
                    .then((data) => {
                        console.log("profile picture changed");
                        res.send();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch(function (err) {
                console.error(err.message);
            });
         

            
    	}
    })
});

module.exports = Router;