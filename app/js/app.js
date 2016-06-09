(function () {
    'use strict';

    angular
        .module('showsApp', [
            'ngRoute',
            'ui.router',
            'showsApp.controllers',
            'showsApp.services'
        ])
        .config(config);

    function config($locationProvider, $routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })
            .when('/oauth', {
                controller: 'AuthCtrl'
            })
            .when('/episodes', {
                templateUrl: 'templates/episodes.html',
                controller: 'EpisodesCtrl'
            })
            .when('/shows', {
                templateUrl: 'templates/shows.html',
                controller: 'ShowsCtrl',
                controllerAs: 'vm'
            })
            .when('/categories', {
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesCtrl'
            })
            .when('/search', {
                templateUrl: 'templates/search.html',
                controller: 'SearchCtrl'
            })

            .otherwise('/home');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

})();
