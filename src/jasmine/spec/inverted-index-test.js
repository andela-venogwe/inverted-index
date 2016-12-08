'use strict';

const InvertedIndex = require('../../js/Inverted-index.js');

const index = new InvertedIndex();

const Utils = require('../../js/Inverted-Index-Helper.js');

const books = require('../books.json');

describe('Read book data', () => {
  it('Should return a valid JSON array', () => {
    expect(Array.isArray(books)).toBe(true);
    
  });
  it('Should return a non empty JSON array', () => {
    expect(books.length > 1).toBe(true);
    
  });
  it('Should remove duplicates from array', () => {
    const duplicate = ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'];
    expect(Utils.unique(duplicate)).toEqual(['a', 'b', 'c', 'd', 'e']);
    
  });
  it('Should return a JSON array which contains objects only', () => {
    let answer = true;
    let count = 0;
    while(count < books.length){
      if(typeof books[count] != 'object' || Array.isArray(books[count])){
        answer = false;
      }
      count += 1;
    }
    expect(answer).toBe(true);
    
  });
  it('Should return a JSON array which has keys (title and text)', () => {
    let answer = true;
    let count = 0;
    while(count < books.length && answer){
      if(books[count].title === undefined || books[count].text === undefined){
        answer = false;
      }
      count += 1;
    }
    expect(answer).toBe(true);
    
  });
  // it('Should return a JSON array which has valid string entries for keys(title, text)', () => {
  //   let answer = true;
  //   let count = 0;
  //   while(count < books.length){
  //     if(typeof books[count].title != 'string' || typeof books[count].text != 'string'){
  //       answer = false;
  //     }
  //     count += 1;
  //   }
  //   expect(answer).toBe(true);
    
  // });
  // it('Should return the correct filename of the uploaded file', () => {
  //   let answer = Utils.formatFileName('src/jasmine/books.json');
  //   expect(answer).toEqual('books.json');
    
  // });
}); 

// describe('Populate Index', () => {
//   describe('On file upload', () => {
//     it('Should create the index once the JSON file has been read', () => {
//       expect(typeof index.reference['books.json']).toEqual('object');
      
//     });

//     it('Should create an accurate index object', () => {
//       expect(index.getIndex('books.json').alice[0]).toEqual(0);
//       expect(index.getIndex('books.json').lord[0]).toEqual(1);
//       expect(index.getIndex('books.json').a[1]).toEqual(1);
      
//     });
//     it('Should create an inverted index', () => {
//       let verdict = true;
//       const indexContent = index.reference['books.json'];

//       for (value in indexContent) {
//         if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
//           verdict = false;
//         }
//       }
//       expect(verdict).toEqual(true);
      
//     });
//     it('Should not overwrite the previously created index', () => {
//       const indexBefore = index.reference['books.json'];
//       const indexAfter = index.reference['tests.json'];
//       expect(typeof indexBefore == 'object' && typeof indexAfter == 'object').toBe(true);
      
//     });
//   });
// });

// describe('Search Index', () => {
//   describe('Search results', () => {
//     it('Should return the correct result for single word searches', () => {
//       expect(typeof index.searchIndex('Lord')).toEqual('object');
      
//     });
//     it('Should filter alphanumeric search queries', () => {
//       expect(index.searchIndex('ade **')).toEqual(10);
      
//     });

//     it('Should return correct search results for multiple word queries', () => {
//       expect(index.searchIndex('Lord of the rings')).toEqual(0);
      
//     });
//   });

  // it(' - The search should not take too long to execute', () => {
  //   const startTime = performance.now();
  //   index.searchIndex(['valid1.json'], index.createResultHtml, 'alice');
  //   const endTime = performance.now();
  //   expect(endTime - startTime < 5000).toBeTruthy();
  //   
  // });

  // it('should accept a varied number of argument', () => {
  //   let result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', 'lord town');
  //   expect(typeof result[0]).toEqual('object');
  //   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
  //   expect(typeof result[0]).toEqual('object');
  //   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice', 'in');
  //   expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
  //   
  // });

  // it('It should accept an array of argument', () => {
  //   const result = index.searchIndex(['valid1.json'], index.createResultHtml, ['alice', 'in']);
  //   expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
  //   
  // });


  // it('It should accept mix of array and words as argument', () => {
  //   result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
  //   expect(typeof result[0]).toEqual('object');
  //   
  // });

  // describe('Get Index', () => {
  //   it('should take the filename of the indexed JSON data', () => {
  //     expect(typeof index.getIndex('valid1.json')).toEqual('object');
  //   });
  // });
// });

