/**
* remove array duplicates.
* @param arr - The array to be filtered.
*/
const unique = (arr) => {
  const checked = {}
  return arr.filter(function(x) {
    if (checked[x]){
      return
    }
    checked[x] = true
    return x;
  });
}

/**
* JSON file reader.
* @param url - The url of JSON file.
* @param callback - the callback function.
*/
const getJSON = (url, callback) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        resolve(callback(this));
      }
    }; 
    xhr.onerror = reject;
  });
}

/**
* test if json file is valid.
* @param str - The JSON string.
*/
const isJSON = (str) => {
  const json = JSON.parse(str);
  if(isValidObject(json)){
    return json;
  }
  else{
    throw 'json file is not formatted properly';
  }
}

/** check if object follows allowed structure */
const isValidObject = (collection) => {
  let i = 0; 
  while( i < collection.length){
    const hasValidTitle = collection[i].title !== undefined && 
    collection[i].title.length > 0 && typeof collection[i].title == 'string';
    const hasValidText = collection[i].text !== undefined && 
    collection[i].text.length > 0 && typeof collection[i].text == 'string';
    if (!(hasValidText && hasValidTitle)){
      return false;
    }
    i++;
  }
  return true;
}

/** save file and sort docs in json */
const saveTokens = (xhr) => {
  const docs = isJSON(xhr.responseText);
  const tokens = {};
  let words = [];
  docs.forEach((document, index) => {
    let token = '';
    token += document.title + ' ' + document.text;
    let uniqueTokens = unique(token.toLowerCase().match(/\w+/g).sort());
    tokens[index] = uniqueTokens;
    words = words.concat(uniqueTokens);
  });
  return [tokens, docs, words];
}

/** format file name */
const formatFileName = (name) => {
  const matcher = new RegExp(/\/\w+.json/, 'gi');
  return matcher.exec(name)
  .toString()
  .slice(1);
};

/** populate reference object */
const populateReference = (tokenObj, parent, doc) => {
  // @TODO for of and for in babel
  const tokenObjKeys = Object.keys(tokenObj);
  const tokenObjKeysLength = tokenObjKeys.length;
  let index = 0;
  parent.reference[doc] = {};
  while(index < tokenObjKeysLength){
    tokenObj[index].forEach((word) => {
      parent.reference[doc][word] !== undefined ? (parent.reference[doc][word]
      .push(index)) : (parent.reference[doc][word] = [], 
      parent.reference[doc][word].push(index));
    });
    index += 1;
  }
}

// populate our document repository
const populateDocFiles = (tokenObj, parent, doc) => {
  parent.docFiles[doc] = tokenObj;
}

// filter text input
const inputFIlter = (value) => {
  return value.replace(/[^\w\s]/gi, '')
  .split(' ')
  .filter((item) => { return /\S/.test(item)});
}
/**
 * Class for creating an inverted index.
 * @extends Point
 */
class InvertedIndex{
  /**
  * Create an inverted index.
  * @param reference - The inverted index reference object.
  * @param docFiles - The createIndex instance file names.
  */
  constructor(){
    this.reference = {},
    this.docFileNames = [];
    this.docFiles = {};
    this.currentDocs = [];
    this.words = [];
  }
  
  createIndex(file){
    // create index method
    if(this.docFileNames.indexOf(file) == -1){
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
      .catch(function(err) {
        return err;
      });
    }
    else{
      return 'document already exists';
    }
  }

  getIndex(doc){
    // populate index method
    return this.reference[doc];
  }

  searchIndex(value){
    //search index method
    inputFIlter(value).forEach((word) => {
      this.currentDocs.forEach((doc) => {
        console.log(this.reference[doc][word]);
      })
    });
  }
}