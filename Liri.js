//node file system
const fs = require('fs');

//npm packages for OMDB request and inquirer to ask questions
const request = require('request');
const inquirer = require("inquirer");
const moment = require('moment');
const colors = require('colors');
var omdb = require('omdb');
//npm packages to get APi info from twitter & spotify
const twitter = require('twitter');
var Spotify = require('node-spotify-api');

//grab twitter keys form the keys.js file
const keys = require('./keys.js');


//new Twitter api call
const client = new twitter(keys.twitterKeys);

const userCommand = process.argv[2]; //3rd argument [index 2] at terminal becomes LiriCommand
var userData = process.argv.slice(3).join(" "); //grabs all terms typed in 4th argument and on

console.log("__________userData__________");
console.log(userData);
console.log("____________________________");

//Switch statement to run the right function based off the command by the user

function LiriCommand(command) {
    var waitMsg;

    switch (command) {

        case 'my-tweets':
            console.log("OK Liri will retrieve tweets for you...");
            waitMsg = setTimeout(twitterCall, 1000);
            break;


        case "spotify-this-song": spotifyThisSong(); break;
      
        case 'movie-this':
            console.log("OK Liri is looking up a movie based on your search term...");
            waitMsg = setTimeout(omdbCall, 1000);
            break;

        case 'do-what-it-says':
            console.log("Liri will be happy to choose for you. Ready...Set...");
            waitMsg = setTimeout(randomCall, 1000);
            break;
            
        default:
            console.log("Sorry I don't understand");
            console.log("Please re-enter your command from the list below.");
            console.log("-----------------------");
            console.log(colors.cyan("my-tweets") + ": will show your last 20 tweets and when they were created at in your terminal/bash window.");
            console.log(colors.green("spotify-this-song <song title>") + ": will show the following information about the song in your terminal/bash window");
            console.log(colors.magenta("movie-this <movie title>") + ": will output detailed movie information to your terminal/bash window");
            console.log(colors.yellow("do-what-it-says") + ": Liri will randomly choose a command for you.");
            console.log("-----------------------");
    }
}
// TWIWIWIWIWITTTTTEEEEERRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
//function to call to twitter for last 20 tweets
function twitterCall() {

    inquirer.prompt([

        {
            type: "input",
            message: "Enter a Twitter handle to search their tweets.",
            name: "name",
            default: "Yauneni1"
        },

    ]).then(function(data) {


        //parameters object used in twitter call
        var parameters = {
            screen_name: data.name,
            count: "20"
        };
        //twitter call based on  docs
        client.get('statuses/user_timeline', parameters, function(error, tweets) {
            if (error) {
                throw error;
            }
            //loop through the rturned tweets to print each one.
            for (var i = 0; i < tweets.length; i++) {
                var tweetTime = moment(new Date(tweets[i].created_at));
                var tweetTimeStamp = tweetTime.format("dddd, MMMM Do YYYY, h:mm:ss a");
                var tweetNum = i + 1;
                console.log(colors.cyan("**________________**Tweet# " + tweetNum + "**________________**" + "(" + JSON.stringify(tweetTimeStamp) + ")"));
                console.log("");
                var tweetPost = tweets[i].text
                console.log(JSON.stringify(tweetPost));
                console.log(colors.cyan("__^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^__"));
                console.log("");
                console.log("");
            }
            // add logEntry to log.txt
            logEntry.handle = data.name;
            logEntry.tweetsReturned = tweets.length;
            logData(logEntry);
        });
    });
}
// TWTWTWTWWTTTTTTTEEEEEERRRRRRRRRRRRRRRRRRRRRRRRRRRRR

// SSSSSSSSPSOOOOOOOOOOTTYTYYTYTYTYTYTTYTYTYTYTYTY
// function to call spotify for song info
var spotify = new Spotify({
    id:"3f641312978b472fadcc517adc8d3a6b",
    secret: "aa63a45a749a4f16b463d02f8ccde639",});
            
