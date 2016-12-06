(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var InvertedIndex = require('../../js/Inverted-index.js');

var index = new InvertedIndex();

var Utils = require('../../js/Utils.js');

var books = require('../books.json');

describe('Read book data', function () {
  it('Should return a valid JSON array', function () {
    expect(Array.isArray(books)).toBe(true);
  });
  it('Should return a non empty JSON array', function () {
    expect(books.length > 1).toBe(true);
  });
  it('Should remove duplicates from array', function () {
    var duplicate = ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'];
    expect(Utils.unique(duplicate)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
  it('Should return a JSON array which contains objects only', function () {
    var answer = true;
    var count = 0;
    while (count < books.length) {
      if (_typeof(books[count]) != 'object' || Array.isArray(books[count])) {
        answer = false;
      }
      count += 1;
    }
    expect(answer).toBe(true);
  });
  it('Should return a JSON array which has keys (title and text)', function () {
    var answer = true;
    var count = 0;
    while (count < books.length && answer) {
      if (books[count].title === undefined || books[count].text === undefined) {
        answer = false;
      }
      count += 1;
    }
    expect(answer).toBe(true);
  });
  // it('Should return a JSON array which has valid string entries for keys(title, text)', () => {
  //   let answer = true;
  //   let count = 0;
  //   while(count < books.length){
  //     if(typeof books[count].title != 'string' || typeof books[count].text != 'string'){
  //       answer = false;
  //     }
  //     count += 1;
  //   }
  //   expect(answer).toBe(true);

  // });
  // it('Should return the correct filename of the uploaded file', () => {
  //   let answer = Utils.formatFileName('src/jasmine/books.json');
  //   expect(answer).toEqual('books.json');

  // });
});

// describe('Populate Index', () => {
//   describe('On file upload', () => {
//     it('Should create the index once the JSON file has been read', () => {
//       expect(typeof index.reference['books.json']).toEqual('object');

//     });

//     it('Should create an accurate index object', () => {
//       expect(index.getIndex('books.json').alice[0]).toEqual(0);
//       expect(index.getIndex('books.json').lord[0]).toEqual(1);
//       expect(index.getIndex('books.json').a[1]).toEqual(1);

//     });
//     it('Should create an inverted index', () => {
//       let verdict = true;
//       const indexContent = index.reference['books.json'];

//       for (value in indexContent) {
//         if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
//           verdict = false;
//         }
//       }
//       expect(verdict).toEqual(true);

//     });
//     it('Should not overwrite the previously created index', () => {
//       const indexBefore = index.reference['books.json'];
//       const indexAfter = index.reference['tests.json'];
//       expect(typeof indexBefore == 'object' && typeof indexAfter == 'object').toBe(true);

//     });
//   });
// });

// describe('Search Index', () => {
//   describe('Search results', () => {
//     it('Should return the correct result for single word searches', () => {
//       expect(typeof index.searchIndex('Lord')).toEqual('object');

//     });
//     it('Should filter alphanumeric search queries', () => {
//       expect(index.searchIndex('ade **')).toEqual(10);

//     });

//     it('Should return correct search results for multiple word queries', () => {
//       expect(index.searchIndex('Lord of the rings')).toEqual(0);

//     });
//   });

// it(' - The search should not take too long to execute', () => {
//   const startTime = performance.now();
//   index.searchIndex(['valid1.json'], index.createResultHtml, 'alice');
//   const endTime = performance.now();
//   expect(endTime - startTime < 5000).toBeTruthy();
//   
// });

// it('should accept a varied number of argument', () => {
//   let result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', 'lord town');
//   expect(typeof result[0]).toEqual('object');
//   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
//   expect(typeof result[0]).toEqual('object');
//   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice', 'in');
//   expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
//   
// });

// it('It should accept an array of argument', () => {
//   const result = index.searchIndex(['valid1.json'], index.createResultHtml, ['alice', 'in']);
//   expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
//   
// });


// it('It should accept mix of array and words as argument', () => {
//   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
//   expect(typeof result[0]).toEqual('object');
//   
// });

// describe('Get Index', () => {
//   it('should take the filename of the indexed JSON data', () => {
//     expect(typeof index.getIndex('valid1.json')).toEqual('object');
//   });
// });
// });

},{"../../js/Inverted-index.js":3,"../../js/Utils.js":4,"../books.json":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}]},{},[2]);

//# sourceMappingURL=spec.js.map