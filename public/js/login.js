let openSignInDim = document.getElementById('open-sign-in-dim');
let openSignInButton = document.getElementById('open-sign-in-button');
let signInBox = document.getElementById('login-box');
let loginEscapeButtons = document.querySelector('.login-escape-button');

openSignInButton.addEventListener('click', function(){
	openSignInDim.style.display = "block";
})

openSignInDim.addEventListener('click', closeSignInDim)

loginEscapeButtons.addEventListener('click', closeSignInDim)

function closeSignInDim(){
	openSignInDim.style.display = "none";
}

signInBox.addEventListener('click', function(event){
	event.stopPropagation();
})