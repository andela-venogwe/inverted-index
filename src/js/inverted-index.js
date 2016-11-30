/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/**
* remove array duplicates.
* @param {array} arr - The array to be filtered.
* @returns {array} The filtered array.
*/
const unique = (arr) => {
  const checked = {};
  return arr.filter((x) => {
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
const getJSON = (url, callback) => {
  return new Promise((resolve, reject) => {
    /* global XMLHttpRequest */
    const xhr = new XMLHttpRequest();
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
const isValidObject = (collection) => {
  let i = 0;
  while (i < collection.length) {
    const hasValidTitle = collection[i].title !== undefined &&
    collection[i].title.length > 0 && typeof collection[i].title === 'string';
    const hasValidText = collection[i].text !== undefined &&
    collection[i].text.length > 0 && typeof collection[i].text === 'string';
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
const isJSON = (str) => {
  const json = JSON.parse(str);
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
const saveTokens = (xhr) => {
  const docs = isJSON(xhr.responseText);
  const tokens = {};
  let words = [];
  docs.forEach((document, index) => {
    let token = '';
    token = `${document.title} ${document.text}`;
    const uniqueTokens = unique(token.toLowerCase().match(/\w+/g).sort());
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
const formatFileName = (name) => {
  const matcher = new RegExp(/\/\w+.json/, 'gi');
  return matcher.exec(name)
  .toString()
  .slice(1);
};

/**
* populate the object reference attribute.
* @param {object} tokenObj - an object representing the data returned on xhr req.
* @param {object} parent - the current (this) object.
* @param {string} doc - the current file name.
* @returns {object} The file indexes.
*/
const populateReference = (tokenObj, parent, doc) => {
  const tokenObjKeys = Object.keys(tokenObj);
  const tokenObjKeysLength = tokenObjKeys.length;
  let index = 0;
  parent.reference[doc] = {};
  const tokenIndex = () => {
    tokenObj[index].forEach((word) => {
      parent.reference[doc][word] !== undefined ?
      (parent.reference[doc][word].push(index)) :
      (parent.reference[doc][word] = [],
        parent.reference[doc][word].push(index));
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
const populateDocFiles = (tokenObj, parent, doc) => {
  parent.docFiles[doc] = tokenObj;
  return parent.docFiles[doc];
};

/** filter text input
* @param {string} value - the current search query(array or string).
* @returns {array} The filtered search query.
*/
const inputFIlter = (value) => {
  return value.replace(/[^\w\s]/gi, '')
  .split(' ')
  .filter((item) => {
    return /\S/gi.test(item);
  });
};

/**
 * Class for creating an inverted index.
 * @extends Point
 */
class InvertedIndex {
  /**
  * Instantiate an inverted index object.
  * @param {object} reference - The inverted index reference object.
  * @param {object} docFiles - The createIndex instance file names.
  * @param {array} docFileNames - an array of the url of files indexed.
  * @param {array} currentDocs - an array of file names indexed
  * @param {array} word - all words from docs in files indexed
  */
  constructor() {
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
  createIndex(file) {
    // create index method
    if (this.docFileNames.indexOf(file) === -1) {
      this.docFileNames.push(file);
      getJSON(file, saveTokens)
      .then((savedTokens) => {
        const docName = formatFileName(file);
        populateDocFiles(savedTokens[1], this, docName);
        populateReference(savedTokens[0], this, docName);
        this.currentDocs.push(docName);
        this.words = unique(this.words.concat(savedTokens[2]));
        return this.reference[docName];
      })
      .catch((err) => {
        return err;
      });
    } else { return 'document already exists'; }
  }

  /**
  * Get Created inverted index.
  * @param {string} doc - The file name of currently indexed document.
  * @returns {obj} The reference object for current file.
  */
  getIndex(doc) {
    return this.reference[doc];
  }

  /**
  * Search inverted index.
  * @param {string} value - The current search query.
  * @returns {object} An object with the searxh results.
  */
  searchIndex(value) {
    this.searchReturn = {};
    if (value !== (null || undefined)) {
      inputFIlter(value).forEach((word) => {
        this.currentDocs.forEach((doc) => {
          typeof this.searchReturn[doc] === 'object' &&
          !Array.isArray(this.searchReturn[doc]) ?
          (this.searchReturn[doc][word] = this.reference[doc][word]) :
          (this.searchReturn[doc] = {},
            this.searchReturn[doc][word] = this.reference[doc][word]);
        });
      });
      return this.searchReturn;
    }
  }
}
