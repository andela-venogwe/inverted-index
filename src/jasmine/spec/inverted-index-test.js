'use strict';

const InvertedIndex = require('../../js/Inverted-index.js');

const Utils = require('../../js/Inverted-Index-Utility.js');

const index = new InvertedIndex(Utils);

index.createIndex('./src/public/uploads/books.json')
.then(() => {
  const fileContents = index.currentFile;
  describe('Read book data', () => {
    it('Should return a valid JSON array', () => {
      expect(Array.isArray(fileContents)).toBe(true);
      
    });
    it('Should return a non empty JSON array', () => {
      expect(fileContents.length > 1).toBe(true);
      
    });
    it('Should remove duplicates from array', () => {
      const duplicate = ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e'];
      expect(index.utility.unique(duplicate)).toEqual(['a', 'b', 'c', 'd', 'e']);
      
    });
    it('Should return a JSON array which contains objects only', () => {
      let answer = true;
      let count = 0;
      while(count < fileContents.length){
        if(typeof fileContents[count] != 'object' || Array.isArray(fileContents[count])){
          answer = false;
        }
        count += 1;
      }
      expect(answer).toBe(true);
      
    });
    it('Should return a JSON array which has keys (title and text)', () => {
      let answer = true;
      let count = 0;
      while(count < fileContents.length && answer){
        if(fileContents[count].title === undefined || fileContents[count].text === undefined){
          answer = false;
        }
        count += 1;
      }
      expect(answer).toBe(true);
      
    });
    it('Should return a JSON array which has valid string entries for keys(title, text)', () => {
      let answer = true;
      let count = 0;
      while(count < fileContents.length){
        if(typeof fileContents[count].title != 'string' || typeof fileContents[count].text != 'string'){
          answer = false;
        }
        count += 1;
      }
      expect(answer).toBe(true);
      
    });
    it('Should return the correct filename of the uploaded file', () => {
      let answer = index.utility.formatFileName('src/jasmine/books.json');
      expect(answer).toEqual('books.json');
      
    });
  }); 

  describe('Populate Index', () => {
    describe('On file upload', () => {
      it('Should create the index once the JSON file has been read', () => {
        expect(typeof index.reference['books.json']).toEqual('object');
        
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

      index.createIndex('./src/public/uploads/tests.json').then(() => {
        it('Should not overwrite the previously created index', () => {
          const indexBefore = index.reference['books.json'];
          const indexAfter = index.reference['tests.json'];
          expect(typeof indexBefore == 'object' && typeof indexAfter == 'object').toBe(true);
        });

        describe('Search Index', () => {
          describe('Search results', () => {
            it('Should return the correct result for single word searches', () => {
              expect(typeof index.searchIndex('Lord', ['books.json'])).toEqual('object');
              
            });
            it('Should filter non word search queries', () => {
              const theSearch = Object.keys(index
                .searchIndex('alliance ** && $$$', 
                  ['books.json'])['books.json']);

              expect(theSearch).toEqual(['alliance']);
              
            });

            it('Should return correct search results for multiple word queries', () => {
              expect(index.searchIndex('lord of the rings', 
                ['books.json'])['books.json']).toEqual({
                lord: [1],
                of: [0,1],
                the: [1],
                rings: [1]
              });
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
              of: [0,1],
              the: [1],
              rings: [1]
            }).sort());
          });

          it('It should accept an array of argument', () => {
            const result = index.searchIndex(['lord', 'of', 'the', 'rings'], 
              ['books.json'])['books.json'];
            expect(result).toEqual({
              lord: [1],
              of: [0,1],
              the: [1],
              rings: [1]
            });
          });

          describe('Get Index', () => {
            it('Should take the file url of the JSON file as an argument', () => {
              expect(index.getIndex('/src/public/uploads/books.json').a[1])
              .toEqual(1);
            });
          });
        });
      });
    });
  });
});