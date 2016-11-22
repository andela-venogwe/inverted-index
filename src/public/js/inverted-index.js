'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function () {
    function Index() {
        _classCallCheck(this, Index);
    }

    _createClass(Index, [{
        key: 'createIndex',
        value: function createIndex(file) {
            //get unique array values
            Array.prototype.contains = function (v) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === v) return true;
                }
                return false;
            };

            Array.prototype.unique = function () {
                var arr = [];
                for (var i = 0; i < this.length; i++) {
                    if (!arr.contains(this[i])) {
                        arr.push(this[i]);
                    }
                }
                return arr;
            };
            this.file = file;
            count++;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.file[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    this.ind += i.title + ' ' + i.text;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.index = 'Doc_' + count + ' ' + this.ind;
            return this.index.toLowerCase().match(/\w+/g).unique();
        }
    }]);

    return Index;
}();