import Fetcher from './fetch';
import { TableNode, createTableItemFactory } from './process';

let _url = '';
let _apiKey = '';
let _version = '1.1';

exports.sourceNodes = async ({ boundActionCreators }, {
    url,
    protocol,
    apiKey,
    version,
}) => {
    const { createNode } = boundActionCreators;

    protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
    protocol = protocol + "://";

    // Trim any trailing slashes from the URL
    url = url.replace(/\/$/, "");

    // Assign the version
    _version = version !== undefined && version !== '' ? version : _version;

    // Merge the URL with a protocol
    _url = protocol + url + `/api/${ version }/`;

    // Assign the API key
    _apiKey = apiKey;

    // Initialize the Fetcher class with API key and URL
    const fetcher = new Fetcher(_apiKey, _url, _version);

    console.log('Fetching Directus tables data...');

    // Fetch all the tables with data from Directus in a raw format
    const allTablesData = await fetcher.getAllTablesData();

    let items = [];

    console.log(`Fetched ${allTablesData.length} tables from Directus.`)


    // Iterate through all table items
    await Promise.all(allTablesData.map(async (obj) => {
        const tableNode = TableNode(obj);
        createNode(tableNode);
        let tableItems = await fetcher.getAllItemsForTable(obj.name);

        console.log(`\n-> Fetched ${tableItems.length} items for '${ obj.name }' table...`)

        if (tableItems.length > 0) {
            // Get all the items for the table above and create a gatsby node for it
            await Promise.all(Object.keys(tableItems).map(async (itemKey) => {
                const tableItemData = tableItems[itemKey];

                let name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);

                // We're creating a separate Item Type for every table
                let ItemNode = createTableItemFactory(name);

                // Create a Table Item node based on the API response
                const tableItemNode = ItemNode(tableItemData, {
                    parent: tableNode.id,
                });

                // Pass it to Gatsby to create a node
                createNode(tableItemNode);
            }))
        }

    }));

    // // Process data into nodes.
    // data.forEach(datum => createNode(processDatum(datum)));

    // We're done, return.
    return;
};