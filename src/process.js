import createNodeHelpers from 'gatsby-node-helpers'
import Pluralize from 'pluralize';

const {
    createNodeFactory
} = createNodeHelpers({
    typePrefix: `Directus`
})

const TABLE_NODE_TYPE = `Table`
const FILE_NODE_TYPE = `File`

/*
 *  Removes unnecessary fields from the response
 */
const sanitizeDirectusFields = (node) => {
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
}

export const TableNode = createNodeFactory(TABLE_NODE_TYPE, node => {
    return sanitizeDirectusFields(node);
});

export const FileNode = createNodeFactory(FILE_NODE_TYPE, node => {
    return sanitizeDirectusFields(node);
});

// A little wrapper for the createItemFactory to not have to import the gatsby-node-helpers in the main file
export const createTableItemFactory = (name, allFiles) => {
    return createNodeFactory(name, node => {
        node = sanitizeDirectusFields(node);

        // For each property on each row, check if it's a "file" property. If it is, find the file object
        // from `gatsby-source-filesystem` and add the URL to the property's object
        Object.keys(node).forEach(key => {
            if (node[key] && node[key].meta && node[key].meta.type === 'item') {
                const name = node[key].data && node[key].data.name
                const file = allFiles.find(file => file.directus.name === name)
                if (file) {
                    node[key].file___NODE = file.gatsby.id
                }
            }
        })

        return node
    })
}

// Transforms the table name into a Gatsby Node Type name
// All this does, is making the first letter uppercase and singularizing it if possible.
// Also, it checks if there's an exception to this name to use instead
export const getNodeTypeNameForTable = (name, exceptions) => {

    // If there's an exception for this name, use it instead
    // Otherwise, generate a new one
    if (exceptions !== undefined && Object.keys(exceptions).length > 0 && exceptions[name] !== undefined) {
        return exceptions[name];
    }

    // If the name is plural, use the Pluralize plugin to try make it singular
    // This is to conform to the Gatsby convention of using singular names in their node types
    if (Pluralize.isPlural(name)) {
        name = Pluralize.singular(name);
    }

    // Make the first letter upperace as per Gatsby's convention
    name = name.charAt(0).toUpperCase() + name.slice(1);

    return name;
}
