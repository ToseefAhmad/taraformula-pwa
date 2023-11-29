/**
 * Amasty gdpr extension
 */

const amGdprIntercept = require('@amasty/gdpr/targets/extend-intercept');

module.exports = targets => {
    amGdprIntercept(targets);
};
