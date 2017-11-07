let input3words = document.getElementById('input-3-words');
let currentPicture, currentLog, logInfo

// Comment trigger
document.addEventListener('keydown', function(event){
	// Press enter key while input is being focused to comment
	if ((event.keyCode === 13 || event.which === 13) && input3words === document.activeElement){
		enterComment();
	}
});

function enterComment(){
	console.log('picture',dataImage);
	console.log('user ',currentUser);
	if (!currentUser){
		//popup
		alert("Please log in first! :D");
		return;
	}
	// allow only 3 words
	if (currentLog && currentLog.threewords.length >= 3){
		input3words.value = "";
		alert('Exceeded 3-words')
		return false;
	}
	// comment prototype
	url = `/image/comment`;
	let word = {
		content: input3words.value,
		targetOwner: currentPicture.ownerId,
		targetPicture: currentPicture._id,
		authorId: currentUser.id
	}

	// post comment
	$.ajax({type: 'post', url: url, data: word})
	.done((addedWord) => {

		appendToImage(addedWord);

		// update notification
		updateNoti('comment', addedWord, currentPicture)
		// append to log
		if(currentLog){
			pushWordToLog(addedWord);
		} else {
			createLog(logInfo)
			.then((data) => {
				currentLog = data;
				pushWordToLog(addedWord);
			});
		}
	})

	function pushWordToLog(addedWord){
		if(currentLog.threewords.length < 3){
			currentLog.threewords.push(addedWord._id);
			updateLog(currentLog)
			.then((data) => {	
				currentLog = data;
				// append new comment container
				let newComment = makeNewComment(addedWord);
				activate(newComment);
				commentsContainer.appendChild(newComment);
				voteWordByClick(newComment, addedWord);
			});
		}
	}
	
	// reset input
	input3words.value = "";
}

function updateNoti(type, word, image){
	data = {
		type: type,
		userId: currentPicture.ownerId,
		notiObject: {
			image:{
				id: currentPicture._id,
				name: ""
			},
			comment:{
				id: word._id,
				content: word.content
			}
		}
	}
	url = `/noti`;
	$.ajax({type:'post', url: url, data: data})
}

function createLog(logInfo){
	return new Promise(function(resolve, reject){
		url = `log/create`;
				
		$.ajax({type:'post', url: url, data: logInfo})
		.done((data) => {
			resolve(data);
		})
	})
}

function appendToImage(addedWord){
	// append to picture
	url = `image/append`
	$.ajax({type: 'post', url: url, data: addedWord})
	.done((data) => {
		currentPicture = data;
		document.getElementById('comment-number').innerHTML = currentPicture.words.length;
		if (currentPicture.words.length <= 3) {
			colon = document.createElement('span');
			colon.innerHTML = ',&nbsp';
			topCommentContainer.appendChild(colon);
			appendToTopWords(addedWord);
		}
	});
}

function updateLog(updatedLog){
	return new Promise(function(resolve, reject){
		url = `/log/update`;

		$.ajax({type:'post', url: url, data: updatedLog})
		.done((data) => {
			resolve(data);
		})
	})
}

let openPictureDim = document.getElementById('open-picture-dim');
let commentsContainer = document.getElementById('comments-container');
let pictureOwnersName = document.getElementById('owners-name');
let topCommentContainer = document.getElementById('top-comment-container');

// Open and append picture in big size
function openPictureByClick(portfolio, chosenUser){
	portfolio.addEventListener('click', function(){
		document.getElementById('profile-setting-dock').style.display = "none";
		openPictureDim.style.display = "block";
		document.getElementsByTagName('body')[0].style.overflow = "hidden";// prevent body scrolling when pop up
		input3words.focus();

		//append owner's information
		pictureOwnersName.innerHTML = chosenUser.name;

		//append picture and comments
		url = `/image/${chosenUser.currentImageId}`;
		$.ajax({type: 'get', url: url})
		.done((data) => {
			//append picture
			currentPicture = data;
			document.getElementById('big-instant-picture-image').src = data.url;
			if(currentPicture.caption) document.getElementById('image-caption').innerHTML = currentPicture.caption;
			document.getElementById('comment-number').innerHTML = currentPicture.words.length;

			//append top words
			appendTopWords();

			//get user log about the picture
			if (currentUser){
				logInfo = {
					userId : currentUser.id,
					imageId : currentPicture._id
				}
				url = `/log/${currentUser.id}/${currentPicture._id}`;
				$.ajax({type:'get', url: url})
				.done((data) => {
					currentLog = data;
					appendCommentsToBigPicture();
				})
			} else {
				appendCommentsToBigPicture();
			}
		})
	})
}
// Close the big picture
function closePictureByClick(){
	openPictureDim.addEventListener('click', function(){
		openPictureDim.style.display = "none";
		document.getElementsByTagName('body')[0].style.overflowY = "scroll";
		commentsContainer.innerHTML = "";
		document.getElementById('big-instant-picture-image').src = "";
		document.getElementById('comment-number').innerHTML = "";
		topCommentContainer.innerHTML = "";
	});
}

closePictureByClick();

// prevent clicking in the picture and comment section to close the big picture
function suspendClickOpenPictureWrapper(){	
	// suspend picture click
	document.querySelector(".instant-picture-wrapper").addEventListener('click', function(event){
		event.stopPropagation();
	});
	// suspend comment section click
	document.querySelector(".right-section-wrapper").addEventListener('click', function(event){
		event.stopPropagation();
	});
}

suspendClickOpenPictureWrapper();