const app = angular.module('Index', ['ngMaterial', 'ngMdIcons']);
const uploaded = [];
const fileNames = [];

app.controller('InvertedIndexController', invertedIndexController);

function invertedIndexController($scope, $mdSidenav, $mdDialog) {
  $scope.toggleLeft = buildToggler('left');
  $scope.customFullscreen = false;
  $scope.isOpenRight = openRight;
  $scope.showUploadBox = uploadBox;
  $scope.closeDialog = dialogClose;
  $scope.select = selectJson;
  $scope.fileSelect = jsonChoose;
  $scope.upload = uploadJson;
  $scope.menu = uploaded;
  $scope.progress = 0;

  // menu toggler
  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  }
  
  // check open menu on page load
  function openRight(){
      return $mdSidenav('right').isOpen();
  };

  // upload file dialog box
  function uploadBox($event) {
    $mdDialog.show({
      contentElement: '#myDialog',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
    document.getElementById('upload').disabled = true;
  };

  // close dialog box
  function dialogClose() {
    document.getElementById('selected-files').innerHTML = '';
    document.getElementById('upload-input').value = '';
    document.getElementById('upload').disabled = true;
    document.getElementById('upload-done').style.display = 'none';
    document.getElementById('upload-failed').style.display = 'none';
    $scope.progress = 0;
    $mdDialog.hide();
  };
  
  // select json files for upload
  function selectJson(){
    document.getElementById('upload-input').click();
    document.getElementById('upload-done').style.display = 'none';
    document.getElementById('upload-failed').style.display = 'none';
    $scope.progress = 0;
  }

  //monitor input change
  function jsonChoose(){
    $scope.files = document.getElementById('upload-input').files;
    $scope.fileKeys = Object.keys($scope.files).filter(function(key){
      return key !== 'length';
    });
    document.getElementById('selected-files').innerHTML = '';
    $scope.filesSelected = $scope.fileKeys.map(function(file) {
      return $scope.files[file]['name'];
    })
    .forEach((item) => {
      document.getElementById('selected-files')
      .innerHTML += '<md-list-item><p>' + item + '</p></md-list-item>'
    });
    document.getElementById('upload').disabled = false;
  }

  // upload json file(s) function
  function uploadJson(e){
    document.getElementById('upload').disabled = true;
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    const files = $(this).get(0).files;
    const formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (fileNames.indexOf(file.name) != -1){
        document.getElementById('upload-failed').style.display = 'block';
        document.getElementById('upload-input').value = '';
        document.getElementById('selected-files').innerHTML = '';
        return;
      }
      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    // do ajax file upload
    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      data: formData,
      enctype: 'multipart/form-data',
      success: function(data){
        if($scope.progress == 100){
          document.getElementById('upload-done').style.display = 'block';
          for (file of files){
            uploaded.push({
              title: file['name'],
              icon: 'cloud_done',
              getindex: 'GET INDEX',
              createindex: 'CREATE INDEX',
            });
            fileNames.push(file.name);
          }
          document.getElementById('upload-input').value = '';
          document.getElementById('selected-files').innerHTML = '';
        }
      },
      xhr: function() {
        // create an XMLHttpRequest
        const xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            // update the Materail progress bar with the new percentage
            $scope.progress = parseInt(evt.loaded / evt.total) * 100;
          }

        }, false);

        return xhr;
      }
    });
  } // end upload
}

function themeMaterial($mdThemingProvider) {
  var customBlueMap =     $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '500': 'rgb(16,108,200)',
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
}


app.config(themeMaterial);