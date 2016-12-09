(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */

var app = angular.module('Index', ['ngMaterial', 'ngMdIcons']);

var appIndex = new InvertedIndex(InvertedIndexUtility);

var uploaded = [];
var fileNames = [];
var inputArea = document.getElementById('upload-input');
var selectArea = document.getElementById('selected-files');
var uploadDone = document.getElementById('upload-done');
var uploadFailed = document.getElementById('upload-failed');
var cheating = document.getElementById('cheating');

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
  $scope.changeState = function () {
    /* eslint-disable no-unneeded-ternary */
    $scope.state = $scope.state ? false : true;
  };

  $scope.changeStateAgain = function () {
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
      fullscreen: $scope.customFullscreen
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
    var validity = [];
    cheating.style.display = 'none';
    $scope.files = inputArea.files;
    $scope.fileKeys = Object.keys($scope.files).filter(function (key) {
      return key !== 'length';
    });
    $scope.filesSelected = $scope.fileKeys.map(function (file) {
      return $scope.files[file].name;
    });

    selectArea.innerHTML = '';
    new Promise(function (resolve, reject) {
      $scope.filesSelected.forEach(function (item, index) {
        /* eslint-disable no-nested-ternary */
        var fileSize = $scope.files[index].size;
        var color = '';
        var message = '';
        item.endsWith('.json') ? fileSize > 0 ? (color = 'good', message = 'valid file type') : (color = 'bad', message = 'empty json file') : fileSize > 0 ? (color = 'bad', message = 'invalid file type') : (color = 'bad', message = 'empty invalid file type');
        validity.push(message);
        selectArea.innerHTML += '<md-list-item><p> ' + item + ' \n        <span class="message ' + color + '"> ' + message + '</span></p></md-list-item>';
      });
      resolve(validity);
    }).then(function () {
      if (validity.indexOf('invalid file') !== -1 || validity.indexOf('empty invalid file') !== -1 || validity.indexOf('empty json file') !== -1 || validity.indexOf('file already uploaded') !== -1) {
        $scope.$apply(function () {
          $scope.canUpload = false;
          selectArea.innerHTML += '<p style="text-align: center; color: #3004e0">\n          please select non-empty JSON file(s)</p>';
        });
      } else {
        $scope.$apply(function () {
          $scope.canUpload = true;
        });
      }
    });
  }

  // upload json file(s) function
  function uploadJson(e) {
    var _this = this;

    if ($scope.canUpload) {
      (function () {
        $scope.canUpload = false;
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var files = $(_this).get(0).files;
        $scope.filesSelected.forEach(function (item) {
          fileNames.push(item);
        });
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i += 1) {
          /* eslint-disable prefer-const*/
          var file = files[i];
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
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _file = _step.value;

                uploaded.push({
                  title: _file.name,
                  icon: 'cloud_done',
                  getindex: 'GET INDEX',
                  createindex: 'CREATE INDEX'
                });
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            inputArea.value = '';
            selectArea.innerHTML = '';
            $timeout(function () {
              $scope.isLoading = false;
              uploadDone.style.display = 'block';
              $scope.sidebarOpen ? $scope.toggleLeft() : null;
              $scope.sidebarOpen = false;
            }, 2000);
          },
          xhr: function theXhr() {
            // create an XMLHttpRequest
            var xhr = new XMLHttpRequest();
            $scope.isLoading = true;
            return xhr;
          }
        });
      })();
    } else {
      inputArea.value = '';
      selectArea.innerHTML = '';
      cheating.style.display = 'block';
    }
  }

  // show message on create index or get index
  var showMessage = function showMessage(message) {
    $mdToast.show($mdToast.simple().textContent(message).position('left').hideDelay(3000));
  };

  // create index function
  function createIndex(b) {
    var documentName = InvertedIndexUtility.formatFileName(b);
    appIndex.createIndex(b).then(function (data) {
      if (data === undefined) {
        showMessage('Invalid Json File!');
        $scope.title = 'Invalid Json File!';
        $scope.headers = [];
        $scope.words = {};
        $timeout(function () {
          document.getElementById('indextitle').style.display = 'none';
          document.getElementById('badfile').style.display = 'block';
          document.getElementById('indexresults').style.display = 'none';
        }, 10);
        document.getElementById(documentName + 'Create').innerHTML = 'INVALID FILE';
      } else {
        showMessage('Index Has Been Populated!');
        $scope.title = documentName;
        $scope.headers = Object.keys(appIndex.documentFiles[documentName]);
        $scope.words = appIndex.reference[documentName];
        if ($scope.currentDocuments.indexOf(documentName) === -1) {
          $scope.currentDocuments.push(documentName);
        }
        $timeout(function () {
          document.getElementById('badfile').style.display = 'none';
          document.getElementById('indextitle').style.display = 'block';
          document.getElementById('indexresults').style.display = 'block';
        }, 10);
        document.getElementById(documentName + 'Create').innerHTML = 'GET INDEX';
      }
    });
  }

  // search index function
  function searchIndex(value, documentNames) {
    var searchResults = appIndex.searchIndex(value, documentNames);
    if (Object.keys(searchResults)[0] === 'No results found : please refine your search query') {
      $scope.searchResults = {
        'No results found : please refine your search query': ''
      };
      $timeout(function () {
        document.getElementById('searchhead').style.display = 'none';
      }, 10);
    } else if (Object.keys(searchResults)[0] === 'Please enter search query and select index to search') {
      $scope.searchResults = {
        'Please enter search query and select index to search': ''
      };
      $timeout(function () {
        document.getElementById('searchhead').style.display = 'none';
      }, 10);
    } else {
      $scope.searchResults = searchResults;
      $timeout(function () {
        document.getElementById('searchhead').style.display = 'block';
      }, 10);
    }
  }
}

function themeMaterial($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50'],
    500: 'rgb(16,108,200)',
    50: 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default').primaryPalette('customBlue', {
    default: '500',
    'hue-1': '50'
  }).accentPalette('pink');
  $mdThemingProvider.theme('input', 'default').primaryPalette('grey');
}

app.config(themeMaterial);

app.controller('InvertedIndexController', invertedIndexController);

/* eslint-disable arrow-body-style */
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          return scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

},{}]},{},[1]);

//# sourceMappingURL=build.js.map
