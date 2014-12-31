// Settings and Variables
var IMDB_endpoint = "http://www.omdbapi.com";

// The App
var imdbApp = angular.module("imdb.compare", ['ui.bootstrap']);

imdbApp.controller('MovieController', ['$scope', '$http', '$q', function($scope, $http, $q) {
    var deferred = $q.defer();
    $scope.movie_1 = null;
    $scope.movie_2 = null;
    $scope.shared_actors = [];

    $scope.searchMovie = function(name) {
        var searchName = "*"+name+"*";
        return $http.get(IMDB_endpoint, {params: {s:searchName}}).
            then(function(response) {
                if(!response.data.Search)
                {
                    return [];
                }
                var results = response.data.Search.map(function(item){
                    item.label = item.Title + " (" + item.Year + ")";
                    return item;
                });
                return results;
            });
    };

    $scope.compareMovies = function(movie_1, movie_2) {
        if(movie_1 == null || movie_2 == null)
        {
            return;
        }

        $q.all([$scope.findMovie(movie_1.imdbID), $scope.findMovie(movie_2.imdbID)]).
            then(function(results){
                deferred.resolve(results);
                $scope.compareActors(results);
            });
    };

    $scope.compareActors = function(movies) {
        var actors_1 = movies[0].Actors.split(", ");
        var actors_2 = movies[1].Actors.split(", ");
        var shared_acts = [];
        for(x in actors_1)
        {
            var a = actors_1[x];
            if(actors_2.lastIndexOf(a) != -1)
            {
                shared_acts.push(a);
            }
        }
        $scope.shared_actors = shared_acts;
    };

    $scope.findMovie = function(id) {
        return $http.get(IMDB_endpoint, {params: {i:id, plot:"full"}}).
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