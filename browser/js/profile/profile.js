app.config(($stateProvider) => {
  $stateProvider.state('profile', {
    url: '/:id/profile',
    templateUrl: 'js/profile/profile.html',
    resolve: {
      user: (User, $stateParams) => User.find($stateParams.id),
      routes: (user) => user.getRoutes(),
      pipes: (user) => user.getPipes()
    },
    controller: ($scope, user, routes, pipes,shareData) => {
      shareData.routes = routes;
      $scope.routes = routes;
      $scope.pipes = pipes;
      $scope.user = user;
    }
  });
});
