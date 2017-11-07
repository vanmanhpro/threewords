var grid = document.querySelector('.portfolios-grid');
var msnry = new Masonry( grid, {
	gutter: 10, 
	columnWidth: 265,
	itemSelector: '.portfolios-grid-item'
});

function displayProfileSettingByClick(){
	let avatar = document.getElementById('profile-setting-avatar');
	//listen and change state
	if(avatar) avatar.addEventListener('click', changeProfileSettingDisplayState, false);
	function changeProfileSettingDisplayState(){
		let dock = document.getElementById('profile-setting-dock');
		let dock_style = window.getComputedStyle(dock);
		if(dock_style.display === "none"){
			dock.style.display = "flex"
		} else {
			dock.style.display = "none"
		}
	}
}
displayProfileSettingByClick();

// function goToUserPage()

