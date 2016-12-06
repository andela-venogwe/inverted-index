(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class for creating an inverted index.
 */
var InvertedIndex = function () {
  /**
  * Instantiate an inverted index object.
  * @param {object} reference - The utility class.
  */
  function InvertedIndex(utils) {
    _classCallCheck(this, InvertedIndex);

    this.utility = utils;
    this.reference = {};
    this.documentFiles = {};
    this.currentDocuments = [];
  }

  /**
  * Create an inverted index from file
  * @param {string} url - The json file url.
  * @returns {object} The reference object for current file.
  */


  _createClass(InvertedIndex, [{
    key: 'createIndex',
    value: function createIndex(url) {
      var _this = this;

      /* eslint-disable no-unused-vars */
      /* eslint-disable consistent-return */
      return new Promise(function (resolve, reject) {
        _this.utility.getJSON(url, function (data) {
          resolve(data.response);
        });
      }).then(function (jsonObject) {
        try {
          if (_this.utility.isValidJson(jsonObject)) {
            var savedTokens = _this.utility.saveTokens(jsonObject);
            var documentName = _this.utility.formatFileName(url);
            _this.utility.populateReference(savedTokens.tokens, _this, documentName);
            _this.currentDocuments.push(documentName);
            return _this.reference[documentName];
          }
        } catch (error) {
          throw error;
        }
      });
    }

    /**
    * Get Created inverted index.
    * @param {string} documentName - The file name of currently indexed document.
    * @returns {object} The reference object for current file.
    */

  }, {
    key: 'getIndex',
    value: function getIndex(documentName) {
      return this.reference[documentName];
    }
    /* eslint-disable consistent-return */
    /**
    * Search inverted index.
    * @param {string} value - The current search query.
    * @param {array} documentNames - an array of current files to searxh.
    * @returns {object} An object with the searxh results.
    */

  }, {
    key: 'searchIndex',
    value: function searchIndex(value, documentNames) {
      var _this2 = this;

      /* eslint-disable no-unused-expressions */
      /* eslint-disable no-unused-vars */
      this.searchReturn = {};
      if (value !== (null || undefined)) {
        this.utility.inputFIlter(value).forEach(function (word) {
          documentNames.forEach(function (documentFile) {
            _typeof(_this2.searchReturn[documentFile]) === 'object' && !Array.isArray(_this2.searchReturn[documentFile]) ? _this2.searchReturn[documentFile][word] = _this2.reference[documentFile][word] : (_this2.searchReturn[documentFile] = {}, _this2.searchReturn[documentFile][word] = _this2.reference[documentFile][word]);
          });
        });
        return this.searchReturn;
      }
    }
  }]);

  return InvertedIndex;
}();

module.exports = InvertedIndex;

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'unique',

    /** remove array duplicates.
    * @param {array} arr - The array to be filtered.
    * @returns {array} The filtered array.
    */
    value: function unique(array) {
      if (Array.isArray(array)) {
        var _ret = function () {
          var checked = {};
          return {
            v: array.filter(function (item) {
              if (!checked[item]) {
                checked[item] = true;
                return item;
              }
              return null;
            })
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
      return [];
    }

    /**
    * JSON file reader.
    * @param {string} url - The url of JSON file.
    * @param {function} callback - the callback function
    * takes in the responseData parameter as argument.
    * @returns {function} The callback value.
    */

  }, {
    key: 'getJSON',
    value: function getJSON(url, callback) {
      /* eslint-disable no-undef */
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function changed() {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            return callback(this);
          }
        }
        return this.statusText;
      };
      xhr.onerror = xhr.statusText;
      xhr.send();
    }

    /**
    * check if object is a valid json file.
    * @param {object} jsonObject - The JSON file content.
    * @returns {boolean} ans - The check for jsonObject validity.
    */

  }, {
    key: 'isValidJson',
    value: function isValidJson(jsonObject) {
      var jsonObjectKeys = Object.keys(jsonObject);
      var jsonObjectLength = jsonObjectKeys.length;
      var count = 0;
      var ans = true;
      if (jsonObjectLength > 0) {
        while (count < jsonObjectLength) {
          var hasValidTitle = jsonObject[count].title !== undefined && jsonObject[count].title.length > 0 && typeof jsonObject[count].title === 'string';
          var hasValidText = jsonObject[count].text !== undefined && jsonObject[count].text.length > 0 && typeof jsonObject[count].text === 'string';
          if (!(hasValidTitle && hasValidText)) {
            ans = false;
            return ans;
          }
          count += 1;
        }
      } else {
        ans = false;
      }
      return ans;
    }

    /**
    * format file url to acceptable file name format.
    * @param {string} url - the current file url.
    * @returns {string} The new valid file name.
    */

  }, {
    key: 'formatFileName',
    value: function formatFileName(url) {
      try {
        var matcher = new RegExp(/\/\w+.json/, 'gi');
        return matcher.exec(url).toString().slice(1);
      } catch (error) {
        throw error;
      }
    }

    /**
    * save file and sort docs in json.
    * @param {object} jsonObject - a json object.
    * @returns {object} an object containing he saved tokens and jsonObject.
    */

  }, {
    key: 'saveTokens',
    value: function saveTokens(jsonObject) {
      var _this = this;

      try {
        var _ret2 = function () {
          var tokens = {};
          jsonObject.forEach(function (documentObject, index) {
            var token = '';
            token = documentObject.title + ' ' + documentObject.text;
            var uniqueTokens = _this.unique(token.toLowerCase().match(/\w+/g).sort());
            tokens[index] = uniqueTokens;
          });
          return {
            v: { tokens: tokens, jsonObject: jsonObject }
          };
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
      } catch (error) {
        throw error;
      }
    }

    /**
    * populate the object reference and document attribute.
    * @param {object} jsonObject - the jsonObject.
    * @param {object} parent - the current (this) object.
    * @param {string} theDocument - the current file name.
    * @returns {object} The file indexes.
    */

  }, {
    key: 'populateReference',
    value: function populateReference(jsonObject, parent, theDocument) {
      /* eslint-disable no-param-reassign */
      /* eslint-disable no-unused-expression */
      var jsonObjectKeys = Object.keys(jsonObject);
      var jsonObjectKeysLength = jsonObjectKeys.length;
      var index = 0;
      parent.reference[theDocument] = {};
      var tokenIndex = function tokenIndex() {
        jsonObject[index].forEach(function (word) {
          /* eslint-disable no-unused-expressions */
          parent.reference[theDocument][word] !== undefined ? parent.reference[theDocument][word].push(index) : (parent.reference[theDocument][word] = [], parent.reference[theDocument][word].push(index));
        });
        index += 1;
      };
      while (index < jsonObjectKeysLength) {
        tokenIndex();
      }
      parent.documentFiles[theDocument] = jsonObject;
      return parent.reference[theDocument];
    }

    /** filter text input
    * @param {string} value - the current search query(array or string).
    * @returns {array} The filtered search query.
    */

  }, {
    key: 'inputFIlter',
    value: function inputFIlter(value) {
      return value.replace(/[^\w\s]/gi, '').split(' ').filter(function (item) {
        return (/\S/gi.test(item)
        );
      });
    }
  }]);

  return Utils;
}();

