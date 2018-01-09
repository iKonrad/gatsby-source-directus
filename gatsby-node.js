'use strict';

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _process = require('./process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _url = '';
var _apiKey = '';
var _version = '1.1';

exports.sourceNodes = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref, _ref2) {
        var boundActionCreators = _ref.boundActionCreators;
        var directusUrl = _ref2.directusUrl,
            protocol = _ref2.protocol,
            apiKey = _ref2.apiKey,
            version = _ref2.version,
            auth = _ref2.auth;
        var createNode, fetcher, allTablesData, items;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        createNode = boundActionCreators.createNode;


                        protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
                        protocol = protocol + "://";

                        // Trim any trailing slashes from the URL
                        directusUrl = directusUrl.replace(/\/$/, "");

                        // Assign the version
                        _version = version !== undefined && version !== '' ? version : _version;

                        // Merge the URL with a protocol
                        _url = protocol + directusUrl + ('/api/' + version + '/');

                        // Assign the API key
                        _apiKey = apiKey;

                        // Initialize the Fetcher class with API key and URL
                        fetcher = new _fetch2.default(_apiKey, _url, _version);


                        console.log('Fetching Directus tables data...');

                        // Fetch all the tables with data from Directus in a raw format
                        _context3.next = 11;
                        return fetcher.getAllTablesData();

                    case 11:
                        allTablesData = _context3.sent;
                        items = [];


                        console.log('Fetched ' + allTablesData.length + ' tables from Directus.');

                        // Iterate through all table items
                        _context3.next = 16;
                        return Promise.all(allTablesData.map(function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(obj) {
                                var tableNode, tableItems;
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                tableNode = (0, _process.TableNode)(obj);

                                                createNode(tableNode);
                                                _context2.next = 4;
                                                return fetcher.getAllItemsForTable(obj.name);

                                            case 4:
                                                tableItems = _context2.sent;


                                                console.log('\n-> Fetched ' + tableItems.length + ' items for \'' + obj.name + '\' table...');

                                                if (!(tableItems.length > 0)) {
                                                    _context2.next = 9;
                                                    break;
                                                }

                                                _context2.next = 9;
                                                return Promise.all(Object.keys(tableItems).map(function () {
                                                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(itemKey) {
                                                        var tableItemData, name, ItemNode, tableItemNode;
                                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                            while (1) {
                                                                switch (_context.prev = _context.next) {
                                                                    case 0:
                                                                        tableItemData = tableItems[itemKey];
                                                                        name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);

                                                                        // We're creating a separate Item Type for every table

                                                                        ItemNode = (0, _process.createTableItemFactory)(name);

                                                                        // Create a Table Item node based on the API response

                                                                        tableItemNode = ItemNode(tableItemData, {
                                                                            parent: tableNode.id
                                                                        });

                                                                        // Pass it to Gatsby to create a node

                                                                        createNode(tableItemNode);

                                                                    case 5:
                                                                    case 'end':
                                                                        return _context.stop();
                                                                }
                                                            }
                                                        }, _callee, undefined);
                                                    }));

                                                    return function (_x4) {
                                                        return _ref5.apply(this, arguments);
                                                    };
                                                }()));

                                            case 9:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, undefined);
                            }));

                            return function (_x3) {
                                return _ref4.apply(this, arguments);
                            };
                        }()));

                    case 16:
                        return _context3.abrupt('return');

                    case 17:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x, _x2) {
        return _ref3.apply(this, arguments);
    };
}();