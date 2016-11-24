'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var invertedIndex = function () {
    function invertedIndex() {
        _classCallCheck(this, invertedIndex);

        this.index = '';
    }

    _createClass(invertedIndex, [{
        key: 'createIndex',
        value: function createIndex(file) {
            var _this = this;

            //get unique array values
            Array.prototype.contains = function (v) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === v) return true;
                }
                return false;
            };
            //get unique array values
            Array.prototype.unique = function () {
                var arr = [];
                for (var i = 0; i < this.length; i++) {
                    if (!arr.contains(this[i])) {
                        arr.push(this[i]);
                    }
                }
                return arr;
            };

            // loop through file and check
            file.forEach(function (position) {
                _this.index += position.title + ' ' + position.text;
            });

            this.tokens = this.index.toLowerCase().match(/\w+/g).unique().sort();

            this.tokens.forEach(function (token) {
                ref['token'] !== undefined ? ref[file.name].push(token) : ref[file.name] = [token];
            });
        }
    }]);

    return invertedIndex;
}();