let arr = null;

describe("Read book data", (done) => {
  let value;
  beforeEach(function(done) {
    getJSON('src/jasmine/books.json', saveTokens)
      .then((savedTokens) => {
        arr = savedTokens;
    });
    setTimeout(function() {
      value = 0;
      done();
    }, 1000);
  });
  it('Should be a valid JSON array', (done) => {
    value++;
    expect(Array.isArray(arr)).toBe(true);
    done();
  });
  it('Should not be empty', (done) => {
    expect(arr.length > 1).toBe(true);
    done();
  });
  it('Should contain objects', (done) => {
    let ans = false;
    let count = 0;
    while(count < arr.length){
      if(typeof arr[count] !== ){

      }
    }
    expect().toBeFalsy();
    done();
  });
  // it('get json database should return the saved content', (done) => {
  //   getFile(valid1, (file) => {
  //     index.saveUploads('valid1.json', file);
  //     expect(Object.keys(index.getjsonDatabase()).length).toEqual(1);
  //     done();
  //   });
  // });
  // it('getfilename should return the filenames of the saved contents', (done) => {
  //   getFile(valid1, (file) => {
  //     index.saveUploads('valid1.json', file);
  //     expect(index.getFilenames()).toEqual(['valid1.json']);
  //     done();
  //   });
  // });
}); 

// describe("Populate Index", () => {
//   it("should verify that the index has been created once the JSON file is read", function() {
//     expect(['1', 2].length > 1).toBe(true);
//   });

//   it("should map string keys to correct objects in the JSON array", function() {
//     expect(['1'].length === 1).toBe(true);
//   });
// }); 

// describe("Search Index", () => {
//   it("should verify that index search returns an array of the indices of the correct objects that contain the words in the search query ", function() {
//     expect(['1', 2].length > 1).toBe(true);
//   });

//   it("should map string keys to correct objects in the JSON array", function() {
//     expect(['1'].length === 1).toBe(true);
//   });
// }); 