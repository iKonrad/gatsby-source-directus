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

        var createNode, fetcher, allTablesData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tableData, tableNode, tableItems, name, ItemNode, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tableItemData, tableItemNode;

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

                        /*
                        console.log(`gatsby-source-directus`.cyan, 'Fetching Directus files data...');
                         const allFilesData = await fetcher.getAllFiles();
                         console.log(`gatsby-source-directus`.blue, 'success'.green, `Fetched`, allFilesData.length.toString().yellow, `files from Directus.`);
                        console.log(`gatsby-source-directus`.cyan, 'Downloading Directus files...');
                         let filesDownloaded = 0,
                            allFiles = [];
                         for (let fileData of allFilesData) {
                            const fileNode = FileNode(fileData);
                            let localFileNode
                             try {
                                localFileNode = await createRemoteFileNode({
                                url: encodeURI(`https:${fileNode.url}`),
                                store,
                                cache,
                                createNode,
                                createNodeId,
                                auth: _auth,
                                })
                            } catch (e) {
                                console.error(`\ngatsby-source-directus`.blue, 'error'.red, `gatsby-source-directus: An error occurred while downloading the files.`, e);
                            }
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
                             await createNode(fileNode);
                        }
                         if (filesDownloaded === allFilesData.length) {
                            console.log(`gatsby-source-directus`.blue, 'success'.green, `Downloaded all`, filesDownloaded.toString().yellow, `files from Directus.`);
                        } else {
                            console.log(`gatsby-source-directus`.blue, `warning`.yellow, `skipped`, (filesDownloaded - allFilesData.length).toString().yellow, 'files from downloading');
                        }
                         */

                        console.log('gatsby-source-directus'.cyan, 'Fetching Directus tables data...');

                        // Fetch all the tables with data from Directus in a raw format
                        _context.next = 14;
                        return fetcher.getAllTablesData();

                    case 14:
                        allTablesData = _context.sent;


                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', allTablesData.length.toString().yellow, 'tables from Directus.');

                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 19;
                        _iterator = allTablesData[Symbol.iterator]();

                    case 21:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 68;
                            break;
                        }

                        tableData = _step.value;
                        tableNode = (0, _process.TableNode)(tableData);
                        _context.next = 26;
                        return createNode(tableNode);

                    case 26:
                        _context.next = 28;
                        return fetcher.getAllItemsForTable(tableData.name);

                    case 28:
                        tableItems = _context.sent;

                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Fetched', tableItems.length.toString().cyan, 'items for ', tableData.name.cyan, ' table...');

                        // Get the name for this node type
                        name = (0, _process.getNodeTypeNameForTable)(tableData.name, nameExceptions);

                        console.log('gatsby-source-directus'.blue, 'info'.cyan, 'Generating Directus' + name + ' node type...');

                        // We're creating a separate Item Type for every table
                        ItemNode = (0, _process.createTableItemFactory)(name, allFiles);

                        if (!(tableItems && tableItems.length > 0)) {
                            _context.next = 64;
                            break;
                        }

                        // Get all the items for the table above and create a gatsby node for it
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 37;
                        _iterator2 = tableItems[Symbol.iterator]();

                    case 39:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 47;
                            break;
                        }

                        tableItemData = _step2.value;

                        // Create a Table Item node based on the API response
                        tableItemNode = ItemNode(tableItemData, {
                            parent: tableNode.id
                        });

                        // Pass it to Gatsby to create a node

                        _context.next = 44;
                        return createNode(tableItemNode);

                    case 44:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 39;
                        break;

                    case 47:
                        _context.next = 53;
                        break;

                    case 49:
                        _context.prev = 49;
                        _context.t0 = _context['catch'](37);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t0;

                    case 53:
                        _context.prev = 53;
                        _context.prev = 54;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 56:
                        _context.prev = 56;

                        if (!_didIteratorError2) {
                            _context.next = 59;
                            break;
                        }

                        throw _iteratorError2;

                    case 59:
                        return _context.finish(56);

                    case 60:
                        return _context.finish(53);

                    case 61:
                        console.log('gatsby-source-directus'.blue, 'success'.green, 'Directus' + name + ' node generated');
                        _context.next = 65;
                        break;

                    case 64:
                        console.log('gatsby-source-directus'.blue, 'warning'.yellow, tableData.name + ' table has no rows. Skipping...');

                    case 65:
                        _iteratorNormalCompletion = true;
                        _context.next = 21;
                        break;

                    case 68:
                        _context.next = 74;
                        break;

                    case 70:
                        _context.prev = 70;
                        _context.t1 = _context['catch'](19);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                    case 74:
                        _context.prev = 74;
                        _context.prev = 75;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 77:
                        _context.prev = 77;

                        if (!_didIteratorError) {
                            _context.next = 80;
                            break;
                        }

                        throw _iteratorError;

                    case 80:
                        return _context.finish(77);

                    case 81:
                        return _context.finish(74);

                    case 82:

                        console.log("AFTER");

                    case 83:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[19, 70, 74, 82], [37, 49, 53, 61], [54,, 56, 60], [75,, 77, 81]]);
    }));

    return function (_x, _x2) {
        return _ref3.apply(this, arguments);
    };
}();