class Utils {
  /** remove array duplicates.
  * @param {array} arr - The array to be filtered.
  * @returns {array} The filtered array.
  */
  static unique(array) {
    if (Array.isArray(array)) {
      const checked = {};
      return array.filter((item) => {
        if (!checked[item]) {
          checked[item] = true;
          return item;
        }
        return null;
      });
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
  static getJSON(url, callback) {
    /* eslint-disable no-undef */
    const xhr = new XMLHttpRequest();
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
  static isValidJson(jsonObject) {
    const jsonObjectKeys = Object.keys(jsonObject);
    const jsonObjectLength = jsonObjectKeys.length;
    let count = 0;
    let ans = true;
    if (jsonObjectLength > 0) {
      while (count < jsonObjectLength) {
        const hasValidTitle = jsonObject[count].title !== undefined &&
        jsonObject[count].title.length > 0 && typeof jsonObject[count].title === 'string';
        const hasValidText = jsonObject[count].text !== undefined &&
        jsonObject[count].text.length > 0 && typeof jsonObject[count].text === 'string';
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
  static formatFileName(url) {
    try {
      const matcher = new RegExp(/\/\w+.json/, 'gi');
      return matcher.exec(url)
      .toString()
      .slice(1);
    } catch (error) {
      throw error;
    }
  }

  /**
  * save file and sort docs in json.
  * @param {object} jsonObject - a json object.
  * @returns {object} an object containing he saved tokens and jsonObject.
  */
  static saveTokens(jsonObject) {
    try {
      const tokens = {};
      jsonObject.forEach((documentObject, index) => {
        let token = '';
        token = `${documentObject.title} ${documentObject.text}`;
        const uniqueTokens = this.unique(token.toLowerCase().match(/\w+/g)
        .sort());
        tokens[index] = uniqueTokens;
      });
      return { tokens, jsonObject };
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
  static populateReference(jsonObject, parent, theDocument) {
    /* eslint-disable no-param-reassign */
    /* eslint-disable no-unused-expression */
    const jsonObjectKeys = Object.keys(jsonObject);
    const jsonObjectKeysLength = jsonObjectKeys.length;
    let index = 0;
    parent.reference[theDocument] = {};
    const tokenIndex = () => {
      jsonObject[index].forEach((word) => {
        /* eslint-disable no-unused-expressions */
        parent.reference[theDocument][word] !== undefined ?
        (parent.reference[theDocument][word].push(index)) :
        (parent.reference[theDocument][word] = [],
          parent.reference[theDocument][word].push(index));
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
  static inputFIlter(value) {
    return value.replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(item => /\S/gi.test(item));
  }
}

module.exports = Utils;
