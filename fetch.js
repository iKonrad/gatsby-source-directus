'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _directusSdkJavascript = require('directus-sdk-javascript');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DirectusFetcher = function () {
    function DirectusFetcher(apiKey, url, version, requestParams, fileRequestParams) {
        _classCallCheck(this, DirectusFetcher);

        this.apiKey = apiKey;
        this.url = url;
        this.version = version;
        this.requestParams = requestParams;
        this.fileRequestParams = fileRequestParams;
        // Initialize client
        this.client = new _directusSdkJavascript.RemoteInstance({
            url: this.url,
            accessToken: this.apiKey
        });
    }

    _createClass(DirectusFetcher, [{
        key: 'getAllTablesData',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _this = this;

                var tablesData, data;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.client.getTables({});

                            case 2:
                                tablesData = _context2.sent;

                                if (!(tablesData.data === undefined)) {
                                    _context2.next = 6;
                                    break;
                                }

                                console.error('\ngatsby-source-directus'.blue, 'error'.red, 'gatsby-source-directus: An error occurred while fetching the table list.', tablesData);
                                return _context2.abrupt('return');

                            case 6:
                                data = [];

                                // Get details for all the tables

                                _context2.next = 9;
                                return Promise.all(tablesData.data.map(function () {
                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(obj) {
                                        var tableData;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this.client.getTable(obj.name);

                                                    case 2:
                                                        tableData = _context.sent;

                                                        data.push(tableData.data);

                                                    case 4:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function (_x) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }()));

                            case 9:
                                return _context2.abrupt('return', data);

                            case 10:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getAllTablesData() {
                return _ref.apply(this, arguments);
            }

            return getAllTablesData;
        }()
    }, {
        key: 'getAllFiles',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var filesData;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.client.getFiles(this.fileRequestParams);

                            case 2:
                                filesData = _context3.sent;

                                if (!(filesData.data === undefined)) {
                                    _context3.next = 6;
                                    break;
                                }

                                console.error('\ngatsby-source-directus'.blue, 'error'.red, 'gatsby-source-directus: An error occurred while fetching the files.', filesData);
                                return _context3.abrupt('return');

                            case 6:
                                return _context3.abrupt('return', filesData.data);

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getAllFiles() {
                return _ref3.apply(this, arguments);
            }

            return getAllFiles;
        }()
    }, {
        key: 'getAllItemsForTable',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(name) {
                var records;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.client.getItems(name, this.requestParams);

                            case 2:
                                records = _context4.sent;
                                return _context4.abrupt('return', records.data);

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getAllItemsForTable(_x2) {
                return _ref4.apply(this, arguments);
            }

            return getAllItemsForTable;
        }()
    }]);

    return DirectusFetcher;
}();

exports.default = DirectusFetcher;