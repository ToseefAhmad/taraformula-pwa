const https = require('https');

const fetch = require('node-fetch');

const graphQLQueries = require('../queries');

// To be used with `node-fetch` in order to allow self-signed certificates.
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const fetchQuery = query => {
    const targetURL = new URL('graphql', process.env.MAGENTO_BACKEND_URL);
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
    };

    if (process.env.STORE_VIEW_CODE) {
        headers['store'] = process.env.STORE_VIEW_CODE;
    }

    return fetch(targetURL.toString(), {
        agent: targetURL.protocol === 'https:' ? httpsAgent : null,
        body: JSON.stringify({ query }),
        headers: headers,
        method: 'POST'
    })
        .then(result => result.json())
        .catch(err => {
            console.error(err);
            throw err;
        })
        .then(json =>
            json && json.errors && json.errors.length > 0
                ? Promise.reject(new Error(json.errors[0].message + ` (... ${json.errors.length} errors total)`))
                : json.data
        );
};

/**
 * An async function that will fetch the availableStores
 *
 * @returns Promise
 */
const getAvailableStoresConfigData = () => {
    return fetchQuery(graphQLQueries.getAvailableStoresConfigData);
};

module.exports = {
    getAvailableStoresConfigData
};
