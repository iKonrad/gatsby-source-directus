'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Directus = require('directus-sdk-javascript');

var _url = '';
var _apiKey = '';
var _version = '1.1';

exports.sourceNodes = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
        var boundActionCreators = _ref.boundActionCreators;
        var directusUrl = _ref2.directusUrl,
            protocol = _ref2.protocol,
            apiKey = _ref2.apiKey,
            version = _ref2.version;
        var createNode, directusClient;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        createNode = boundActionCreators.createNode;


                        protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
                        protocol = protocol + "://";

                        // Trim any trailing slashes from the URL
                        directusUrl = directusUrl.replace(/\/$/, "");

                        // Merge the URL with a protocol
                        _url = protocol + directusUrl;

                        // Assign the version
                        _version = version !== undefined && version !== '' ? version : _version;

                        // Initialize a Directus SDK client
                        directusClient = new Directus(_apiKey, _url, _version);


                        directusClient.getTables({}, function (err, res) {
                            console.log('err', err);
                            console.log('res', res);
                        });

                        // // Process data into nodes.
                        // data.forEach(datum => createNode(processDatum(datum)));

                        // We're done, return.
                        return _context.abrupt('return');

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref3.apply(this, arguments);
    };
}();