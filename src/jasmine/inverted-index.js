'use strict';

class Index{
  
  createIndex(file){
    //get unique array values
    Array.prototype.contains = function(v) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === v) return true;
        }
        return false;
    };
    
    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    };
    this.file = file;
    count++;
    for(let i of this.file){
      this.ind += i.title + ' ' + i.text;
    }
    this.index = 'Doc_' + count + ' ' + this.ind;
    return this.index.toLowerCase().match(/\w+/g).unique();
  }
}

module.exports = Index;