module.exports = Utils;

},{}],3:[function(require,module,exports){
'use strict';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var InvertedIndex = require('./Inverted-index.js');

var Utils = require('./Utils.js');

var app = angular.module('Index', ['ngMaterial', 'ngMdIcons']);

var appIndex = new InvertedIndex(Utils);

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
  // $scope.autoComplete = autoComplete;
  $scope.canUpload = false;
  $scope.sidebarOpen = true;
  $scope.selected = '';
  $scope.changeState = function () {
    $scope.state = $scope.state === true ? false : true;
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

    // document.getElementById('selected-files').innerHTML = '';
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
              $scope.canUpload = false;
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
  var showMessage = function showMessage(messageType) {
    var message = '';
    messageType === 'invalid' ? message = 'Invalid Json File!' : message = 'Index Has Been Created!';
    $mdToast.show($mdToast.simple().textContent(message).position('left').hideDelay(3000));
  };

  // show get index message
  $scope.showGetIndexMessage = showMessage;

  // show create index message
  $scope.showCreateIndexMessage = showMessage;

  // create index function
  function createIndex(b) {
    var documentName = Utils.formatFileName(b);
    appIndex.createIndex(b).then(function (data) {
      if (data !== undefined) {
        $scope.title = documentName;
        $scope.headers = Object.keys(appIndex.documentFiles[documentName]);
        $scope.words = appIndex.reference[documentName];
        $scope.currentDocuments.push(documentName);
        //$scope.autocompleteOptions = appIndex.reference[documentName];
        document.getElementById(documentName + 'Create').innerHTML = 'GET INDEX';
      } else {
        showMessage('invalid');
      }
    });
  }

  // search index function
  function searchIndex(value, documentNames) {
    if (documentNames !== undefined && value !== undefined) {
      $scope.searchResults = appIndex.searchIndex(value, documentNames);
    }
  }

  // // autocomplete search input
  // function autoComplete(string) {
  //   $scope.hidethis = false;
  //   const output = [];
  //   angular.forEach($scope.autocompleteOptions, (word) => {
  //     if (word.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
  //       output.push(word);
  //     }
  //   });
  //   $scope.filterWords = output;
  //   $scope.fillTextbox = (string) => {
  //     $scope.word = string;
  //     $scope.hidethis = true;
  //   };
  // }
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

app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

},{"./Inverted-index.js":1,"./Utils.js":2}]},{},[3]);

//# sourceMappingURL=build.js.map
