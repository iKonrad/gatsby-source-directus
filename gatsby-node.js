import Directus from 'directus-sdk-javascript';

let _url = '';
let _apiKey = '';
let _version = '1.1';

exports.sourceNodes = async ({ boundActionCreators }, {
    directusUrl,
    protocol,
    apiKey,
    version,
}) => {
    const { createNode } = boundActionCreators;

    protocol = protocol !== undefined && protocol !== '' ? protocol : 'http';
    protocol = protocol + "://";

    // Trim any trailing slashes from the URL
    directusUrl = directusUrl.replace(/\/$/, "");

    // Merge the URL with a protocol
    _url = protocol + directusUrl;

    // Assign the version
    _version = version !== undefined && version !== '' ? version : _version;

    // Initialize a Directus SDK client
    const directusClient = new Directus(_apiKey, _url, _version);

    client.getTables({}, (err, res) => {
        console.log('err', err);
        console.log('res', res);
    });


    // // Process data into nodes.
    // data.forEach(datum => createNode(processDatum(datum)));

    // We're done, return.
    return;
};