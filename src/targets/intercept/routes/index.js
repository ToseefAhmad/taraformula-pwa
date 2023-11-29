/**
 * Map new routes for the project
 */
const { Targetables } = require('@magento/pwa-buildpack');

const makeRoutesTarget = require('./makeRoutesTarget');

module.exports = targets => {
    const monument = Targetables.using(targets);
    makeRoutesTarget(monument);
};
