 var config = {
	  apiKey: "AIzaSyCocsnJIAT1IDv0Q0-nmxpLfAtTAMvvxWQ",
	  authDomain: "tktr-fa4cf.firebaseapp.com",
	  databaseURL: "https://tktr-fa4cf.firebaseio.com",
	  storageBucket: "tktr-fa4cf.appspot.com",
  }; 
console.log("ini firebase");
var response = firebase.initializeApp(config);
alert('response ' + response)

/*firebase.database().ref("info").orderByChild("tag").equalTo("rentals").on("value", function(data)
{
	alert("data loaded");
});*/

firebase.database().ref("info").orderByChild("tag").equalTo("rentals").on("value", function(data)
{
	alert(data.key);
	var x = document.getElementsByTagName("BODY")[0];
	x.innerHTML += "<h3>name: " + data.val().name + "</h3>";
});


// var user = firebase.auth().currentUser;
            
// console.log("user: " + user);

// firebase.database().ref('info/' + 'corsa').on('value', function(snapshot)
// { 
// 	alert(snapshot.val());
// });

// var userId = firebase.auth().currentUser.uid;
// return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
//   var username = snapshot.val().username;

// });

  // // Initialize Firebase
  // // TODO: Replace with your project's customized code snippet
  // var config = {
  //   apiKey: "<API_KEY>",
  //   authDomain: "<PROJECT_ID>.firebaseapp.com",
  //   databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  //   storageBucket: "<BUCKET>.appspot.com",
  // };
  // firebase.initializeApp(config);
