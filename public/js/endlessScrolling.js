let currentPage = 0, skip = 0;
let isLoading = false;

$(window).on('scroll', onWindowScrolled);

var interval = setInterval(function(){
  if($(document).height() <= $(window).height()){
    onWindowScrolled();
  }
  else{
    clearInterval(interval);
  }
}, 200);

requestPage();

function onWindowScrolled(){
  if(!isLoading && $(window).height()*3/2 + $(window).scrollTop() > $(document).height()){
    requestPage();
  }
}

function requestPage(){
	const url = `/skip/${skip}`;
	isLoading = true;

	//display loading
	document.querySelector('.content-loader').style.display = "block";

	$.ajax({
		url : url,
		type: 'get'
	}).then((data) => {
		skip += data.length;
		let grid = document.getElementsByClassName('portfolios-grid')[0];
		for(let i = 0, n = data.length;i < n; i++){
			//	console.log(data[i])
			let gridItem = document.createElement('div');
			gridItem.className = 'portfolios-grid-item';
			
			let gridPictureWrapper = document.createElement('div');
			gridPictureWrapper.className = 'portfolio-picture-wrapper';
			let gridPicture = document.createElement('img');
			gridPictureWrapper.appendChild(gridPicture);
			
			let gridPictureText = document.createElement('div');
			gridPictureText.className = 'portfolio-picture-text';
			let gridText = document.createElement('p');
			gridText.append(data[i].name);
			gridPictureText.appendChild(gridText);
			
			gridItem.appendChild(gridPictureWrapper);
			gridItem.appendChild(gridPictureText);
			
			grid.appendChild(gridItem);
			
			gridPicture.src = data[i].smallURL;
			gridPicture.onload = () => {
				msnry.appended(gridItem);
				openPictureByClick(gridItem, data[i]);
			}
		}
	}).fail((err) => {
		console.log(err);
	}).always(() => {
		isLoading = false;
		document.querySelector('.loader').style.display = "none";
	})
}

// function loadPage( pageNumber){
// 	return new Promise( (resolve, reject)=>{
// 		$.post(`/user/${pageNumber}`, function(data){
// 			console.log(data);

// 			let grid = document.getElementsByClassName('portfolios-grid')[0];
// 			for(let i = 0, n = data.length;i < n; i++){

// 				let gridItem = document.createElement('div');
// 				gridItem.className = 'portfolios-grid-item';

// 				let gridPictureWrapper = document.createElement('div');
// 				gridPictureWrapper.className = 'portfolio-picture-wrapper';
// 				let gridPicture = document.createElement('img');
// 				gridPictureWrapper.appendChild(gridPicture);

// 				let gridPictureText = document.createElement('div');
// 				gridPictureText.className = 'portfolio-picture-text';
// 				let gridText = document.createElement('p');
// 				gridText.append("some text");
// 				gridPictureText.appendChild(gridText);
				
// 				gridItem.appendChild(gridPictureWrapper);
// 				gridItem.appendChild(gridPictureText);

// 				grid.appendChild(gridItem);

// 				gridPicture.src = data[i].currentImageId;
// 				gridPicture.onload = () => {
// 					msnry.reloadItems();
// 					msnry.layout();
// 				}
// 			}
// 		})
// 		.always( function(){
// 			resolve();
// 		});
// 	})
// }

// function endlessScrolling(pageNumber){
// 	loadPage(pageNumber)
// 	.then(() => {
// 		pageNumber++;
// 		endlessScrolling(pageNumber);
// 	});
// }

// endlessScrolling(1);