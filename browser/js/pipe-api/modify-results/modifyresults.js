app.config(($stateProvider) => {
  $stateProvider.state('pipe.modify', {
    url: '/modify',
    templateUrl: 'js/pipe-api/modify-results/modifyresults.html',
    controller: ($scope) => {
      let editor = ace.edit('editor')

      editor.setTheme('ace/theme/chrome')
      editor.getSession().setMode('ace/mode/javascript')
      console.log(editor)

      $scope.updateDataPreview = () => {
        let v = editor.getValue()
        console.log(v)
        console.log('typeof v:',typeof v)
      }
      $scope.revertData = () => console.log('reverting data back to original form...')
    }
  })
})
