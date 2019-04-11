// document .ready to start the functions after the DOM is ready
$(document).ready(function () {

    // Declaring global variables
    var trainName = "";
    var trainDestination = "";
    var trainTime = "";
    var trainFrequency = "";
    var nextArrival = "";
    var minutesAway = "";

    //jQuery global variables
    var tubeName = $("#tubeName");
    var tubeDestination = $("#tubeDest");
    // form validation for time using jQuery mask plugin to streamline user differences when inputting numbers
    var tubeTime = $("#tubeTime").mask("00:00");
    var tubeFrequency = $("#tubeFreq").mask("00");


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDuRukFtalObgF5a-5rZ82A0F5BjkLcglM",
        authDomain: "train-scheduler-44a13.firebaseapp.com",
        databaseURL: "https://train-scheduler-44a13.firebaseio.com",
        projectId: "train-scheduler-44a13",
        storageBucket: "train-scheduler-44a13.appspot.com",
        messagingSenderId: "565772325739"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    database.ref("/trains").on("child_added", function (snapshot) {
        // create local variables to store the data from firebase
        var trainDiff = 0;
        var trainRemainder = 0;
        var minutesUntilArrival = "";
        var nextTrainTime = "";
        var frequency = snapshot.val().frequency;

        //compute the difference in time from now and the first train using the UNIX timestamp, store in var and convert to minutes
        trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

        //get the remainder of time by using the moderator with the frequency and time difference , store in a var
        trainRemainder = trainDiff % frequency;

        //subtract the remainder from the frequency and store in a variable
        minutesUntilArrival = frequency - trainRemainder;

        // add minutes until arrival to now, to find the next train & convert to standard time format
        nextTrainTime = moment().add(minutesUntilArrival, "m").format("hh:mm A");

        //append to our tube table with a new row of train data
        $("#table-data").append(
            "<tr><td>" + snapshot.val().name + "</td>" +
            "<td>" + snapshot.val().destination + "</td>" +
            "<td>" + frequency + "</td>" +
            "<td>" + minutesUntilArrival + "</td>" +
            "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
        );

        $("span").hide();

        // Hover view of delete button
        $("tr").hover(
            function () {
                $(this).find("span").show();
            },
            function () {
                $(this).find("span").hide();
            });
    });

    //function to call the button event, and store the values in the input form
    var storeInputs = function (event) {
        //prevent from reseting
        event.preventDefault();

        //get & store input values
        trainName = tubeName.val().trim();
        trainDestination = tubeDestination.val().trim();
        trainTime = moment(tubeTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
        trainFrequency = tubeFrequency.val().trim();

        //add to firebase database
        database.ref("/trains").push({
            name: trainName,
            destination: trainDestination,
            time: trainTime,
            frequency: trainFrequency,
            nextArrival: nextArrival,
            minutesAway: minutesAway,
            date_added: firebase.database.ServerValue.TIMESTAMP
        });

        //alert that the train was added
        alert("Train was successfully added!");

        //empty form once submitted
        tubeName.val("");
        tubeDestination.val("");
        tubeTime.val("");
        tubeFrequency.val("");
    };

    //Calls storeInputs function if submit button clicked
    $("#btn-add").on("click", function (event) {
        //form validation- if empty - alert
        if (tubeName.val().length === 0 || tubeDestination.val().length === 0 || tubeTime.val().length === 0 || tubeFrequency === 0) {
            alert("Please fill in ALL required fields.");
        } else {
            //if form is filled out, run the function
            storeInputs(event);
        }
    });

    // Call storeInputs function is enter key is clicked
    $("form").on("keypress", function (event) {
        if (event.which === 13) {
            //form validation -if empty - alert
            if (tubeName.val().length === 0 || tubeDestination.val().length === 0 || tubeTime.val().length === 0 || tubeFrequency.val().length === 0) {
                alert("Please fill in ALL required fields.");
            } else {
                //if form is filled out, run the function

                storeInputs(event);
            }
        }
    });
});    

