 var config = {
     apiKey: "AIzaSyCDhMwA7HwWOm6dnbNZuYkeMI3qNDy3tu4",
     authDomain: "eatbeercrawl.firebaseapp.com",
     databaseURL: "https://eatbeercrawl.firebaseio.com",
     projectId: "eatbeercrawl",
     storageBucket: "eatbeercrawl.appspot.com",
     messagingSenderId: "598266543914",
 };



 firebase.initializeApp(config);
 var db = firebase.firestore();

 db.collection("trips").get().then((querySnapshot) => {
     querySnapshot.forEach((doc) => {
         if (firebase.auth().currentUser != null && firebase.auth().currentUser.displayName == doc.data().creator && doc.data().savedTrip) {
             var locations = doc.data().savedPlaces;
             var div_for_append = $("<div class='col-md-10 col-md-offset-1 tryThis trip-tile' data-trip-id='" + doc.id + "'>");
             div_for_append.append("<h1>" + doc.data().creator + "</h1>");
             div_for_append.append("<p>" + doc.data().creatorEmail + "</p>");
             div_for_append.append("<p><strong>" + doc.data().title + "</strong></p>");
             div_for_append.append("<p>" + doc.data().main_location + "</p>");
             $.each(locations, function (index, place) {
                 div_for_append.append("<li>" + locations[index].name + "</li>");
             })
             $("#allOfTheTrips").append(div_for_append);
         }
     });

     $(".trip-tile").click(function (e) {
         window.location = window.origin + "/build-page3.html#" + $(this).data("tripId");
     })
 });


 //  $("#allOfTheTrips").on("click", ".tryThis", function() {
 //     //  The redirect works,
 //     //  console.log(this.data);
 //     //  window.location = window.origin + "/build-page3.html#" + $(this).data;
 //  })





 var provider = new firebase.auth.GoogleAuthProvider();
 //  var git_hub_provider = new firebase.auth.GithubAuthProvider();
 const txtEmail = $("#txtEmail");
 const txtPassword = $("#txtPassword");
 const btnLogin = $("#btnLogin");
 const btnSignUp = $("#btnSignUp");
 const btnLogout = $("#btnLogout");
 const currentUser = firebase.auth().currentUser;

 // This is the login button.    
 $("#btnLogin").on("click", function () {
     var user = firebase.auth().signInWithRedirect(provider);
     sendUserToFirebase(user);
 })

 $("#btnSignUp").on("click", function () {
     var user = firebase.auth().signUpWithRedirect(provider);
 });


 $("#btnLogout").on("click", function () {
     document.location.href = "/";
     $(".userInformation").empty();
     firebase.auth().signOut();
 });


 firebase.auth().onAuthStateChanged(function (user) {
     if (user) {
         $("#user-not-logged-in").hide();
         $("#user_name").html("<h1>" + user.displayName + "</h1>");
         $("#user_email").html("<p>" + user.email + "</p>")
         $("#btnLogout").show();
         $("#display_name").html("<h3>" + user.displayName + "</h3>");
         $("#user-profile-pic").attr("src", user.photoURL);

         $("#btnSignUp, #btnLogin").hide();
     } else {
         $("#user-signed-in").hide();

         $("#btnLogout").hide();
         $("#btnSignUp, #btnLogin").show();
     }
 });


 function save_this_shit(successCallBack) {
     db.collection("trips").add({
             title: $("#crawl-name").val(),

             creator: firebase.auth().currentUser.displayName,
             creatorEmail: firebase.auth().currentUser.email,
             type: $("#search-type").val(),
             main_location: $("#search-location").val(),
             number: $("#num_ques").val()

         })
         .then(function (docRef) {
             successCallBack(docRef.id);
         })
         .catch(function (error) {
             console.error("Error adding document: ", error);
         });

 }


 $("#the_submit_button").on("click", function (event) {
     event.preventDefault();
     save_this_shit(function (docRef) {
         window.location = window.origin + "/build-page3.html#" + docRef;
     });
 });