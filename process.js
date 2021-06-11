'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNodeTypeNameForTable = exports.createTableItemFactory = exports.FileNode = exports.TableNode = undefined;

var _gatsbyNodeHelpers = require('gatsby-node-helpers');

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createNodeHelpers = (0, _gatsbyNodeHelpers2.default)({
    typePrefix: 'Directus'
}),
    createNodeFactory = _createNodeHelpers.createNodeFactory;

var TABLE_NODE_TYPE = 'Table';
var FILE_NODE_TYPE = 'File';

/*
 *  Removes unnecessary fields from the response
 */
var sanitizeDirectusFields = function sanitizeDirectusFields(node) {
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
    delete node.columns;
    delete node.storage_adapter;
    delete node.thumbnail_url;
    delete node.old_thumbnail_url;
    return node;
};

var TableNode = exports.TableNode = createNodeFactory(TABLE_NODE_TYPE, function (node) {
    return sanitizeDirectusFields(node);
});

var FileNode = exports.FileNode = createNodeFactory(FILE_NODE_TYPE, function (node) {
    return sanitizeDirectusFields(node);
});

// A little wrapper for the createItemFactory to not have to import the gatsby-node-helpers in the main file
var createTableItemFactory = exports.createTableItemFactory = function createTableItemFactory(name, allFiles) {
    return createNodeFactory(name, function (node) {
        node = sanitizeDirectusFields(node);

        // For each property on each row, check if it's a "file" property. If it is, find the file object
        // from `gatsby-source-filesystem` and add the URL to the property's object
        Object.keys(node).forEach(function (key) {
            if (node[key] && node[key].meta && node[key].meta.type === 'item') {
                var _name = node[key].data && node[key].data.name;
                var file = allFiles.find(function (file) {
                    return file.directus.name === _name;
                });
                if (file) {
                    node[key].file___NODE = file.gatsby.id;
                }
            }
        });

        return node;
    });
};

// Transforms the table name into a Gatsby Node Type name
// All this does, is making the first letter uppercase and singularizing it if possible.
// Also, it checks if there's an exception to this name to use instead
var getNodeTypeNameForTable = exports.getNodeTypeNameForTable = function getNodeTypeNameForTable(name, exceptions) {

    // If there's an exception for this name, use it instead
    // Otherwise, generate a new one
    if (exceptions !== undefined && Object.keys(exceptions).length > 0 && exceptions[name] !== undefined) {
        return exceptions[name];
    }

    // If the name is plural, use the Pluralize plugin to try make it singular
    // This is to conform to the Gatsby convention of using singular names in their node types
    if (_pluralize2.default.isPlural(name)) {
        name = _pluralize2.default.singular(name);
    }

    // Make the first letter upperace as per Gatsby's convention
    name = name.charAt(0).toUpperCase() + name.slice(1);

    return name;
};