'use strict';

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _process = require('./process');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _gatsbySourceFilesystem = require('gatsby-source-filesystem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _url = '';
var _apiKey = '';
var _version = '1.1';
var _requestParams = {
    depth: 1
};
var _fileRequestParams = {};
var _auth = {};

exports.sourceNodes = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
        var actions = _ref.actions,
            getNode = _ref.getNode,
            store = _ref.store,
            cache = _ref.cache,
            createNodeId = _ref.createNodeId;
        var url = _ref2.url,
            protocol = _ref2.protocol,
            apiKey = _ref2.apiKey,
            version = _ref2.version,
            nameExceptions = _ref2.nameExceptions,
            requestParams = _ref2.requestParams,
            fileRequestParams = _ref2.fileRequestParams,
            auth = _ref2.auth;

        var createNode, fetcher, allFilesData, filesDownloaded, allFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fileData, fileNode, localFileNode, allTablesData, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tableData, tableNode, tableItems, name, ItemNode, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, tableItemData, tableItemNode;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        createNode = actions.createNode;


                        protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
                        protocol = protocol + "://";

                        // Trim any trailing slashes from the URL
                        url = url.replace(/\/$/, "");

                        // Assign the version
                        _version = version !== undefined && version !== '' ? version : _version;

                        // Merge the URL with a protocol
                        _url = protocol + url + ('/api/' + _version + '/');

                        // Assign the API key
                        _apiKey = apiKey;

                        // Set request parameters
                        _requestParams = requestParams || _requestParams;

                        // Set parameters for file fetching
                        _fileRequestParams = fileRequestParams || _fileRequestParams;

                        // Set htaccess auth for file download
                        _auth = auth || _auth;

                        // Initialize the Fetcher class with API key and URL
                        fetcher = new _fetch2.default(_apiKey, _url, _version, _requestParams, _fileRequestParams);


                        console.log('gatsby-source-directus'.cyan, 'Fetching Directus files data...');

                        _context.next = 14;
                        return fetcher.getAllFiles();

                    case 14:
                        allFilesData = _context.sent;


                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', allFilesData.length.toString().yellow, 'files from Directus.');
                        console.log('gatsby-source-directus'.cyan, 'Downloading Directus files...');

                        filesDownloaded = 0, allFiles = [];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 21;
                        _iterator = allFilesData[Symbol.iterator]();

                    case 23:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 42;
                            break;
                        }

                        fileData = _step.value;
                        fileNode = (0, _process.FileNode)(fileData);
                        localFileNode = void 0;
                        _context.prev = 27;
                        _context.next = 30;
                        return (0, _gatsbySourceFilesystem.createRemoteFileNode)({
                            url: encodeURI('https:' + fileNode.url),
                            store: store,
                            cache: cache,
                            createNode: createNode,
                            createNodeId: createNodeId,
                            auth: _auth
                        });

                    case 30:
                        localFileNode = _context.sent;
                        _context.next = 36;
                        break;

                    case 33:
                        _context.prev = 33;
                        _context.t0 = _context['catch'](27);

                        console.error('\ngatsby-source-directus'.blue, 'error'.red, 'gatsby-source-directus: An error occurred while downloading the files.', _context.t0);

                    case 36:

                        if (localFileNode) {
                            filesDownloaded++;
                            fileNode.localFile___NODE = localFileNode.id;

                            // When `gatsby-source-filesystem` creates the file nodes, all reference
                            // to the original data source is wiped out. This object links the
                            // directus reference (that's used by other objects to reference files)
                            // to the gatsby reference (that's accessible in GraphQL queries). Then,
                            // when each table row is created (in ./process.js), if a file is on a row
                            // we find it in this array and put the Gatsby URL on the directus node.
                            //
                            // This is a hacky solution, but it does the trick for very basic raw file capture
                            // TODO see if we can implement gatsby-transformer-sharp style queries
                            allFiles.push({
                                directus: fileNode,
                                gatsby: localFileNode
                            });
                        }

                        _context.next = 39;
                        return createNode(fileNode);

                    case 39:
                        _iteratorNormalCompletion = true;
                        _context.next = 23;
                        break;

                    case 42:
                        _context.next = 48;
                        break;

                    case 44:
                        _context.prev = 44;
                        _context.t1 = _context['catch'](21);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                    case 48:
                        _context.prev = 48;
                        _context.prev = 49;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 51:
                        _context.prev = 51;

                        if (!_didIteratorError) {
                            _context.next = 54;
                            break;
                        }

                        throw _iteratorError;

                    case 54:
                        return _context.finish(51);

                    case 55:
                        return _context.finish(48);

                    case 56:

                        if (filesDownloaded === allFilesData.length) {
                            console.log('gatsby-source-directus'.blue, 'success'.green, 'Downloaded all', filesDownloaded.toString().yellow, 'files from Directus.');
                        } else {
                            console.log('gatsby-source-directus'.blue, 'warning'.yellow, 'skipped', (filesDownloaded - allFilesData.length).toString().yellow, 'files from downloading');
                        }

                        console.log('gatsby-source-directus'.cyan, 'Fetching Directus tables data...');

                        // Fetch all the tables with data from Directus in a raw format
                        _context.next = 60;
                        return fetcher.getAllTablesData();

                    case 60:
                        allTablesData = _context.sent;


                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', allTablesData.length.toString().yellow, 'tables from Directus.');

                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 65;
                        _iterator2 = allTablesData[Symbol.iterator]();

                    case 67:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 114;
                            break;
                        }

                        tableData = _step2.value;
                        tableNode = (0, _process.TableNode)(tableData);
                        _context.next = 72;
                        return createNode(tableNode);

                    case 72:
                        _context.next = 74;
                        return fetcher.getAllItemsForTable(tableData.name);

                    case 74:
                        tableItems = _context.sent;

                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', tableItems.length.toString().cyan, 'items for ', tableData.name.cyan, ' table...');

                        // Get the name for this node type
                        name = (0, _process.getNodeTypeNameForTable)(tableData.name, nameExceptions);

                        console.log('gatsby-source-directus'.blue, 'info'.cyan, 'Generating Directus' + name + ' node type...');

                        // We're creating a separate Item Type for every table
                        ItemNode = (0, _process.createTableItemFactory)(name, allFiles);

                        if (!(tableItems && tableItems.length > 0)) {
                            _context.next = 110;
                            break;
                        }

                        // Get all the items for the table above and create a gatsby node for it
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context.prev = 83;
                        _iterator3 = tableItems[Symbol.iterator]();

                    case 85:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context.next = 93;
                            break;
                        }

                        tableItemData = _step3.value;

                        // Create a Table Item node based on the API response
                        tableItemNode = ItemNode(tableItemData, {
                            parent: tableNode.id
                        });

                        // Pass it to Gatsby to create a node

                        _context.next = 90;
                        return createNode(tableItemNode);

                    case 90:
                        _iteratorNormalCompletion3 = true;
                        _context.next = 85;
                        break;

                    case 93:
                        _context.next = 99;
                        break;

                    case 95:
                        _context.prev = 95;
                        _context.t2 = _context['catch'](83);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context.t2;

                    case 99:
                        _context.prev = 99;
                        _context.prev = 100;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 102:
                        _context.prev = 102;

                        if (!_didIteratorError3) {
                            _context.next = 105;
                            break;
                        }

                        throw _iteratorError3;

                    case 105:
                        return _context.finish(102);

                    case 106:
                        return _context.finish(99);

                    case 107:
                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Directus' + name + ' node generated');
                        _context.next = 111;
                        break;

                    case 110:
                        console.log('gatsby-source-directus'.blue, 'warning'.yellow, tableData.name + ' table has no rows. Skipping...');

                    case 111:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 67;
                        break;

                    case 114:
                        _context.next = 120;
                        break;

                    case 116:
                        _context.prev = 116;
                        _context.t3 = _context['catch'](65);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t3;

                    case 120:
                        _context.prev = 120;
                        _context.prev = 121;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 123:
                        _context.prev = 123;

                        if (!_didIteratorError2) {
                            _context.next = 126;
                            break;
                        }

                        throw _iteratorError2;

                    case 126:
                        return _context.finish(123);

                    case 127:
                        return _context.finish(120);

                    case 128:

                        console.log("AFTER");

                    case 129:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[21, 44, 48, 56], [27, 33], [49,, 51, 55], [65, 116, 120, 128], [83, 95, 99, 107], [100,, 102, 106], [121,, 123, 127]]);
    }));

    return function (_x, _x2) {
        return _ref3.apply(this, arguments);
    };
}();