function spotifyThisSong(songName) {
    var waitTime = 3000;
    var currenTime = 0;
    var waitInterval = 10;
    var percentWaitng = 0;

    function writeWprecent(p) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`>>ALMOST DONE<< ...${p}%`);
    }
    // ADDEDTHIS VAR INTERVAL == SETiNTERVAL{Iitd gonna stop timer after 3 second has been past}
    // to remove it need to REMOVE THE VAR!!!! AND LEAVE 
    var interval = setInterval(function () {
        currenTime += waitInterval;
        percentWaitng = Math.floor((currenTime / waitTime) * 100);
        writeWprecent(percentWaitng);
        //  IF THIS IS ON THE , COUNTING SECONDS WILLGO EVERY COUNT LANE
        //  console.log(`waiting ${currenTime/1000} seconds.....`);
    }, waitInterval);

    setTimeout(function () {
        // THIS FUNCTION COME ALONG WITH CLEAR TIMEOUT 
        clearInterval(interval);
        writeWprecent(100);
        console.log(' \n\n Here You Go.... \n\n ');
    }, waitTime);

    process.stdout.write("\n")
    writeWprecent(percentWaitng);

    var songName = process.argv[3];
    if (!songName) {
        songName = "Ace of Base";
    }
    params = songName;
    
    spotify.search({ type: "track", query: params }, function (err, data) {
        if (!err) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        " _Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        " _Song: " + songInfo[i].name + "\r\n" +
                        " _Album the song is from: " + songInfo[i].album.name + "\r\n" +
                        " _Preview Url: " + songInfo[i].preview_url + "\r\n" +
                        "______________^^^^^^^^^^^^^^^^^^^^^^^^" + i + "^^^^^^^^^^^^^^^^^^^^_____________" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults); // calling log function
                }
            }
        } else {
            return;
        }
    });
};
// SSSSSSSSPSOOOOOOOOOOTTYTYYTYTYTYTYTTYTYTYTYTYTY
// function to call OMDB for song info
function omdbCall() {

    var movie = userData;
    // console.log(movie)
    if (movie === "") {
        movie = "mr+nobody";
    }
// OOOOOMOMOMOMOMOMOMOODODODODODODOBBOBOBOBOBOBOBOBO
        var MovieDB = require('moviedb')('65df1022a70a9ad63fbfa028ad61d139');
        MovieDB.searchMovie({
            query: movie
        }, function (err, res) {
            var movieSearched = res.results[0]
            //Creating the Obj for Movie
            var MovieObj = {
                content: movieSearched.overview,
                date: movieSearched.release_date,
                title: movieSearched.title,
                rating: movieSearched.popularity,
                ratingvote: movieSearched.vote_average
            }
            console.log(MovieObj)
        });
}
// function to call a random command from random.txt
function randomCall() {

    fs.readFile('random.txt', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        } else {
            var commandList = data.split("|"); //splits the array in random.txt by the |
            var randomIndex = Math.floor(Math.random() * commandList.length); //generates a random index of the array based on its length
            var randomChoice = commandList[randomIndex].split(","); //grabs argv2 (and argv3 if its there then splits it by the comma)
            var randomCommand = randomChoice[0]; //random command becomes the first index of randomChoice
            if (randomChoice[1]) { //if there is a 2nd index in randomChoice....
                userData = randomChoice[1]; //use the sencond index of randomChoice as userData
            }

            LiriCommand(randomCommand); //call LiriCommand function based of randomCommand
        }
    });

}

// function to add info to the log.txt file
function logData(object) {
    if (!fs.existsSync('log.txt')) { //check to see if log.txt exists
        fs.writeFileSync('log.txt', "[" + JSON.stringify(object) + "]"); // if not create the file and add the argument passed into it when called
    } else {
        fs.readFile('log.txt', 'utf-8', function(err, data) { // else the file already exist read it to get current data
            if (err) {
                console.log(err);
            }

            var arr = JSON.parse(data); // variable for the existing data in file

            arr.push(object); // push the argument into the array taken from log.txt

            fs.writeFile('log.txt', JSON.stringify(arr), function(err) { // re-write the new more complete arr onto the log.txt file
                if (err) {
                    throw err;
                }
            });

        });
    }
}

var logTimeStamp = moment(new Date()); // use moment() to grab the current time at submission
logTimeStamp = logTimeStamp.format("dddd, MMMM Do YYYY, h:mm:ss a"); // use moment to format the date more readable
var logEntry = { // every log entry will have a timestamp, the command used, and error status
    logTimestamp: logTimeStamp,
    command: userCommand,
    error: false
};

//calls the LiriCommand function on userCommand
LiriCommand(userCommand);