(function () {
    'use strict';

    angular
        .module('showsApp.controllers', [])
        .controller('SidebarCtrl', SidebarCtrl)
        .controller('NavCtrl', NavCtrl)
        .controller('AuthCtrl', AuthCtrl)
        .controller('HomeCtrl', HomeCtrl)
        .controller('ShowCtrl', ShowCtrl)
        .controller('MyShowsCtrl', MyShowsCtrl)
        .controller('EpisodesCtrl', EpisodesCtrl)
        .controller('EpisodeCtrl', EpisodeCtrl)
        .controller('SearchCtrl', SearchCtrl);

    function SidebarCtrl() {
        this.connected = function () {
            return sessionStorage.showsApp !== undefined;
        }
    }

    function NavCtrl($scope, $location) {
        var vm = this;
        vm.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) == 0;
        }
    }

    function AuthCtrl($scope, $routeParams, $location, Users) {
        var vm = this;
        vm.user = {};

        vm.login = function () {
            Users.authorize();
        }

        vm.getUserLogin = function () {
            return Users.getLogin();
        }

        vm.getUserXp = function () {
            return Users.getXp();
        }

        vm.logout = function () {
            Users.logout();
        }

        $scope.$on('$routeChangeSuccess', function() {
            if ($routeParams.code !== undefined) {
                Users.oauth($routeParams.code);
            }
        });

    }

    function HomeCtrl($http, $scope, $q, Shows) {
        var vm = this;

        vm.getshows = function () {
            Shows.popular(25).then(function (response) {
                vm.shows = response.data.shows;
                var promises = [];
                response.data.shows.forEach(function (show) {
                    var p = $q(function (resolve, reject) {
                        Shows.info(show.id).then(function (response) {
                            show.image = response.data.show.images.box;
                            resolve();
                        });
                    });
                    promises.push(p);
                });
                $q.all(promises).then(function () {
                    vm.imagesloaded = true;
                });
            });
        }

        vm.getshows();
    }

    function ShowCtrl($routeParams, Shows, Users, alertify) {
        var vm = this;

        vm.getShowInfo = function () {
            Shows.info($routeParams.showId).then(function (response) {
                vm.show = response.data.show;
            });
        }

        vm.follow = function () {
            if (Users.getToken() === undefined) {
                return alertify.error('You should login to follow a show !');
            }
            Shows.follow($routeParams.showId).then(function (response) {
                if (response.data.errors.length === 0) {
                    alertify.success('You are now following the show !');
                    vm.getShowInfo();
                } else {
                    alertify.error(response.data.errors);
                }
            });
        }

        vm.unfollow = function () {
            Shows.unfollow($routeParams.showId).then(function (response) {
                if (response.data.errors.length === 0) {
                    alertify.success('You are not following this show anymore.');
                    vm.getShowInfo();
                } else {
                    alertify.error(response.data.errors);
                }
            });
        }

        vm.archive = function () {
            Shows.archive($routeParams.showId).then(function (response) {
                if (response.data.errors.length === 0) {
                    alertify.success('You archived the show !');
                    vm.getShowInfo();
                } else {
                    alertify.error(response.data.errors);
                }
            });
        }

        vm.unarchive = function () {
            Shows.unarchive($routeParams.showId).then(function (response) {
                if (response.data.errors.length === 0) {
                    alertify.success('You unarchived the show !');
                    vm.getShowInfo();
                } else {
                    alertify.error(response.data.errors);
                }
            });
        }

        vm.episodes = function (seasonNumber, reloadSeason) {
            Shows.episodes($routeParams.showId, seasonNumber).then(function (response) {
                vm.episodes['season_' + seasonNumber] = response.data.episodes;
                if (reloadSeason) {
                    if (vm.season === seasonNumber) {
                        vm.season = null;
                    } else {
                        vm.season = seasonNumber;
                    }
                }
            });
        }

        vm.episodeWatched = function (episodeId, code) {
            Shows.episodeWatched(episodeId).then(function (response) {
                alertify.success('You marked '+code+' as watched !');
                vm.episodes(vm.season, false);
            });
        }

        vm.episodeNotWatched = function (episodeId, code) {
            Shows.episodeNotWatched(episodeId).then(function (response) {
                alertify.success('You marked '+code+' as not watched !');
                vm.episodes(vm.season, false);
            });
        }

        alertify.logPosition("bottom right");
        vm.getShowInfo();
    }

    function MyShowsCtrl($location, Users) {
        var vm = this;

        if (sessionStorage.showsApp === undefined) {
            return $location.path('/home');
        }

        vm.getMyShows = function () {
            Users.shows().then(function (response) {
                vm.shows = response.data.member.shows;
            });
        }

        vm.getMyShows();
    }

    function EpisodesCtrl() {

    }

    function EpisodeCtrl($routeParams, Shows) {
        var vm = this;

        vm.getEpisodeInfo = function () {
            Shows.episode($routeParams.episodeId).then(function (response) {
                vm.episode = response.data.episode;
                vm.episode.image = Shows.episodeImg(response.data.episode.id);
            });
        }

        vm.getEpisodeInfo();
    }

    function SearchCtrl() {

    }
})()
