const photoMaxSize = 100000;
let postButton = document.getElementById('post-button');
let openPostPictureDim = document.getElementById('open-post-picture-dim');
let postPictureForm = document.querySelector(".post-picture-form");
let inputImage = document.getElementById('input-image');
let inputCaption = document.getElementById('caption');
let previewImage = document.getElementById('preview-image');

function displayPostPictureByClick(){
	//listen and change state
	if(postButton) {
		postButton.addEventListener('click', function(){
			openPostPictureDim.style.display = "block";
			document.getElementsByTagName('body')[0].style.overflow = "hidden";
			console.log('post-button-pressed');	
		}, false);
	}
}
displayPostPictureByClick();

// Close the post picture
function closePostPictureFormByClick(){
	openPostPictureDim.addEventListener('click', closePostPicture);
}
// Close post picture
function closePostPicture(){
	openPostPictureDim.style.display = "none";
	document.querySelector('.input-image-wrapper').style.display = "block";
	document.querySelector('.submit-area').style.display = "block";
	document.getElementsByTagName('body')[0].style.overflowY = "scroll";
	previewImage.innerHTML = "<p>No files currently selected for upload</p>";
	postPictureForm.reset();
};

closePostPictureFormByClick();

// prevent clicking in the form from closing the form itself
function suspendClickOpenPostPictureForm(){	
	// suspend picture click
	postPictureForm.addEventListener('click', function(event){
		event.stopPropagation();
	});
}

suspendClickOpenPostPictureForm();

inputImage.addEventListener('change', function (){
	let inputPhoto = inputImage.files[0];
	if (inputPhoto.size < photoMaxSize){
		previewImage.innerHTML = "";
		let currentFiles = inputImage.files;
		let newImage = document.createElement('img');
		newImage.src = window.URL.createObjectURL(currentFiles[0]);
		previewImage.appendChild(newImage);
	} else {
		previewImage.innerHTML = "<p>Max size 100kb</p>";
		postPictureForm.reset();
	}
});

function submitPicture(){
	let inputPhoto = inputImage.files[0];
	let caption = inputCaption.value;
	if (!inputPhoto){
			previewImage.innerHTML = "<p>Choose an image</p>";
			return;
		}

	//loading photo
	previewImage.innerHTML = `<div class="loader-wrapper image-loader" style="display: block"><div class="loader"></div></div>`;
	document.querySelector('.input-image-wrapper').style.display = "none";
	document.querySelector('.submit-area').style.display = "none";

	var formData = new FormData();
    formData.append('photo', inputPhoto);
    formData.append('caption', caption);
    formData.append('userId', currentUser.id);

	let url = `/upload`;
	$.ajax({ type: 'post', url: url,
		data: formData,
		enctype: 'multipart/form-data',
		processData: false,
		contentType: false
	}).done((data) => {
		console.log("profile picture changed");
		closePostPicture();
	})
}