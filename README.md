[![Build Status](https://travis-ci.org/andela-venogwe/inverted-index.svg?branch=develop)](https://travis-ci.org/andela-venogwe/inverted-index) [![Coverage Status](https://coveralls.io/repos/github/andela-venogwe/inverted-index/badge.svg?branch=develop)](https://coveralls.io/github/andela-venogwe/inverted-index?branch=develop)

# inverted-index
Inverted index takes a JSON array of text objects and creates an index from the array. The index allows a user to search for text blocks in the array that contain a specified collection of words.

## JSON Array format
```
[
    {
        "title": "This is a sample title",
        "text": "And this is a sample text"
    }
]

```

## Features
- Create indexes from uploaded file.
- Find the indexes for a particular file.
- Full text search of created indexes.
- Allows single/multiple JSON files upload
- Full indexing of words
- Cross-file text/words search

## Technologies
- Node.js
- EcmaScript 6 (JavaScript 2015)
- Express 4.2.6
- Jade

## Local Development
- Install npm dependencies `npm install`
- Start a local server `npm start`
- To test the app run: `npm test`

## Web Deployment
- https://v-inverted-index.herokuapp.com
- [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-venogwe/inverted-index/tree/refactor)

## Contributing
1. Fork this repositry to your account.
1. Clone your repositry: `git clone git@github.com:your-username/inverted-index.git`
1. Create your feature branch: `git checkout -b new-feature`
1. Commit your changes: `git commit -m "did something"`
1. Push to the remote branch: `git push origin new-feature`
1. Open a pull request.

### More
- [Inverted Index - Wikipedia](https://en.wikipedia.org/wiki/Inverted_index)
- [Inverted Index](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html)
