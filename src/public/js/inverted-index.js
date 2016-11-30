'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/**
* remove array duplicates.
* @param {array} arr - The array to be filtered.
* @returns {array} The filtered array.
*/
var unique = function unique(arr) {
  var checked = {};
  return arr.filter(function (x) {
    if (!checked[x]) {
      checked[x] = true;
      return x;
    }
    return null;
  });
};

/**
* JSON file reader.
* @param {string} url - The url of JSON file.
* @param {function} callback - the callback function.
* @returns {object} The promised object.
*/
var getJSON = function getJSON(url, callback) {
  return new Promise(function (resolve, reject) {
    /* global XMLHttpRequest */
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function changed() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(callback(this));
      }
    };
    xhr.onerror = reject;
  });
};

/**
* check if object follows allowed structure.
* @param {object} collection - The JSON file content.
* @returns {boolean} The check for collection validity.
*/
var isValidObject = function isValidObject(collection) {
  var i = 0;
  while (i < collection.length) {
    var hasValidTitle = collection[i].title !== undefined && collection[i].title.length > 0 && typeof collection[i].title === 'string';
    var hasValidText = collection[i].text !== undefined && collection[i].text.length > 0 && typeof collection[i].text === 'string';
    if (!(hasValidText && hasValidTitle)) {
      return false;
    }
    i += 1;
  }
  return true;
};

/**
* test if json file is valid.
* @param {string} str - The JSON string.
* @returns {object} The json file.
*/
var isJSON = function isJSON(str) {
  var json = JSON.parse(str);
  if (isValidObject(json)) {
    return json;
  }
  return 'json file is not formatted properly';
};

/**
* save file and sort docs in json.
* @param {object} xhr - xml-http-req response object.
* @returns {array} The tokens docs and words in file.
*/
var saveTokens = function saveTokens(xhr) {
  var docs = isJSON(xhr.responseText);
  var tokens = {};
  var words = [];
  docs.forEach(function (document, index) {
    var token = '';
    token = document.title + ' ' + document.text;
    var uniqueTokens = unique(token.toLowerCase().match(/\w+/g).sort());
    tokens[index] = uniqueTokens;
    words = words.concat(uniqueTokens);
  });
  return [tokens, docs, words];
};

/**
* format file name to acceptable format.
* @param {string} name - the current file url.
* @returns {string} The new valid file name.
*/
var formatFileName = function formatFileName(name) {
  var matcher = new RegExp(/\/\w+.json/, 'gi');
  return matcher.exec(name).toString().slice(1);
};

/**
* populate the object reference attribute.
* @param {object} tokenObj - an object representing the data returned on xhr req.
* @param {object} parent - the current (this) object.
* @param {string} doc - the current file name.
* @returns {object} The file indexes.
*/
var populateReference = function populateReference(tokenObj, parent, doc) {
  var tokenObjKeys = Object.keys(tokenObj);
  var tokenObjKeysLength = tokenObjKeys.length;
  var index = 0;
  parent.reference[doc] = {};
  var tokenIndex = function tokenIndex() {
    tokenObj[index].forEach(function (word) {
      parent.reference[doc][word] !== undefined ? parent.reference[doc][word].push(index) : (parent.reference[doc][word] = [], parent.reference[doc][word].push(index));
    });
    index += 1;
  };
  while (index < tokenObjKeysLength) {
    tokenIndex();
  }
  return parent.reference[doc];
};

/** populate our document repository
* @param {object} tokenObj - an object representing the data returned on xhr req.
* @param {object} parent - the current (this) object.
* @param {string} doc - the current file name.
* @returns {obj} The reference object for current file.
*/
var populateDocFiles = function populateDocFiles(tokenObj, parent, doc) {
  parent.docFiles[doc] = tokenObj;
  return parent.docFiles[doc];
};

/** filter text input
* @param {string} value - the current search query(array or string).
* @returns {array} The filtered search query.
*/
var inputFIlter = function inputFIlter(value) {
  return value.replace(/[^\w\s]/gi, '').split(' ').filter(function (item) {
    return (/\S/gi.test(item)
    );
  });
};

/**
 * Class for creating an inverted index.
 * @extends Point
 */

var InvertedIndex = function () {
  /**
  * Instantiate an inverted index object.
  * @param {object} reference - The inverted index reference object.
  * @param {object} docFiles - The createIndex instance file names.
  * @param {array} docFileNames - an array of the url of files indexed.
  * @param {array} currentDocs - an array of file names indexed
  * @param {array} word - all words from docs in files indexed
  */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.reference = {};
    this.docFileNames = [];
    this.docFiles = {};
    this.currentDocs = [];
    this.words = [];
  }

  /**
  * Create an inverted index from file
  * @param {string} file - The json file url.
  * @returns {object} The reference object for current file.
  */


  _createClass(InvertedIndex, [{
    key: 'createIndex',
    value: function createIndex(file) {
      var _this = this;

      // create index method
      if (this.docFileNames.indexOf(file) === -1) {
        this.docFileNames.push(file);
        getJSON(file, saveTokens).then(function (savedTokens) {
          var docName = formatFileName(file);
          populateDocFiles(savedTokens[1], _this, docName);
          populateReference(savedTokens[0], _this, docName);
          _this.currentDocs.push(docName);
          _this.words = unique(_this.words.concat(savedTokens[2]));
          return _this.reference[docName];
        }).catch(function (err) {
          return err;
        });
      } else {
        return 'document already exists';
      }
    }

    /**
    * Get Created inverted index.
    * @param {string} doc - The file name of currently indexed document.
    * @returns {obj} The reference object for current file.
    */

  }, {
    key: 'getIndex',
    value: function getIndex(doc) {
      return this.reference[doc];
    }

    /**
    * Search inverted index.
    * @param {string} value - The current search query.
    * @returns {object} An object with the searxh results.
    */

  }, {
    key: 'searchIndex',
    value: function searchIndex(value) {
      var _this2 = this;

      this.searchReturn = {};
      if (value !== (null || undefined)) {
        inputFIlter(value).forEach(function (word) {
          _this2.currentDocs.forEach(function (doc) {
            _typeof(_this2.searchReturn[doc]) === 'object' && !Array.isArray(_this2.searchReturn[doc]) ? _this2.searchReturn[doc][word] = _this2.reference[doc][word] : (_this2.searchReturn[doc] = {}, _this2.searchReturn[doc][word] = _this2.reference[doc][word]);
          });
        });
        console.log(this.searchReturn);
        return this.searchReturn;
      }
    }
  }]);

  return InvertedIndex;
}();