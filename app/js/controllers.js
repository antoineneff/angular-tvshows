(function () {
    'use strict';

    angular
        .module('showsApp.controllers', [])
        .controller('NavCtrl', NavCtrl)
        .controller('AuthCtrl', AuthCtrl)
        .controller('HomeCtrl', HomeCtrl)
        .controller('EpisodesCtrl', EpisodesCtrl)
        .controller('ShowsCtrl', ShowsCtrl)
        .controller('CategoriesCtrl', CategoriesCtrl)
        .controller('SearchCtrl', SearchCtrl);

    function NavCtrl($scope, $location) {
        var vm = this;
        vm.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) == 0;
        };
    }

    function AuthCtrl($scope, $routeParams, $location, Users) {
        var vm = this;
        vm.connected;
        vm.user = {};

        if (sessionStorage.showsApp !== undefined) {
            vm.connected = true;
            vm.getUserLogin = function () {
                return Users.getLogin();
            }
            vm.getUserXp = function () {
                return Users.getXp();
            }

            vm.logout = function () {
                Users.logout();
            }
        } else {
            vm.connected = false;

            $scope.$on('$routeChangeSuccess', function() {
                if ($routeParams.code !== undefined) {
                    Users.oauth($routeParams.code);
                }
            });

            vm.login = function () {
                Users.authorize();
            }
        }
    }

    function HomeCtrl() {

    }

    function EpisodesCtrl() {

    }

    function ShowsCtrl($http, Shows) {
        var vm = this;
        vm.variable = 'string';

        vm.getshows = function () {
            Shows.popular(12).then(function (response) {
                vm.shows = response.data.shows;
                response.data.shows.forEach(function (show) {
                    show.image = Shows.image(show.id);
                });
            });
        }

        vm.getshows();
    }

    function CategoriesCtrl() {

    }
    function SearchCtrl() {

    }
})()
