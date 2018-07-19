var env = require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys');

var cmd = process.argv[2];
let movie = process.argv[3];

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

function thisSong(){
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    let title = process.argv[3];
    spotify.search({ type:'track', query: title, market: 'US', limit: 5}, function(err, data) {
        if (err){
          return console.log('Error occurred: ' + err);
        } 
        let items = data.tracks.items;
        //first loop over top level to get items.name for song name
        for (var j = 0; j < items.length; j++){
            console.log("--------------------------------")
            console.log("Song Title: " + items[j].name);

        //need to get to artists.name 
        //artists is an object within an array
            for (var i = 0; i < items.length; i++){
                let artists = items[i].artists;
                    //  console.log(artists[0].name); 
                for (var k = 0; k < artists.length; k++){
                     console.log("Artist: " + artists[k].name);
                     console.log("--------------------------------");
                     break;
                 }
             } 
            }  
        });   
    }
        

switch (cmd){
    case "my-tweets": 
    //This will show your last 20 tweets and when they were created at in your terminal/bash window.
    getTweets();
    break;
    case "spotify-this-song":
    //This will show some information about the song in your terminal
    thisSong();
    break; 
    case "movie-this":
    //This will output some information to your terminal
    break; 
    case "do-what-it-says":
    //Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    break;
    default: 
    console.log("instructions...");

}
