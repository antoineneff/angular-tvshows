(function () {
    'use strict';

    angular
        .module('showsApp.services', [])
        .factory('Shows', Shows)
        .factory('Users', Users);

    function Shows($http) {
        var service = {
            popular: popular,
            image: image
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

        function image(idShow) {
            return 'https://api.betaseries.com/pictures/shows?v=2.4&key=bf2f68a35ea9&height=150&id=' + idShow;
        }
    }

    function Users($window, $http, $location) {
        var service = {
            authorize: authorize,
            oauth: oauth,
            logout: logout,
            getLogin: getLogin,
            getXp: getXp
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
                $window.location.reload();
            });
        }

        function logout() {
            sessionStorage.clear();
            $window.location.reload();
        }

        function getLogin() {
            return JSON.parse(sessionStorage.showsApp).login;
        }

        function getXp() {
            return JSON.parse(sessionStorage.showsApp).xp;
        }
    }
})();
