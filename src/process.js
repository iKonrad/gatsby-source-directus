import createNodeHelpers from 'gatsby-node-helpers'

const {
    createNodeFactory,
    generateTypeName,
    generateTypeId,
} = createNodeHelpers({
    typePrefix: `Directus`
})

const TABLE_NODE_TYPE = `Table`
const POST_NODE_TYPE = `Post`

export const TableNode = createNodeFactory(TABLE_NODE_TYPE, node => {
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

export const createTableItemFactory = (name) => {
    return createNodeFactory(name, node => {
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
    })
}