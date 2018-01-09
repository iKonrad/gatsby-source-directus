'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createTableItemFactory = exports.TableNode = undefined;

var _gatsbyNodeHelpers = require('gatsby-node-helpers');

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createNodeHelpers = (0, _gatsbyNodeHelpers2.default)({
    typePrefix: 'Directus'
}),
    createNodeFactory = _createNodeHelpers.createNodeFactory,
    generateTypeName = _createNodeHelpers.generateTypeName,
    generateTypeId = _createNodeHelpers.generateTypeId;

var TABLE_NODE_TYPE = 'Table';
var POST_NODE_TYPE = 'Post';

var TableNode = exports.TableNode = createNodeFactory(TABLE_NODE_TYPE, function (node) {
    // Remove any unnecessary data
    delete node.schema;
    delete node.sort_column;
    delete node.status_column;
    delete node.status_mapping;
    delete node.user_create_column;
    delete node.user_update_column;
    delete node.date_create_column;
    delete node.date_update_column;
    delete node.comment;
    delete node.footer;
    delete node.column_groupings;
    delete node.preview_url;
    delete node.display_template;
    delete node.filter_column_blacklist;
    delete node.preferences;
    return node;
});

var createTableItemFactory = exports.createTableItemFactory = function createTableItemFactory(name) {
    return createNodeFactory(name, function (node) {
        // Remove any unnecessary data
        delete node.schema;
        delete node.sort_column;
        delete node.status_column;
        delete node.status_mapping;
        delete node.user_create_column;
        delete node.user_update_column;
        delete node.date_create_column;
        delete node.date_update_column;
        delete node.comment;
        delete node.footer;
        delete node.column_groupings;
        delete node.preview_url;
        delete node.display_template;
        delete node.filter_column_blacklist;
        delete node.preferences;
        return node;
    });
};