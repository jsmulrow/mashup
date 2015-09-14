app.directive('nodemonoLogo', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/nodemono-logo/nodemono-logo.html',
    link: (scope) => {

      scope.installChromeExt = () => {
        console.log(`installing Nodemono chrome extension...`)
        chrome.webstore.install('https://chrome.google.com/webstore/detail/mihcahmgecmbnbcchbopgniflfhgnkff', () => {
          alert('Installed!')
        }, (whyStr) => {
          console.log(whyStr)
          alert('Failed to install! Make sure you are using Chrome: https://www.google.com/chrome/browser/desktop/index.html')
        })
      }

    }
  };
});

//sasd