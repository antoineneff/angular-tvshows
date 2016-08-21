(function () {
    'use strict';

    angular
        .module('showsApp', [
            'ngRoute',
            'ngAlertify',
            'showsApp.controllers',
            'showsApp.services'
        ])
        .config(config);

    function config($locationProvider, $routeProvider) {
        $routeProvider
            .when('/shows', {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm'
            })
            .when('/oauth', {
                controller: 'AuthCtrl'
            })
            .when('/shows/:showId', {
                templateUrl: '../templates/show.html',
                controller: 'ShowCtrl',
                controllerAs: 'vm'
            })
            .when('/myshows', {
                templateUrl: 'templates/myshows.html',
                controller: 'MyShowsCtrl',
                controllerAs: 'vm'
            })
            .when('/episodes', {
                templateUrl: 'templates/episodes.html',
                controller: 'EpisodesCtrl'
            })
            .when('/episodes/:episodeId', {
                templateUrl: '../templates/episode.html',
                controller: 'EpisodeCtrl',
                controllerAs: 'vm'
            })
            .when('/search', {
                templateUrl: 'templates/search.html',
                controller: 'SearchCtrl'
            })

            .otherwise('/shows');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    }

})();
