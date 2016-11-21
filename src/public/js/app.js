const app = angular.module('Index', ['ngMaterial', 'ngMdIcons']);

app.controller('AppCtrl', function ($scope, $mdSidenav, $mdDialog) {
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.status = '  ';
  $scope.customFullscreen = false;

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  }

  $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
  };

  $scope.showPrerenderedDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      contentElement: '#myDialog',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
});

const indexFiles = {};
document.getElementById('upload-progress').style.display = 'none';
document.getElementById('errorfile').style.display = 'none';
function handleFileSelect(evt) {
  // Read in the image file as a binary string.
  //reader.readAsText(evt.target.files[0]);
  const files = evt.target.files;
  for (file of files){
    if (!file.type.match('\.json$')) {
      document.getElementById('errorfile').style.display = 'block';
      document.getElementById('upload-progress').style.display = 'none';
      continue;
    }
    document.getElementById('errorfile').style.display = 'none';
    let reader = new FileReader();
    const progress = document.querySelector('.percent');
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function(e) {
      //alert('File read cancelled');
    };
    reader.onloadstart = function(e) {
      document.getElementById('upload-progress').style.display = 'none';
      document.getElementById('upload-progress').style.display = 'block';
      document.getElementById('upload-progress').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      progress.style.width = '100%';
      progress.textContent = '100%';
      //setTimeout("document.getElementById('upload-progress').className='';", 2000);
      indexFiles[file.name] = e.target.result;
      console.log(indexFiles)
    }

    function abortRead() {
      reader.abort();
    }
    document.getElementById('abort').addEventListener('click', abortRead, false);

    function errorHandler(evt) {
      switch(evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
          alert('File Not Found!');
          break;
        case evt.target.error.NOT_READABLE_ERR:
          alert('File is not readable');
          break;
        case evt.target.error.ABORT_ERR:
          break; // noop
        default:
          alert('An error occurred reading this file.');
      };
    }

    function updateProgress(evt) {
      // evt is an ProgressEvent.
      if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
          progress.style.width = percentLoaded + '%';
          progress.textContent = percentLoaded + '%';
        }
      }
    }
    reader.readAsText(file);
  }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

app.config(function($mdThemingProvider) {
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
});