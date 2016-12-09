'use strict';

/**
 * Class for creating an inverted index.
 */
class InvertedIndex {
  /**
  * Instantiate an inverted index object.
  * @param {object} utility - The InvertedIndexHelper class.
  */
  constructor(utility) {
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
  createIndex(url) {
    /* eslint-disable no-unused-vars */
    /* eslint-disable consistent-return */
    return new Promise((resolve, reject) => {
      this.utility.readFile(url, (data) => {
        resolve(data.response);
      });
    }).then((jsonObject) => {
      try {
        if (this.utility.isValidJson(jsonObject)) {
          const savedTokens = this.utility.saveTokens(jsonObject);
          const documentName = this.utility.formatFileName(url);
          this.currentFile = jsonObject;
          this.utility.populateReference(savedTokens.tokens, this, documentName);
          this.currentDocuments.push(documentName);
          this.allWords = this.utility.unique(this.allWords.concat(savedTokens.words));
          return this.reference[documentName];
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
  getIndex(url) {
    const documentName = this.utility.formatFileName(url);
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
      this.utility.inputFIlter(value)
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
      }
      return this.searchReturn;
    }
    return { 'Please enter search query and select index to search': '' };
  }
}

//module.exports = InvertedIndex;
