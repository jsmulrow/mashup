app.directive('navbar', function ($rootScope, $state, AuthService, AUTH_EVENTS) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.userItems = [
                { label: 'Profile', state: 'profile({ id: user._id })' },
                { label: 'Pipes', state: 'pipes'},
            ];

            scope.items = [
                { label: 'Documentation', state: 'docs' },
                { label: 'About', state: 'about' },
                { label: 'Help', state: 'help' },
            ]

            scope.show = false

            scope.toggle = () => scope.show = !scope.show

            scope.search = () => {
              console.log('searching for something...')
            };

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout()
                $state.go('home', {}, { reload: true });
             };

            var setUser = function () {
                AuthService.getLoggedInUser()
                  .then(user => {
                    scope.user = user;
                  });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            // sign in as mock user to demo app
            scope.demo = () => {
                AuthService.demo();
            }

        }

    };

});
