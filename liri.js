//Code to pull data from keys.js
var Twitter = require("twitter");
var fs = require("fs");
var SpotifyWebApi = require('node-spotify-api');
var request = require("request");
const keys = require("./keys.js"),
    twitterClient = new Twitter(keys.twitterKeys),
    spotifyClient = new SpotifyWebApi(keys.spotifyKeys);
var inputType = process.argv[2];
var input = process.argv[3];


// LIRI.js my-tweets - shows the last 3 tweets and time
function displaytweets() {
    var count = { count: "3" };
    var tweet = 1;
    twitterClient.get('statuses/user_timeline', count, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
           
                console.log("Tweet== " + tweet + ": " + tweets[i].text + "\n ----> Tweeted at: " + tweets[i].created_at);
                tweet++;
            }
        }
    });
}


// LIRI.js spotify-this-song - spotifies a song
function spotifythissong(spotifysong) {
    spotifysong = input;
    spotifyClient.search({ type: 'track', query: spotifysong }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
    });

}

// LIRI.js movie-this - Looks up a movie
function omdbtitle() {
    var Title;
    var movielookup = function () {
        request("http://www.omdbapi.com/?t=" + Title + "=&plot=short&apikey=" + keys.omdbKeys, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year released: " + JSON.parse(body).Year);
                console.log("IMDB rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
    };
    if (input === "") {
        Title = "Mr. Nobody";
        movieSearch();
    }
    else {
        Title = input;
        movielookup();

    }
}


// LIRI.js do-what-it-says - Reads a file
function readfile() {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("~~~~~" + data + "~~~~~");
        var dataArr = data.split(",");
        var inputType = dataArr[0];
        input = dataArr[1];
        spotifythissong();
    });
}


switch (inputType) {
    case "my-tweets":
        displaytweets();
        console.log("~~~~~my-tweets~~~~~");
        break;
    case "spotify-this-song":
        spotifythissong();
        console.log("~~~~~spotify-this-song~~~~~");
        break;
    case "movie-this":
        omdbtitle();
        console.log("~~~~~Initializing OMDB Movie Lookup~~~~~");
        break;
    case "do-what-it-says":
        readfile();
        console.log("~~~~~Initializing Do what you say~~~~~");
        break;
    default:
        console.log("Please try different input");
}

