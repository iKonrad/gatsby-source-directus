import 'babel-polyfill';
import { RemoteInstance as Directus } from 'directus-sdk-javascript';
import Colors from 'colors';

export default class DirectusFetcher {
    constructor(apiKey, url, version, requestParams, fileRequestParams) {
        this.apiKey = apiKey;
        this.url = url;
        this.version = version;
        this.requestParams = requestParams;
        this.fileRequestParams = fileRequestParams;
        // Initialize client
        this.client = new Directus({
            url: this.url,
            accessToken: this.apiKey
        });
    }

    async getAllTablesData() {
        // Get all the tables available from Directus
        let tablesData = await this.client.getTables({});

        // Iterate through the tables and pull the data for each
        if (tablesData.data === undefined) {
            console.error(`\ngatsby-source-directus`.blue, 'error'.red, `gatsby-source-directus: An error occurred while fetching the table list.`, tablesData);
            return;
        }

        let data = [];

        // Get details for all the tables
        await Promise.all(tablesData.data.map(async (obj) => {
            const tableData = await this.client.getTable(obj.name);
            data.push(tableData.data);
        }));

        return data;
    }

    async getAllFiles() {
        //Get all files from Directus
        const filesData = await this.client.getFiles(this.fileRequestParams);

        if (filesData.data === undefined) {
            console.error(`\ngatsby-source-directus`.blue, 'error'.red, `gatsby-source-directus: An error occurred while fetching the files.`, filesData);
            return;
        }

        return filesData.data;
    }

    async getAllItemsForTable(name) {
        const records = await this.client.getItems(name, this.requestParams);
        return records.data;
    }
}
