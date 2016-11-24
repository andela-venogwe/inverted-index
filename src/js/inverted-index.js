'use strict';

class invertedIndex{
    constructor(){
      this.index = '';
    }
    createIndex(file){
        //get unique array values
        Array.prototype.contains = function(v) {
            for(var i = 0; i < this.length; i++) {
                if(this[i] === v) return true;
            }
            return false;
        };
        //get unique array values
        Array.prototype.unique = function() {
            var arr = [];
            for(var i = 0; i < this.length; i++) {
                if(!arr.contains(this[i])) {
                    arr.push(this[i]);
                }
            }
            return arr; 
        };

        // loop through file and check
        file.forEach((position) => {
          this.index += position.title + ' ' + position.text;
        });
        
        this.tokens = this.index
        .toLowerCase()
        .match(/\w+/g)
        .unique()
        .sort();
        
        this.tokens.forEach((token) => {
            ref['token'] !== undefined ? (ref[file.name].push(token)) : (ref[file.name] = [token]);
        });
    }
}