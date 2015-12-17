app.directive('nodemonoLogo', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/nodemono-logo/nodemono-logo.html',
    link: (scope) => {
      scope.installChromeExt = () => {
        chrome.webstore.install('https://chrome.google.com/webstore/detail/dhncgflfkmflhloldkciigdfmnejbida', () => {
          alert('Installed!')
        }, (whyStr) => {
          console.log(whyStr)
          alert('Failed to install! Make sure you are using Chrome: https://www.google.com/chrome/browser/desktop/index.html')
        })
      }
    }
  };
});
