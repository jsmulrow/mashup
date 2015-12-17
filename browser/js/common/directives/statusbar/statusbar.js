app.directive('statusBar', () => {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      alerts: '=alerts'
    },
    link: (scope, element, attrs, ngModelCtrl) => {
      // alert goes away after 5 seconds
      setTimeout(() => {
        let a = scope.alerts.shift()
        scope.$digest()
      }, 5000)
    },
    templateUrl: 'js/common/directives/statusbar/statusbar.html'
  }
})
