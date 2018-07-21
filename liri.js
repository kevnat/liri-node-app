var env = require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');

let cmd = process.argv[2];

function getTweets(){
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
    
  var params = {screen_name: 'kevnat_dev', count:20};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if(!error){
        for (var i = 0; i < tweets.length; i ++){
            console.log(tweets[i].text);
        }
    } else
        console.log(response); // Raw response object.
  });
}

function getSong(song){
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    //let input = process.argv[3];
    spotify.search({ type:'track', query: song, market: 'US', limit: 5}, function(err, data) {
        if (err){
          return console.log('Error occurred: ' + err);
        } 
        let items = data.tracks.items;
        // console.log(items);
        //first loop over top level to get items.name for song name
        for (var j = 0; j < items.length; j++){
            console.log("--------------------------------")
            console.log("Song Title: " + items[j].name);

        //need to get to artists.name 
        //artists is an object within an array
            // for (var i = 0; i < items.length; i++){
                let artists = items[j].artists;
                // console.log(artists);
                    //  console.log(artists[0].name); 
                for (var k = 0; k < artists.length; k++){
                     console.log("Artist: " + artists[k].name);
                    //  console.log("--------------------------------");
                     break;
                 }
            // } 
            }  
        });   
    }
        
function getMovie(movie){
// let movie = process.argv[3];

request.get('http://www.omdbapi.com/?apikey=trilogy&t=' + movie, function (error, response, body) {
    if (!error){
        var body = JSON.parse(body); 
        let title = body.Title; 
        let year = body.Year;
        let imdb = body.Ratings[1].Value; 
        let rotten = body.Ratings[0].Value;
        let country = body.Country;
        let language = body.Language;
        let plot = body.Plot;
        let cast = body.Actors;
    console.log(
        "Body: " + title 
    +   "\nYear: " + year 
    +   "\nIMDB Rating: " + imdb
    +   "\nRotten Tomatoes: " + rotten
    +   "\nCountry: " + country
    +   "\nLanguage: " + language
    +   "\nPlot: " + plot
    +   "\nCast: " + cast);
    } else {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    } 
});
}

function getText(){
    fs.readFile('random.txt',"utf8", function(error,data){
        if (error) throw error;
        let dataArr = data.split(",");
        let cmd = dataArr[0];
        let input = dataArr[1];
        console.log(cmd,input);
        action(cmd,input);
    })
}

function action(cmd,input){
    switch (cmd){
        case "my-tweets": 
        //This will show your last 20 tweets and when they were created at in your terminal/bash window.
        getTweets();
        break;
        case "spotify-this-song":
        //This will show some information about the song in your terminal
        getSong(input);
        break; 
        case "movie-this":
        //This will output some information to your terminal
        getMovie(input);
        break; 
        case "do-what-it-says":
        //Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
        getText(input);
        break;
        default: 
        console.log("instructions...");
    }  
}

action(cmd, process.argv[3]);