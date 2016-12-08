/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const InvertedIndex = require('./Inverted-index.js');

const Utility = require('./Inverted-Index-Helper.js');

const app = angular.module('Index', ['ngMaterial', 'ngMdIcons']);

const appIndex = new InvertedIndex(Utility);

const uploaded = [];
const fileNames = [];
const inputArea = document.getElementById('upload-input');
const selectArea = document.getElementById('selected-files');
const uploadDone = document.getElementById('upload-done');
const uploadFailed = document.getElementById('upload-failed');
const cheating = document.getElementById('cheating');

function invertedIndexController($scope, $mdSidenav, $mdDialog, $mdToast, $document, $timeout) {
  /* eslint-disable no-param-reassign */
  /* eslint-disable no-shadow */
  /* eslint-disable no-use-before-define */
  $scope.toggleLeft = buildToggler('left');
  $scope.customFullscreen = false;
  $scope.isOpenRight = openRight;
  $scope.state = true;
  $scope.showUploadBox = uploadBox;
  $scope.closeDialog = dialogClose;
  $scope.select = selectJson;
  $scope.fileSelect = jsonChoose;
  $scope.upload = uploadJson;
  $scope.menu = uploaded;
  $scope.createIndex = createIndex;
  $scope.reference = appIndex.reference;
  $scope.uploadedFileContents = appIndex.documentFiles;
  $scope.search = searchIndex;
  $scope.currentDocuments = [];
  $scope.canUpload = false;
  $scope.sidebarOpen = true;
  $scope.selected = '';
  $scope.changeState = () => {
    /* eslint-disable no-unneeded-ternary */
    $scope.state = $scope.state ? false : true;
  };

  $scope.changeStateAgain = () => {
    $scope.state = false;
  };

  // menu toggler
  function buildToggler(componentId) {
    return function toggle() {
      $mdSidenav(componentId).toggle();
    };
  }

  // check open menu on page load
  function openRight() {
    return $mdSidenav('right').isOpen();
  }

  // upload file dialog box
  function uploadBox($event) {
    $mdDialog.show({
      contentElement: '#myDialog',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen,
    });
    $scope.canUpload = false;
  }

  // close dialog box
  function dialogClose() {
    selectArea.innerHTML = '';
    inputArea.value = '';
    uploadDone.style.display = 'none';
    uploadFailed.style.display = 'none';
    $mdDialog.hide();
    $scope.canUpload = false;
  }

  // select json files for upload
  function selectJson() {
    inputArea.click();
    uploadDone.style.display = 'none';
    uploadFailed.style.display = 'none';
  }

  // monitor input change
  function jsonChoose() {
    const validity = [];
    cheating.style.display = 'none';
    $scope.files = inputArea.files;
    $scope.fileKeys = Object.keys($scope.files).filter(key => key !== 'length');
    $scope.filesSelected = $scope.fileKeys.map(file => $scope.files[file].name);

    selectArea.innerHTML = '';
    new Promise((resolve, reject) => {
      $scope.filesSelected.forEach((item, index) => {
        /* eslint-disable no-nested-ternary */
        const fileSize = $scope.files[index].size;
        let color = '';
        let message = '';
        item.endsWith('.json') ?
        (fileSize > 0 ?
          (color = 'good', message = 'valid file type')
           :
          (color = 'bad', message = 'empty json file')
        ) :
        (fileSize > 0 ?
          (color = 'bad', message = 'invalid file type')
          :
          (color = 'bad', message = 'empty invalid file type')
        );
        validity.push(message);
        selectArea.innerHTML += `<md-list-item><p> ${item} 
        <span class="message ${color}"> ${message}</span></p></md-list-item>`;
      });
      resolve(validity);
    }).then(() => {
      if (validity.indexOf('invalid file') !== -1 ||
        validity.indexOf('empty invalid file') !== -1 ||
        validity.indexOf('empty json file') !== -1 ||
        validity.indexOf('file already uploaded') !== -1) {
        $scope.$apply(() => {
          $scope.canUpload = false;
          selectArea.innerHTML += `<p style="text-align: center; color: #3004e0">
          please select non-empty JSON file(s)</p>`;
        });
      } else {
        $scope.$apply(() => {
          $scope.canUpload = true;
        });
      }
    });
  }

  // upload json file(s) function
  function uploadJson(e) {
    if ($scope.canUpload) {
      $scope.canUpload = false;
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      const files = $(this).get(0).files;
      $scope.filesSelected.forEach((item) => {
        fileNames.push(item);
      });
      const formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (let i = 0; i < files.length; i += 1) {
        /* eslint-disable prefer-const*/
        let file = files[i];
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
        enctype: 'multipart/form-data',
        success: function succeed(data) {
          /* eslint-disable prefer-const */
          /* eslint-disable no-restricted-syntax */
          for (let file of files) {
            uploaded.push({
              title: file.name,
              icon: 'cloud_done',
              getindex: 'GET INDEX',
              createindex: 'CREATE INDEX',
            });
          }
          inputArea.value = '';
          selectArea.innerHTML = '';
          $timeout(() => {
            $scope.isLoading = false;
            uploadDone.style.display = 'block';
            $scope.sidebarOpen ? $scope.toggleLeft() : null;
            $scope.sidebarOpen = false;
          }, 2000);
        },
        xhr: function theXhr() {
          // create an XMLHttpRequest
          const xhr = new XMLHttpRequest();
          $scope.isLoading = true;
          return xhr;
        },
      });
    } else {
      inputArea.value = '';
      selectArea.innerHTML = '';
      cheating.style.display = 'block';
    }
  }

  // show message on create index or get index
  const showMessage = (message) => {
    $mdToast.show(
      $mdToast.simple()
      .textContent(message)
      .position('left')
      .hideDelay(3000),
    );
  };

  // create index function
  function createIndex(b) {
    const documentName = Utility.formatFileName(b);
    appIndex.createIndex(b).then((data) => {
      if (data === undefined) {
        showMessage('Invalid Json File!');
        $scope.title = 'Invalid Json File!';
        $scope.headers = [];
        $scope.words = {};
        $timeout(() => {
          document.getElementById('indextitle').style.display = 'none';
          document.getElementById('badfile').style.display = 'block';
          document.getElementById('indexresults').style.display = 'none';
        }, 10);
        document.getElementById(`${documentName}Create`).innerHTML = 'INVALID FILE';
      } else {
        showMessage('Index Has Been Populated!');
        $scope.title = documentName;
        $scope.headers = Object.keys(appIndex.documentFiles[documentName]);
        $scope.words = appIndex.reference[documentName];
        $scope.currentDocuments.push(documentName);
        $timeout(() => {
          document.getElementById('badfile').style.display = 'none';
          document.getElementById('indextitle').style.display = 'block';
          document.getElementById('indexresults').style.display = 'block';
        }, 10);
        document.getElementById(`${documentName}Create`).innerHTML = 'GET INDEX';
      }
    });
  }

  // search index function
  function searchIndex(value, documentNames) {
    const searchResults = appIndex.searchIndex(value, documentNames);
    if (Object.keys(searchResults)[0] ===
      'No results found : please refine your search query') {
      $scope.searchResults = {
        'No results found : please refine your search query': '',
      };
      $timeout(() => {
        document.getElementById('searchhead').style.display = 'none';
      }, 10);
    } else if (Object.keys(searchResults)[0] ===
      'Please enter search query and select index to search') {
      $scope.searchResults = {
        'Please enter search query and select index to search': '',
      };
      $timeout(() => {
        document.getElementById('searchhead').style.display = 'none';
      }, 10);
    } else {
      $scope.searchResults = searchResults;
      $timeout(() => {
        document.getElementById('searchhead').style.display = 'block';
      }, 10);
    }
  }
}

function themeMaterial($mdThemingProvider) {
  const customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50'],
    500: 'rgb(16,108,200)',
    50: 'ffffff',
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
  .primaryPalette('customBlue', {
    default: '500',
    'hue-1': '50',
  })
  .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
  .primaryPalette('grey');
}

app.config(themeMaterial);

app.controller('InvertedIndexController', invertedIndexController);

/* eslint-disable arrow-body-style */
app.directive('ngEnter', () => {
  return (scope, element, attrs) => {
    element.bind('keydown keypress', (event) => {
      if (event.which === 13) {
        scope.$apply(() => scope.$eval(attrs.ngEnter));
        event.preventDefault();
      }
    });
  };
});
