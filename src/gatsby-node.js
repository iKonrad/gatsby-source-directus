import Fetcher from './fetch';
import { TableNode, FileNode, createTableItemFactory, getNodeTypeNameForTable } from './process';
import Colors from 'colors';
import fs from 'fs-extra'
import path from 'path'
import { createRemoteFileNode } from 'gatsby-source-filesystem'
import { GraphQLString } from 'gatsby/graphql'

let _url = '';
let _apiKey = '';
let _version = '1.1';
let _requestParams = {
    depth: 1,
}
let _fileRequestParams = {}
let _auth = {}

exports.sourceNodes = async ({ boundActionCreators, getNode, store, cache, createNodeId }, {
    url,
    protocol,
    apiKey,
    version,
    nameExceptions,
    requestParams,
    fileRequestParams,
    auth,
}) => {
    const { createNode } = boundActionCreators;

    protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
    protocol = protocol + "://";

    // Trim any trailing slashes from the URL
    url = url.replace(/\/$/, "");

    // Assign the version
    _version = version !== undefined && version !== '' ? version : _version;

    // Merge the URL with a protocol
    _url = protocol + url + `/api/${ _version }/`;

    // Assign the API key
    _apiKey = apiKey;

    // Set request parameters
    _requestParams = requestParams || _requestParams;

    // Set parameters for file fetching
    _fileRequestParams = fileRequestParams || _fileRequestParams

    // Set htaccess auth for file download
    _auth = auth || _auth

    // Initialize the Fetcher class with API key and URL
    const fetcher = new Fetcher(_apiKey, _url, _version, _requestParams, _fileRequestParams);

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
            url: protocol + url + fileNode.url,
            store,
            cache,
            createNode,
            createNodeId,
            auth: _auth,
            })

            // Move file to semantic name, within hash folder
            let semanticName = (fileNode.title || localFileNode.name).replace(/[^a-z0-9]/gi, '_')
            let newAbsolutePath = path.join(localFileNode.dir, semanticName + localFileNode.ext)
            await fs.move(localFileNode.absolutePath, newAbsolutePath, {
                overwrite: true
            })

            // Rewrite the gatsby-source-filesystem "File" node to reflect the new path
            localFileNode.absolutePath = newAbsolutePath
            localFileNode.base = semanticName + localFileNode.ext
            localFileNode.name = semanticName
            localFileNode.relativeDirectory = path.relative(process.cwd(), localFileNode.dir)
            localFileNode.relativePath = path.join(localFileNode.relativeDirectory, localFileNode.base)
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

    console.log(`gatsby-source-directus`.cyan, 'Fetching Directus tables data...');

    // Fetch all the tables with data from Directus in a raw format
    const allTablesData = await fetcher.getAllTablesData();

    console.log(`gatsby-source-directus`.blue, 'success'.green, `Fetched`, allTablesData.length.toString().yellow, `tables from Directus.`)

    for (let tableData of allTablesData) {
        const tableNode = TableNode(tableData);
        await createNode(tableNode);
        let tableItems = await fetcher.getAllItemsForTable(tableData.name);
        console.log(`gatsby-source-directus`.blue, 'success'.green, `Fetched`, tableItems.length.toString().cyan, `items for `, tableData.name.cyan, ` table...`)

        // Get the name for this node type
        let name = getNodeTypeNameForTable(tableData.name, nameExceptions);
        console.log(`gatsby-source-directus`.blue,  'info'.cyan, `Generating Directus${name} node type...`);

        // We're creating a separate Item Type for every table
        let ItemNode = createTableItemFactory(name, allFiles);

        if (tableItems && tableItems.length > 0) {
            // Get all the items for the table above and create a gatsby node for it
            for (let tableItemData of tableItems) {
                // Create a Table Item node based on the API response
                const tableItemNode = ItemNode(tableItemData, {
                    parent: tableNode.id,
                });

                // Pass it to Gatsby to create a node
                await createNode(tableItemNode);
            }
            console.log(`gatsby-source-directus`.blue, `success`.green, `Directus${name} node generated`);
        } else {
            console.log(`gatsby-source-directus`.blue, `warning`.yellow, `${tableData.name} table has no rows. Skipping...`);
        }
    }

    console.log("AFTER");
};

// This is mostly copied from `gatsby-source-filesystem. However, it removes the hash from the filename,
// since it's guaranteed that the file is alone in its directory with gatsby-source-filesystem v2.0.12
exports.setFieldsOnGraphQLNodeType = ({
    type,
    getNodeAndSavePathDependency,
    pathPrefix = ``
  }) => {
    if (type.name !== `File`) {
      return {};
    }

    return {
      publicURL: {
        type: GraphQLString,
        args: {},
        description: `Copy file to static directory and return public url to it`,
        resolve: (file, fieldArgs, context) => {
          const details = getNodeAndSavePathDependency(file.id, context.path);
          const fileName = `${file.name}${details.ext}`;
          const publicPath = path.join(process.cwd(), `public`, `static`, file.internal.contentDigest, fileName);

          if (!fs.existsSync(publicPath)) {
            fs.copy(details.absolutePath, publicPath, err => {
              if (err) {
                console.error(`error copying file from ${details.absolutePath} to ${publicPath}`, err);
              }
            });
          }

          return `${pathPrefix}/static/${file.internal.contentDigest}/${fileName}`;
        }
      }
    };
  };
