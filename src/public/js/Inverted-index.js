'use strict';

/**
 * Class for creating an inverted index.
 */
class InvertedIndex {
  /**
   *  class constructor
   *  @constructor
   */
  constructor() {
    this.reference = {};
    this.documentFiles = {};
    this.currentFile = [];
    this.currentDocuments = [];
    this.allWords = [];
    this.allUnsortedDocuments = {};
  }

  /**
   * Save Tokens
   * @param {object} jsonObject - the jsonObject.
   * @returns {object} an object with the tokens jsonObject and words.
   */
  saveTokens(jsonObject) {
    const tokens = {};
    let words = [];
    jsonObject.forEach((documentObject, index) => {
      let token = '';
      token = `${documentObject.title} ${documentObject.text}`;
      const uniqueTokens = InvertedIndexUtility.unique(token.toLowerCase().match(/\w+/g)
        .sort());
      tokens[index] = uniqueTokens;
      words = words.concat(uniqueTokens);
    });
    return { tokens, jsonObject, words };
  }

  /**
   * populateReference to populate the reference and document attribute.
   * @param {object} jsonObject - the jsonObject.
   * @param {string} theDocument - the current file name.
   * @returns {object} The file indexes.
   */
  populateReference(jsonObject, theDocument) {
    /* eslint-disable no-param-reassign */
    /* eslint-disable no-unused-expression */
    let index = 0;
    this.reference[theDocument] = {};
    const tokenIndex = () => {
      jsonObject[index].forEach((word) => {
        /* eslint-disable no-unused-expressions */
        this.reference[theDocument][word] !== undefined ?
          (this.reference[theDocument][word].push(index)) :
          (this.reference[theDocument][word] = [],
            this.reference[theDocument][word].push(index));
      });
      index += 1;
    };
    while (index < Object.keys(jsonObject).length) {
      tokenIndex();
    }
    this.documentFiles[theDocument] = jsonObject;
    return this.reference[theDocument];
  }

  /**
   * Create an inverted index from file
   * @param {string} url - The json file url.
   * @returns {object} The reference object for current file.
   */
  createIndex(url) {
    /* eslint-disable no-unused-vars */
    /* eslint-disable consistent-return */
    return new Promise((resolve, reject) => {
      InvertedIndexUtility.readFile(url, (data) => {
        resolve(data.response);
      });
    }).then((jsonObject) => {
      try {
        if (InvertedIndexUtility.isValidJson(jsonObject)) {
          const savedTokens = this.saveTokens(jsonObject);
          const documentName = InvertedIndexUtility.formatFileName(url);
          this.currentFile = jsonObject;
          this.populateReference(savedTokens.tokens, documentName);
          this.currentDocuments.push(documentName);
          this.allUnsortedDocuments[documentName] = jsonObject;
          this.allWords = InvertedIndexUtility.unique(this.allWords.concat(savedTokens.words));
          return this.reference[documentName];
        }
      } catch (error) {
        return error;
      }
    });
  }

  /**
   * Get Created inverted index.
   * @param {string} url - The file url of the json document.
   * @returns {object} The reference object for current file.
   */
  getIndex(url) {
    const documentName = InvertedIndexUtility.formatFileName(url);
    return this.reference[documentName];
  }

  /**
   * Search the inverted index.
   * @param {string} value - The current search query.
   * @param {array} documentNames - an array of current files to searxh.
   * @returns {object} An object with the accurate search results.
   */
  searchIndex(value, documentNames) {
    /* eslint-disable no-unused-expressions */
    /* eslint-disable no-unused-vars */
    /* eslint-disable no-nested-ternary */
    this.searchReturn = {};
    if (value !== (null || undefined)) {
      if (documentNames === undefined || documentNames.length < 1 ||
        documentNames === '') {
        documentNames = this.currentDocuments;
      }
      InvertedIndexUtility.inputFIlter(value)
        .filter(word => this.allWords.indexOf(word) !== -1)
        .forEach((word) => {
          documentNames.forEach((documentFile) => {
            const docKeys = Object.keys(this.reference[documentFile]);
            (typeof this.searchReturn[documentFile] === 'object' &&
              !Array.isArray(this.searchReturn[documentFile])) ?
            (docKeys.indexOf(word) !== -1 ?
              (this.searchReturn[documentFile][word] =
                this.reference[documentFile][word]) : null) :
            (docKeys.indexOf(word) !== -1 ?
              (this.searchReturn[documentFile] = {},
                this.searchReturn[documentFile][word] =
                this.reference[documentFile][word]) : null);
          });
        });
      if (Object.keys(this.searchReturn).length < 1) {
        return { 'No results found : please refine your search query': '' };
      } else { return this.searchReturn; }
    }
    return { 'Please enter search query and select index to search': '' };
  }
}
