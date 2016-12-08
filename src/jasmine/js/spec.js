(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var InvertedIndex = require('../../js/Inverted-index.js');

var Utils = require('../../js/Inverted-Index-Helper.js');

var index = new InvertedIndex(Utils);

index.createIndex('./src/public/uploads/books.json').then(function () {
  var fileContents = index.currentFile;
  describe('Read book data', function () {
    it('Should return a valid JSON array', function () {
      expect(Array.isArray(fileContents)).toBe(true);
    });
    it('Should return a non empty JSON array', function () {
      expect(fileContents.length > 1).toBe(true);
    });
    it('Should remove duplicates from array', function () {
      var duplicate = ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'];
      expect(index.utility.unique(duplicate)).toEqual(['a', 'b', 'c', 'd', 'e']);
    });
    it('Should return a JSON array which contains objects only', function () {
      var answer = true;
      var count = 0;
      while (count < fileContents.length) {
        if (_typeof(fileContents[count]) != 'object' || Array.isArray(fileContents[count])) {
          answer = false;
        }
        count += 1;
      }
      expect(answer).toBe(true);
    });
    it('Should return a JSON array which has keys (title and text)', function () {
      var answer = true;
      var count = 0;
      while (count < fileContents.length && answer) {
        if (fileContents[count].title === undefined || fileContents[count].text === undefined) {
          answer = false;
        }
        count += 1;
      }
      expect(answer).toBe(true);
    });
    it('Should return a JSON array which has valid string entries for keys(title, text)', function () {
      var answer = true;
      var count = 0;
      while (count < fileContents.length) {
        if (typeof fileContents[count].title != 'string' || typeof fileContents[count].text != 'string') {
          answer = false;
        }
        count += 1;
      }
      expect(answer).toBe(true);
    });
    it('Should return the correct filename of the uploaded file', function () {
      var answer = index.utility.formatFileName('src/jasmine/books.json');
      expect(answer).toEqual('books.json');
    });
  });

  describe('Populate Index', function () {
    describe('On file upload', function () {
      it('Should create the index once the JSON file has been read', function () {
        expect(_typeof(index.reference['books.json'])).toEqual('object');
      });

      it('Should create an accurate index object', function () {
        expect(index.getIndex('/src/public/uploads/books.json').alice[0]).toEqual(0);
        expect(index.getIndex('/src/public/uploads/books.json').lord[0]).toEqual(1);
        expect(index.getIndex('/src/public/uploads/books.json').a[1]).toEqual(1);
      });
      it('Should create an inverted index', function () {
        var verdict = true;
        var indexContent = index.reference['books.json'];
        for (var value in indexContent) {
          if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
            verdict = false;
          }
        }
        expect(verdict).toEqual(true);
      });

      index.createIndex('./src/public/uploads/tests.json').then(function () {
        it('Should not overwrite the previously created index', function () {
          var indexBefore = index.reference['books.json'];
          var indexAfter = index.reference['tests.json'];
          expect((typeof indexBefore === 'undefined' ? 'undefined' : _typeof(indexBefore)) == 'object' && (typeof indexAfter === 'undefined' ? 'undefined' : _typeof(indexAfter)) == 'object').toBe(true);
        });

        describe('Search Index', function () {
          describe('Search results', function () {
            it('Should return the correct result for single word searches', function () {
              expect(_typeof(index.searchIndex('Lord', ['books.json']))).toEqual('object');
            });
            it('Should filter non word search queries', function () {
              var theSearch = Object.keys(index.searchIndex('alliance ** && $$$', ['books.json'])['books.json']);

              expect(theSearch).toEqual(['alliance']);
            });

            it('Should return correct search results for multiple word queries', function () {
              expect(index.searchIndex('lord of the rings', ['books.json'])['books.json']).toEqual({
                lord: [1],
                of: [0, 1],
                the: [1],
                rings: [1]
              });
            });
          });

          it('Should not take too long to execute', function () {
            var startTime = performance.now();
            index.searchIndex('lord of the rings', ['books.json']);
            var endTime = performance.now();
            expect(endTime - startTime < 5000).toBeTruthy();
          });

          it('It should ensure that filename argument is optional', function () {
            var result = index.searchIndex('lord of the rings')['books.json'];
            expect(Object.keys(result).sort()).toEqual(Object.keys({
              lord: [1],
              of: [0, 1],
              the: [1],
              rings: [1]
            }).sort());
          });

          it('It should accept an array of argument', function () {
            var result = index.searchIndex(['lord', 'of', 'the', 'rings'], ['books.json'])['books.json'];
            expect(result).toEqual({
              lord: [1],
              of: [0, 1],
              the: [1],
              rings: [1]
            });
          });

          describe('Get Index', function () {
            it('Should take the file url of the JSON file as an argument', function () {
              expect(index.getIndex('/src/public/uploads/books.json').a[1]).toEqual(1);
            });
          });
        });
      });
    });
  });
});

},{"../../js/Inverted-Index-Helper.js":2,"../../js/Inverted-index.js":3}],2:[function(require,module,exports){
'use strict';

/**
* Helper Class for creating an inverted index.
*/

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InvertedIndexUtility = function () {
  function InvertedIndexUtility() {
    _classCallCheck(this, InvertedIndexUtility);
  }

  _createClass(InvertedIndexUtility, null, [{
    key: 'unique',

    /** remove array duplicates.
    * @param {array} array - The array to be filtered.
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
      var jsonObjectKeys = null;
      var jsonObjectLength = null;
      try {
        jsonObjectKeys = Object.keys(jsonObject);
        jsonObjectLength = jsonObjectKeys.length;
      } catch (error) {
        return false;
      }
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
          var words = [];
          jsonObject.forEach(function (documentObject, index) {
            var token = '';
            token = documentObject.title + ' ' + documentObject.text;
            var uniqueTokens = _this.unique(token.toLowerCase().match(/\w+/g).sort());
            tokens[index] = uniqueTokens;
            words = words.concat(uniqueTokens);
          });
          return {
            v: { tokens: tokens, jsonObject: jsonObject, words: words }
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
      if (Array.isArray(value)) {
        value = value.join(' ');
      }
      return value.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').filter(function (item) {
        return (/\S/gi.test(item)
        );
      });
    }
  }]);

  return InvertedIndexUtility;
}();

module.exports = InvertedIndexUtility;

},{}],3:[function(require,module,exports){
'use strict';

/**
 * Class for creating an inverted index.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InvertedIndex = function () {
  /**
  * Instantiate an inverted index object.
  * @param {object} utility - The InvertedIndexHelper class.
  */
  function InvertedIndex(utility) {
    _classCallCheck(this, InvertedIndex);

    this.utility = utility;
    this.reference = {};
    this.documentFiles = {};
    this.currentFile = [];
    this.currentDocuments = [];
    this.allWords = [];
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
            _this.currentFile = jsonObject;
            _this.utility.populateReference(savedTokens.tokens, _this, documentName);
            _this.currentDocuments.push(documentName);
            _this.allWords = _this.utility.unique(_this.allWords.concat(savedTokens.words));
            return _this.reference[documentName];
          }
        } catch (error) {
          throw error;
        }
      });
    }

    /**
    * Get Created inverted index.
    * @param {string} url - The file url of the json document.
    * @returns {object} The reference object for current file.
    */

  }, {
    key: 'getIndex',
    value: function getIndex(url) {
      var documentName = this.utility.formatFileName(url);
      return this.reference[documentName];
    }

    /**
    * Search the inverted index.
    * @param {string} value - The current search query.
    * @param {array} documentNames - an array of current files to searxh.
    * @returns {object} An object with the accurate search results.
    */

  }, {
    key: 'searchIndex',
    value: function searchIndex(value, documentNames) {
      var _this2 = this;

      /* eslint-disable no-unused-expressions */
      /* eslint-disable no-unused-vars */
      /* eslint-disable no-nested-ternary */
      this.searchReturn = {};
      if (value !== (null || undefined)) {
        if (documentNames === undefined || documentNames.length < 1 || documentNames === '') {
          documentNames = this.currentDocuments;
        }
        this.utility.inputFIlter(value).filter(function (word) {
          return _this2.allWords.indexOf(word) !== -1;
        }).forEach(function (word) {
          documentNames.forEach(function (documentFile) {
            var docKeys = Object.keys(_this2.reference[documentFile]);
            _typeof(_this2.searchReturn[documentFile]) === 'object' && !Array.isArray(_this2.searchReturn[documentFile]) ? docKeys.indexOf(word) !== -1 ? _this2.searchReturn[documentFile][word] = _this2.reference[documentFile][word] : null : docKeys.indexOf(word) !== -1 ? (_this2.searchReturn[documentFile] = {}, _this2.searchReturn[documentFile][word] = _this2.reference[documentFile][word]) : null;
          });
        });
        if (Object.keys(this.searchReturn).length < 1) {
          return { 'No results found : please refine your search query': '' };
        }
        return this.searchReturn;
      }
      return { 'Please enter search query and select index to search': '' };
    }
  }]);

  return InvertedIndex;
}();

module.exports = InvertedIndex;

},{}]},{},[1]);

//# sourceMappingURL=spec.js.map
