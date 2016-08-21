(function () {
    'use strict';

    angular
        .module('showsApp.services', [])
        .factory('Shows', Shows)
        .factory('Users', Users);

    function Shows($http, Users) {
        var service = {
            popular: popular,
            info: info,
            follow: follow,
            unfollow: unfollow,
            archive: archive,
            unarchive: unarchive,
            episodes: episodes,
            episode: episode,
            episodeImg: episodeImg,
            episodeWatched: episodeWatched,
            episodeNotWatched: episodeNotWatched
        };
        return service;

        function popular(limit) {
            return $http({
                method: 'GET',
                url: 'https://api.betaseries.com/shows/list',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'order': 'followers',
                    'limit': limit
                }
            });
        }

        function info(showId) {
            return $http({
                method: 'GET',
                url: 'https://api.betaseries.com/shows/display',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': showId,
                    'token': Users.getToken()
                }
            });
        }

        function follow(showId) {
            return $http({
                method: 'POST',
                url: 'https://api.betaseries.com/shows/show',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': showId,
                    'token': Users.getToken()
                }
            });
        }

        function unfollow(showId) {
            return $http({
                method: 'DELETE',
                url: 'https://api.betaseries.com/shows/show',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': showId,
                    'token': Users.getToken()
                }
            });
        }

        function archive(showId) {
            return $http({
                method: 'POST',
                url: 'https://api.betaseries.com/shows/archive',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': showId,
                    'token': Users.getToken()
                }
            });
        }

        function unarchive(showId) {
            return $http({
                method: 'DELETE',
                url: 'https://api.betaseries.com/shows/archive',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': showId,
                    'token': Users.getToken()
                }
            });
        }

        function episodes(showId, seasonNumber) {
            return $http({
                method: 'GET',
                url: 'https://api.betaseries.com/shows/episodes',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': showId,
                    'season': seasonNumber,
                    'token': Users.getToken()
                }
            });
        }

        function episode(episodeId) {
            return $http({
                method: 'GET',
                url: 'https://api.betaseries.com/episodes/display',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': episodeId,
                    'token': Users.getToken()
                }
            });
        }

        function episodeImg(episodeId) {
            return 'https://api.betaseries.com/pictures/episodes?v=2.4&key=bf2f68a35ea9&id=' + episodeId;
        }

        function episodeWatched(episodeId) {
            return $http({
                method: 'POST',
                url: 'https://api.betaseries.com/episodes/watched',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': episodeId,
                    'token': Users.getToken(),
                    'bulk': true
                }
            });
        }

        function episodeNotWatched(episodeId) {
            return $http({
                method: 'DELETE',
                url: 'https://api.betaseries.com/episodes/watched',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'id': episodeId,
                    'token': Users.getToken()
                }
            });
        }
    }

    function Users($window, $http, $location) {
        var service = {
            authorize: authorize,
            oauth: oauth,
            logout: logout,
            getToken: getToken,
            getLogin: getLogin,
            getXp: getXp,
            shows: shows
        };
        return service;

        function authorize() {
            localStorage.previousUrl = $location.path();
            $window.location.href = 'https://www.betaseries.com/authorize?client_id=bf2f68a35ea9&redirect_uri=http://localhost:3000/oauth';
        }

        function oauth(code) {
            $http({
                method: 'POST',
                url: 'https://api.betaseries.com/oauth/access_token',
                params: {
                    'client_id': 'bf2f68a35ea9',
                    'client_secret': 'fe7c20ad89e95eb387906d6662da3d3a',
                    'redirect_uri': 'http://localhost:3000/oauth',
                    'code': code
                }
            }).then(function (response) {
                setInfos(response.data.access_token);
            });
        }

        function setInfos(token) {
            var user = {};
            user.token = token;
            $http({
                method: 'GET',
                url: 'https://api.betaseries.com/members/infos',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'token': token,
                    'summary': true
                }
            }).then(function (response) {
                user.login = response.data.member.login;
                user.xp = response.data.member.xp;
                sessionStorage.showsApp = JSON.stringify(user);

                $location.url(localStorage.previousUrl);

                localStorage.clear();
            });
        }

        function logout() {
            sessionStorage.clear();
            $window.location.reload();
        }

        function getToken() {
            if (sessionStorage.showsApp !== undefined) {
                return JSON.parse(sessionStorage.showsApp).token;
            }
        }

        function getLogin() {
            if (sessionStorage.showsApp !== undefined) {
                return JSON.parse(sessionStorage.showsApp).login;
            }
        }

        function getXp() {
            if (sessionStorage.showsApp !== undefined) {
                return JSON.parse(sessionStorage.showsApp).xp;
            }
        }

        function shows() {
            return $http({
                method: 'GET',
                url: 'https://api.betaseries.com/members/infos',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost'
                },
                params: {
                    'v': '2.4',
                    'key': 'bf2f68a35ea9',
                    'token': getToken(),
                    'only': 'shows'
                }
            })
        }
    }
})();
