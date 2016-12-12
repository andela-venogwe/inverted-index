'use strict';

/**
* Helper Class for creating an inverted index.
*/
class InvertedIndexUtility {
  /** remove array duplicates.
  * @param {array} array - The array to be filtered.
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
    return ['invalid data type supplied'];
  }

  /**
  * JSON file reader.
  * @param {string} url - The url of JSON file.
  * @param {function} callback - the callback function
  * takes in the responseData parameter as argument.
  * @returns {function} The callback value.
  */
  static readFile(url, callback) {
    /* eslint-disable no-undef */
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    this.changed = function changed() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        return callback(this);
      }
      return this.statusText;
    };
    xhr.onreadystatechange = this.changed;
    xhr.onerror = xhr.statusText;
    xhr.send();
  }

  /**
  * check if object is a valid json object.
  * @param {object} jsonObject - The JSON file content.
  * @returns {boolean} ans - The check for jsonObject validity.
  */
  static isValidJson(jsonObject) {
    try {
      Object.keys(jsonObject);
    } catch (error) {
      return false;
    }
    let count = 0;
    if (Object.keys(jsonObject).length > 0) {
      while (count < Object.keys(jsonObject).length) {
        const hasValidTitle = jsonObject[count].title !== undefined &&
        jsonObject[count].title.length > 0 && typeof jsonObject[count].title === 'string';
        const hasValidText = jsonObject[count].text !== undefined &&
        jsonObject[count].text.length > 0 && typeof jsonObject[count].text === 'string';
        if (!(hasValidTitle && hasValidText)) {
          return false;
        }
        else {
          count += 1;
        } 
      }
      return true;
    } else {
      return false;
    }
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
      return 'bad input';
    }
  }

  /** filter text input
  * @param {string} value - the current search query(array or string).
  * @returns {array} The filtered search query.
  */
  static inputFIlter(value) {
    if(Array.isArray(value)){
      value = value.join(' ');
    }
    return value.toLowerCase().replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(item => /\S/gi.test(item));
  }
}
