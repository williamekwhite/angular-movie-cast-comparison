// Settings and Variables
var TMDB_endpoint = "http://api.themoviedb.org/3/";
var TMDB_API_KEY = "9e25a9024a349928cd9a4515f533e12f";
var TMDB_images = "https://image.tmdb.org/t/p/w185/";
var TMDB_person_url = "https://www.themoviedb.org/person/";
var TMDB_movie_url = "https://www.themoviedb.org/movie/";

// The App
var movieCompareApp = angular.module("moviecompare", ['ui.bootstrap']);

movieCompareApp.controller('SystemController', ['$scope', function($scope) {
    $scope.date = new Date();
}]);

movieCompareApp.controller('MovieController', ['$scope', '$http', '$q', function($scope, $http, $q) {
    var deferred = $q.defer();

    $scope.posterUrl = TMDB_images;
    $scope.personUrl = TMDB_person_url;
    $scope.movieUrl = TMDB_movie_url;
    $scope.movie_1 = null;
    $scope.movie_2 = null;
    $scope.shared_actors = [];

    $scope.searchMovie = function(name) {
        var searchName = "*"+name+"*";
        return $http.get(TMDB_endpoint + "search/movie", {params: {query:searchName, search_type: "ngram", api_key:TMDB_API_KEY}}).
            then(function(response) {
                if(!response.data.results)
                {
                    return [];
                }
                var results = response.data.results.map(function(item){
                    item.label = item.title + " (" + item.release_date.slice(0,4) + ")";
                    return item;
                });
                return results;
            });
    };

    $scope.compareMovies = function(movie_1, movie_2) {
        if(!movie_1 || !movie_2)
        {
            return;
        }

        $q.all([$scope.findMovieCredits(movie_1.id), $scope.findMovieCredits(movie_2.id)]).
            then(function(results){
                deferred.resolve(results);
                $scope.compareActors(results);
            });
    };

    $scope.compareActors = function(movies) {
        var actors_1 = movies[0].cast;
        var actors_2 = movies[1].cast;
        var shared_acts = [];
        for(x in actors_1)
        {
            var a = actors_1[x];
            for(y in actors_2) {
                if (a.id == actors_2[y].id) {
                    shared_acts.push(a);
                    break;
                }
            }
        }
        $scope.shared_actors = shared_acts;
    };

    $scope.findMovieCredits = function(id) {
        return $http.get(TMDB_endpoint + "movie/" + id + "/credits", {params: {api_key:TMDB_API_KEY}}).
            then(function(response) {
                if(!response.data)
                {
                    return [];
                }
                var results = response.data;
                return results;
            });
    };

}]);