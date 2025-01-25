// event handlers
 
let movieElement = document.querySelector(".test"); // getting the element id that allows me to read the movie name 
movieElement.addEventListener("click", getMovieName); // when you click the movie name (element) it triggers code

// option that I use every time I use the TMDB api
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'apikey'
    }
};




var MOVIE_LIST = [];      // creating an global (var) nested array to store title and vote_count for the movies
var ACTOR_IDS = [];
var REPEATED_MOVIES = [];

//functions 
function getMovieName() {
  REPEATED_MOVIES = [movieElement.innerHTML];
  let movieName = movieElement.innerHTML.replaceAll(" ", "%20"); // Replacing spaces in names with %20 for the api
  let queryString = "https://api.themoviedb.org/3/search/movie?query=" + movieName + "&include_adult=false&language=en-US&page=1";
  queryMovieID(queryString);
};  

function queryMovieID(queryString) {
    fetch(queryString, options)
    .then(res => res.json())
    .then(res => queryActorID(res.results[0].id))
    .catch(err => console.error(err));
};

function queryActorID(movieID) {
  let queryString = "https://api.themoviedb.org/3/movie/" + movieID + "/credits?language=en-US";
  fetch(queryString, options)
  .then(res => res.json())  
  .then(res => storeActors(res))
  .catch(err => console.error(err));
}

function storeActors(MyObj) {   
  for (let i = 0; i < MyObj.cast.length; i++) { 
    ACTOR_IDS[i] =  [
        MyObj.cast[i].id
      ]
  }
  queryMovieCredits(ACTOR_IDS[0]);
}

function queryMovieCredits(actorID) { 
  let queryString = "https://api.themoviedb.org/3/person/" + actorID + "/movie_credits?language=en-US";
  fetch(queryString, options)
  .then(res => res.json())
  .then(res => sortByVotes(res))
  .catch(err => console.error(err));
}

function sortByVotes(MyObj) {   // MyOBJ is the movie credits
  for (let i = 0; i < MyObj.cast.length; i++) { // looping until we get all movies
    MOVIE_LIST[i] =  [
        MyObj.cast[i].title,
        MyObj.cast[i].vote_count
      ]
  }
  MOVIE_LIST.sort((function(index){ // sort movies based on vote_count descendingly
    return function(a, b){
        return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1));
    };
  })(1));
  console.log(MOVIE_LIST[0]);
}
// logic for Cine2Nerdle