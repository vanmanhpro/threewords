function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      loginFB();
      
    } else {
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '148233869245978',//1432090483505805
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.10' // use graph api version 2.10
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

let currentUser;

function loginFB() {
  FB.api('/me', function(userInfo) {
    $.ajax({type:"post", url: "/user/createAccount", data: userInfo})
    .done((data) => {
      currentUser = data;
      // console.log(currentUser);
      document.getElementById('open-sign-in-button').style.display = "none";
      document.getElementById('signed-in-wrapper').style.display = "flex";
      document.getElementById('profile-setting-avatar').src = currentUser.smallURL;
      document.getElementById("username").textContent = `${currentUser.name}`
      document.getElementById("user-id").textContent = currentUser._id;
      $("#username").attr("href", `/user/${currentUser._id}`)
      closeSignInDim();
    })
  });
}
function logoutFB() {
  document.getElementById('profile-setting-dock').style.display = "none";
  FB.logout(function(response) {
    // Person is now logged out
    console.log("logout");
    document.getElementById('open-sign-in-button').style.display = "flex";
    document.getElementById('signed-in-wrapper').style.display = "none";
    document.getElementById('profile-setting-avatar').src = "";
    currentUser = null;
    currentLog = null;
  });
}

