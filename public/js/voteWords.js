let loading = false;

function activate(wordElement){
	wordElement.querySelector(".fa").className = "fa fa-heart";
	wordElement.querySelector(".fa").style.color = "red";//"rgba(212, 99, 232, 0.9)";
	wordElement.active = true;
}	
function deactivate(wordElement){
	wordElement.querySelector(".fa").className = "fa fa-heart-o";
	wordElement.querySelector(".fa").style.color = "rgba(0, 0, 0, 0.5)";
	wordElement.active = false;
}

function processClick(listeningWord, word){
	if(!listeningWord.active){
		if(currentLog.threewords.length < 3){
			upvote(listeningWord, word);
			activate(listeningWord);
		} else {
			alert("Out of words :)");
		}
	} else {
		unvote(listeningWord, word);
		deactivate(listeningWord);
	}	
}

function voteWordByClick(listeningWord, word){
	listeningWord.addEventListener('click', function(){
		if(!currentUser){
			alert("Please login first! :D");
			return;
		}
		if(currentLog){
			processClick(listeningWord, word);
		} else {
			createLog(logInfo)
			.then((data) => {
				currentLog = data;
				processClick(listeningWord, word);
			})
		}
	});
}

function upvote(wordElement, word){
	// update notification
	updateNoti('vote', word, currentPicture);

	// if voter have voted that comment 
	for(let i = 0, n = currentLog.threewords.length; i < n; i++){
		if(word._id === currentLog.threewords[i]){
			return;
		}
	}
	if(currentLog.threewords.length < 3){
		// push word to user log
		currentLog.threewords.push(word._id);
		updateLog(currentLog)
		.then((data) => {
			currentLog = data;
		});
		// check commenter's existen
		for(let i = 0, n = word.voters.length; i < n; i++){
			if(word.voters[i] === currentUser.id){
				return;
			}
		}        
		// push commenter to word
		word.voters.push(currentUser.id);
		word.vote = word.voters.length;
		updateWord(word)
		.then((updatedWord) => {
			wordElement.querySelector(".vote-number").innerHTML = updatedWord.vote;
		})
		if (word.vote == 1){
			appendToImage(word);
		}
	}
}

function unvote(wordElement, word){
	// remove word from user log
	for(let i = 0, n = currentLog.threewords.length; i < n; i++){
		if(word._id == currentLog.threewords[i]){
			currentLog.threewords.splice(i, 1);
			updateLog(currentLog)
			.then((data) => {
				currentLog = data;
			});
		}

		// remove voter from word 
		for(let i = 0, n = word.voters.length; i < n; i++){
			if(word.voters[i] === currentUser.id){
				word.voters.splice(i, 1);
				word.vote = word.voters.length;
				updateWord(word)
				.then((data) => {
					word = data;
					if (word.vote == 0) {
						// wordElement.style.display = "none";
						removeWordFromImage(word);
					} 
					wordElement.querySelector(".vote-number").innerHTML = word.vote;
				})				
			}
		}
	}
}

function removeWordFromImage(word){
	if(currentPicture){
		for(let i = 0, n = currentPicture.words.length; i < n; i++){
			if(word._id == currentPicture.words[i] || word._id == currentPicture.words[i]._id){
				currentPicture.words.splice(i, 1);
				updateImage(currentPicture)
				.then((data) => {
					currentPicture = data;
					document.getElementById('comment-number').innerHTML = currentPicture.words.length;
				});
				break;
			}
		}
	}
}

function updateImage(updatedImage){
	return new Promise(function(resolve, reject){
		url = `/image/update`;
		$.ajax({type: 'post', url: url, data: updatedImage})
		.done((data) => {
			resolve(data);
		});
	})
}

function updateWord(updatedWord){
	return new Promise(function(resolve, reject){
		url = `/word/update`;
		$.ajax({type: 'post', url: url, data: updatedWord})
		.done((data) => {
			resolve(data);
		});
	})
}