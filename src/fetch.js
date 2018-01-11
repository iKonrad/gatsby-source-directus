import { RemoteInstance as Directus } from 'directus-sdk-javascript';
import Colors from 'colors';

export default class DirectusFetcher {
    constructor(apiKey, url, version) {
        this.apiKey = apiKey;
        this.url = url;
        this.version = version;
        // Initialize client
        this.client = new Directus({
            url: this.url,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            }
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

    async getAllItemsForTable(name) {
        const records = await this.client.getItems(name);
        return records.data;
    }
}