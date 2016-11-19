class InvertedIndex{
  createIndex(file){
    this.file = file;
    count++; 
    for(let i of this.file){
      this.ind += i.title + ' ' + i.text;
    }
    this.index = 'Doc_' + count + ' ' + this.ind;
    return this.index.toLowerCase().match(/\w+/g).unique();
  }
}