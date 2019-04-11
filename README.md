# Train-Schedule

### Tube Time

Tube Time is an app for tracking fake train schedules, themed around London's Underground. The app is a front end application utilizing a Firebase database to track user input and host arrival and departure information. The app also uses Moment.js to provide up-to-date information regarding trains arrival times and their minutes until arrival. Users can add trains and calculate when the next train will arrive.

### How It Works
* Users see an initial display of already inputted tube times. 
* Users can add trains (tubes), administrators are able to submit:
    * Tube Name
    * Destination
    * First Tube Time
    * Frequency
* The app then calculates when the next train will arrive, and displays this to the user appending it to the table. 
* Users from various machines can view train times at the same time. 