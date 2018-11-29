// -----------------Firebase--------------------------

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDGGzu0_1NO_mox6_cLbmsW9iNjC4ddZxg",
  authDomain: "gec-firebase.firebaseapp.com",
  databaseURL: "https://gec-firebase.firebaseio.com",
  projectId: "gec-firebase",
  storageBucket: "gec-firebase.appspot.com",
  messagingSenderId: "801861685178"
};
firebase.initializeApp(config);

var database = firebase.database();

// -------------------------------------------------

// Submit train info button with an on clink function
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#train-destination-input").val().trim();
  var trainTime = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#frequency-input").val();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    time: trainTime,
    frequency: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#train-destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// -----------------------------------------------

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFreq = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainTime);
  console.log(trainFreq);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + moment(nextTrain).format("hh:mm A") + "</td><td>" + tMinutesTillTrain + "</td><td>");
});
