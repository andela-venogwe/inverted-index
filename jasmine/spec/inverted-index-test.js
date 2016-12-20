'use strict';

/* eslint-disable no-unsed-vars */
/* eslint-disable no-undef */
const index = new InvertedIndex();

describe('Read book data', () => {
  let fileContents = undefined;
  beforeAll(function (done) {
    index.createIndex('/src/public/uploads/tests.json')
      .then(() => {
        index.createIndex('./src/public/uploads/books.json')
          .then(() => {
            fileContents = index.currentFile;
            done();
          });
      });
  });

  it('Should return a valid JSON array', () => {
    expect(typeof index.createIndex).toBe('function');
    expect(typeof InvertedIndexUtility.readFile).toBe('function');
    expect(typeof InvertedIndexUtility.changed).toBe('function');
    expect(typeof InvertedIndexUtility.changed()).toBe('undefined');
    expect(InvertedIndexUtility.readFile('./src/public/uploads/books.json', (data) => {
        return data;
      }))
      .toBe(undefined);
    expect(Array.isArray(fileContents)).toBe(true);
  });

  it('Should return a non empty JSON array', () => {
    expect(fileContents.length > 1).toBe(true);
  });

  it('Should remove duplicates from array', () => {
    const duplicate = ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'];
    expect(InvertedIndexUtility.unique(duplicate))
      .toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('Should return "["invalid data type"]" for invalid data types', () => {
    expect(InvertedIndexUtility.unique(''))
      .toEqual(['invalid data type supplied']);

    expect(InvertedIndexUtility.unique(() => {}))
      .toEqual(['invalid data type supplied']);

    expect(InvertedIndexUtility.unique({}))
      .toEqual(['invalid data type supplied']);

    expect(InvertedIndexUtility.unique(66))
      .toEqual(['invalid data type supplied']);
  });

  it('Should return a JSON array which contains objects only', () => {
    let answer = true;
    let count = 0;
    while (count < fileContents.length) {
      if (typeof fileContents[count] != 'object' || Array.isArray(fileContents[count])) {
        answer = false;
      }
      count += 1;
    }
    expect(answer).toBe(true);
  });

  it('Should return a JSON array which has valid string entries for keys(title, text)', () => {
    const testJson = [{
      "title": "The Lord of the Rings: The Fellowship of the Ring."
    }];
    const testJson2 = [{
      "text": "The Lord of the Rings: The Fellowship of the Ring."
    }]
    expect(InvertedIndexUtility.isValidJson(fileContents)).toBe(true);
    expect(InvertedIndexUtility.isValidJson('')).toBe(false);
    expect(InvertedIndexUtility.isValidJson([])).toBe(false);
    expect(InvertedIndexUtility.isValidJson(testJson)).toBe(false);
    expect(InvertedIndexUtility.isValidJson(testJson2)).toBe(false);
  });

  it('Should return the correct filename of the uploaded file', () => {
    let answer = InvertedIndexUtility.formatFileName('src/jasmine/books.json');
    let failed = InvertedIndexUtility.formatFileName([]);
    expect(answer).toEqual('books.json');
    expect(failed).toEqual('bad input');
  });
});

describe('Populate Index', () => {
  describe('On file upload', () => {
    const jsoncontent = [{
      "title": "Alice",
      "text": "fall imagination."
    }, ];
    it('Should create the index once the JSON file has been read', () => {
      expect(typeof index.reference['books.json']).toEqual('object');
      expect(typeof index.populateReference).toEqual('function');
      expect(index.populateReference({ "0": ["a", "alice", "and"] }, 'books2.json'))
        .toEqual({ a: [0], alice: [0], and: [0] });
    });

    it('Should create an accurate index object', () => {
      expect(index.getIndex('/src/public/uploads/books.json').alice[0])
        .toEqual(0);
      expect(index.getIndex('/src/public/uploads/books.json').lord[0])
        .toEqual(1);
      expect(index.getIndex('/src/public/uploads/books.json').a[1])
        .toEqual(1);
    });

    it('Should create an inverted index', () => {
      let verdict = true;
      const indexContent = index.reference['books.json'];
      for (let value in indexContent) {
        if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
          verdict = false;
        }
      }
      expect(verdict).toEqual(true);
    });

    it('Should not overwrite the previously created index', () => {
      const indexBefore = index.reference['books.json'];
      const indexAfter = index.reference['tests.json'];
      expect(typeof indexBefore == 'object' && typeof indexAfter == 'object').toBe(true);
    });

    it('Should save tokens when called with a valid json file', () => {
      expect(index.saveTokens(jsoncontent).tokens).toEqual({ 0: ['alice', 'fall', 'imagination'] });
    });
  });
});


describe('Search Index', () => {
  describe('Search results', () => {
    it('Should return the correct result for single word searches', () => {
      expect(typeof index.searchIndex('Lord', ['books.json'])).toEqual('object');
    });

    it('Should filter non word search queries', () => {
      const theSearch = Object.keys(index
        .searchIndex('alliance ** && $$$', ['books.json'])['books.json']);

      expect(theSearch).toEqual(['alliance']);
    });

    it('Should return correct search results for multiple word queries', () => {
      expect(index.searchIndex('lord of the rings', ['books.json'])['books.json']).toEqual({
        lord: [1],
        of: [0, 1],
        the: [1],
        rings: [1]
      });
      expect(index.searchIndex('lord of', ['books.json']))
        .toEqual({ "books.json": { lord: [1], of: [0, 1] } });
      expect(index.searchIndex('lord of', ['books.json'])["books.json"].lord)
        .toEqual([1]);
    });

    it('Should return correct search results for invalid queries', () => {
      expect(index.searchIndex('middleware', ['books.json']))
        .toEqual({ 'No results found : please refine your search query': '' });
      expect(index.searchIndex())
        .toEqual({ 'Please enter search query and select index to search': '' });
    });
  });

  it('Should not take too long to execute', () => {
    const startTime = performance.now();
    index.searchIndex('lord of the rings', ['books.json']);
    const endTime = performance.now();
    expect(endTime - startTime < 5000).toBeTruthy();
  });

  it('It should ensure that filename argument is optional', () => {
    const result = index.searchIndex('lord of the rings')['books.json'];
    expect(Object.keys(result).sort()).toEqual(Object.keys({
      lord: [1],
      of: [0, 1],
      the: [1],
      rings: [1]
    }).sort());
  });

  it('It should accept an array of argument', () => {
    const result = index.searchIndex(['lord', 'of', 'the', 'rings'], ['books.json'])['books.json'];
    expect(result).toEqual({
      lord: [1],
      of: [0, 1],
      the: [1],
      rings: [1]
    });
  });
});

describe('Get Index', () => {
  it('Should take the file url of the JSON file as an argument', () => {
    expect(index.getIndex('/src/public/uploads/books.json').a[1])
      .toEqual(1);
  });
});
