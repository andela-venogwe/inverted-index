let arr = null;
const index = new InvertedIndex();

describe('Read book data', (done) => {
  beforeEach(function(done) {
    getJSON('src/jasmine/books.json', saveTokens)
      .then((savedTokens) => {
        arr = savedTokens[1];
    });
    index.createIndex('src/jasmine/books.json');
    index.createIndex('src/jasmine/tests.json');
    setTimeout(function() {
      done();
    }, 1000);
  });
  it('Should return a valid JSON array', (done) => {
    expect(Array.isArray(arr)).toBe(true);
    done();
  });
  it('Should return a non empty JSON array', (done) => {
    expect(arr.length > 1).toBe(true);
    done();
  });
  it('Should remove duplicates from array', (done) => {
    const duplicate = ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'];
    expect(unique(duplicate)).toEqual(['a', 'b', 'c', 'd', 'e']);
    done();
  });
  it('Should return a JSON array which contains objects only', (done) => {
    let ans = true;
    let count = 0;
    while(count < arr.length){
      if(typeof arr[count] != 'object' || Array.isArray(arr[count])){
        ans = false;
      }
      count += 1;
    }
    expect(ans).toBe(true);
    done();
  });
  it('Should return a JSON array which has keys (title and text)', (done) => {
    let ans = true;
    let count = 0;
    while(count < arr.length){
      if(arr[count].title === undefined || arr[count].text === undefined){
        ans = false;
      }
      count += 1;
    }
    expect(ans).toBe(true);
    done();
  });
  it('Should return a JSON array which has valid string entries for keys(title, text)', (done) => {
    let ans = true;
    let count = 0;
    while(count < arr.length){
      if(typeof arr[count].title != 'string' || typeof arr[count].text != 'string'){
        ans = false;
      }
      count += 1;
    }
    expect(ans).toBe(true);
    done();
  });
  it('Should return the correct filename of the uploaded file', (done) => {
    let ans = formatFileName('src/jasmine/books.json');
    expect(ans).toEqual('books.json');
    done();
  });
}); 

describe('Populate Index', () => {
  describe('On file upload', () => {
    it('Should create the index once the JSON file has been read', (done) => {
      expect(typeof index.reference['books.json']).toEqual('object');
      done();
    });

    it('Should create an accurate index object', (done) => {
      expect(index.getIndex('books.json').alice[0]).toEqual(0);
      expect(index.getIndex('books.json').lord[0]).toEqual(1);
      expect(index.getIndex('books.json').a[1]).toEqual(1);
      done();
    });
    it('Should create an inverted index', (done) => {
      let verdict = true;
      const indexContent = index.reference['books.json'];

      for (value in indexContent) {
        if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
          verdict = false;
        }
      }
      expect(verdict).toEqual(true);
      done();
    });
    it('Should not overwrite the previously created index', (done) => {
      const indexBefore = index.reference['books.json']
      const indexAfter = index.reference['tests.json']
      expect(typeof indexBefore == 'object' && typeof indexAfter == 'object').toBe(true);
      done();
    });
  });
});

describe('Search Index', () => {
  describe('Search results', () => {
    it('Should return the correct result for single word searches', (done) => {
      expect(index.searchIndex('Lord')).toEqual([]);
      done();
    });
    it('Should filter alphanumeric search queries', (done) => {
      expect(index.searchIndex('ade **')).toEqual(10);
      done();
    });

    it('Should return correct search results for multiple word queries', (done) => {
      expect(index.searchIndex('Lord of the rings')).toEqual(0);
      done();
    });
  });

  // it(' - The search should not take too long to execute', (done) => {
  //   const startTime = performance.now();
  //   index.searchIndex(['valid1.json'], index.createResultHtml, 'alice');
  //   const endTime = performance.now();
  //   expect(endTime - startTime < 5000).toBeTruthy();
  //   done();
  // });

  // it('should accept a varied number of argument', (done) => {
  //   let result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', 'lord town');
  //   expect(typeof result[0]).toEqual('object');
  //   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
  //   expect(typeof result[0]).toEqual('object');
  //   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice', 'in');
  //   expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
  //   done();
  // });

  // it('It should accept an array of argument', (done) => {
  //   const result = index.searchIndex(['valid1.json'], index.createResultHtml, ['alice', 'in']);
  //   expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
  //   done();
  // });


  // it('It should accept mix of array and words as argument', (done) => {
  //   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
  //   expect(typeof result[0]).toEqual('object');
  //   done();
  // });

  // describe('Get Index', () => {
  //   it('should take the filename of the indexed JSON data', () => {
  //     expect(typeof index.getIndex('valid1.json')).toEqual('object');
  //   });
  // });
});