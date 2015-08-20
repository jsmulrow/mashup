app.config(($stateProvider) => {
  $stateProvider.state('pipe', {
    abstract: true,
    url: '/:userid/pipes/:pipeid',
    templateUrl: 'js/pipe-api/pipe-api.html',
    resolve: {
      user: (User, $stateParams) => User.find($stateParams.userid),
      pipe: (Pipe, $stateParams) => Pipe.find($stateParams.pipeid),
      inputs: (pipe) => pipe.getInputs()
      // data: (pipe) => pipe.getPipedData()
    },
    controller: (DS, $scope, $timeout, user, pipe, inputs) => {
      $scope.user = user;
      $scope.pipe = pipe;
      $scope.inputs = inputs;
      // get the data
      $scope.data = [];
      pipe.getPipedData().then(pipedData => {
        $scope.data = pipedData;
      });
      console.log($scope.data);
      $scope.dataPreview;
      $scope.editing = {};
      $scope.activetab = null;
      $scope.tabs = [{ header: 'Data Preview', url: 'preview', glyphicon: 'equalizer' },
                     { header: 'Pipe Setup', url: 'setup', glyphicon: 'cog' },
                     { header: 'Pipe History', url: 'history', glyphicon: 'calendar' },
                     { header: 'Modify Results', url: 'modify', glyphicon: 'wrench' },
                     { header: 'Use Data', url: 'use', glyphicon: 'circle-arrow-down' },
                     { header: 'API Docs', url: 'docs', glyphicon: 'file' }];

      $scope.getRowCount = () => {
        let n = 0;
        for (let key in $scope.data) {
          let l = $scope.data[key].length;
          if (l > n) n = l;
        }
        console.log('the row count', n);
        $scope.rows = new Array(n + 1).join('0').split('').map(function(d, i) { return { index: i }; });
      };

      $scope.getPipeStatus = () => {
        $scope.pipeStatus = $scope.pipe.lastPipeSucceeded ? 'Successful' : 'Unsuccessful';
      };

      $scope.getLastRunStatus = () => {
        let dt = Math.round((Date.now() - Date.parse(pipe.lastTimePiped)) / 86400000);
        if (dt === 0) $scope.lastRun = 'Today';
        else $scope.lastRun = `${dt} ${dt > 1 ? 'days' : 'day'} ago`
      };

      if (!$scope.lastRun) $scope.getLastRunStatus();
      if (!$scope.pipeStatus) $scope.getPipeStatus();
      if (!$scope.rows) $scope.getRowCount();
      // console.log($scope.rows);

      // called every time 'edit' button is clicked
      $scope.toggleStatus = (id) => {
        let elem = document.getElementById(id);
        elem.setAttribute('contenteditable', true); // make the element (elem) editable
        if ($scope.editing[id]) {
          elem.removeAttribute('contenteditable'); // make the element (elem) not editable
          $scope.pipe.DSSave() // save the newly edited element
            .then(newpipe => {
              console.log(`successfully saved pipe ${newpipe.name}`)
              // if (!$rootScope.alerts) $rootScope.alerts = []
              // $rootScope.alerts.push({ name: 'saving route', msg: 'successful'})
            })
            .catch((e) => {
              console.log(`was not able to save pipe ${pipe.name}: ${e}`)
              // if (!$rootScope.alerts) $rootScope.alerts = []
              // $rootScope.alerts.push({ name: 'saving route', msg: 'unsuccessful' })
            });
        }

        // make sure changes take place after any promises resolve
        $timeout(() => {
          $scope.editing[id] = !$scope.editing[id];
        }, 0);
      }

      
      $scope.resultTypes = [{index:1,name:"CSV"},{index:2,name:"RSS"},{index:3,name:"JSON"}];
      $scope.activeResultType = "CSV";

      $scope.setActiveType = (type) =>{
        // console.log($scope.data);
        if(type.name==="JSON"){
          $scope.dataPreview = angular.toJson(interleaveObj($scope.data),true);
        } else if(type.name==="RSS"){
          $scope.dataPreview = pipe.parseXML(interleaveObj($scope.data));
          console.log($scope.dataPreview);
        }
        $scope.activeResultType = type.name;
      };
      //filter by search text
      
      // helper function for interleave - interleaves a single object of arrays
      function interleaveObj(obj) {
        // find all keys in the object
        var keys = Object.keys(obj);

        // find longest stored array
        var maxLen = keys.reduce(function(max, key) {
          if (obj[key].length > max) return obj[key].length;
          else return max;
        }, 0);

        var mergedData = [];
        // defined outside the loop to satisfy the linter
        var i = 0;
        var reduceFunc = function(accum, key) {
          accum[key] = obj[key][i];
          return accum;
        };
        // use maxLen (length of longest array in the object)
        for (; i < maxLen; i++) {
          // make new obj with fields for each name
          var mergedObj = keys.reduce(reduceFunc, {});
          // add to the array of these objects
          mergedData.push(mergedObj);
        }

        return mergedData;
      }
    }
  });
});