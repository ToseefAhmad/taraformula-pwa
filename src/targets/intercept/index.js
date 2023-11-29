/**
 * List of interceptors
 */
const interceptors = [
    require('./routes'),
    require('./social-login'),
    require('./shimmer'),
    require('./upward'),
    require('./payment-methods')
];

/**
 * Register new interceptors here
 * @param targets
 */
module.exports = targets => {
    interceptors.forEach(interceptor => {
        interceptor(targets);
    });
};
