/**
 * Class for creating an inverted index.
 */
class InvertedIndex {
  /**
  * Instantiate an inverted index object.
  * @param {object} reference - The utility class.
  */
  constructor(utils) {
    this.utility = utils;
    this.reference = {};
    this.documentFiles = {};
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
      this.utility.getJSON(url, (data) => {
        resolve(data.response);
      });
    }).then((jsonObject) => {
      try {
        if (this.utility.isValidJson(jsonObject)) {
          const savedTokens = this.utility.saveTokens(jsonObject);
          const documentName = this.utility.formatFileName(url);
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
  * @param {string} documentName - The file name of currently indexed document.
  * @returns {object} The reference object for current file.
  */
  getIndex(documentName) {
    return this.reference[documentName];
  }

  /**
  * Search the inverted index.
  * @param {string} value - The current search query.
  * @param {array} documentNames - an array of current files to searxh.
  * @returns {object} An object with the accurate searxh results.
  */
  searchIndex(value, documentNames) {
    /* eslint-disable no-unused-expressions */
    /* eslint-disable no-unused-vars */
    /* eslint-disable no-nested-ternary */
    this.searchReturn = {};
    if (value !== (null || undefined) && documentNames.length > 0) {
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
      return this.searchReturn;
    }
  }
}

module.exports = InvertedIndex;
