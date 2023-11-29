const amSocialLoginIntercept = require('@amasty/social-login/targets/extend-intercept');

module.exports = function localIntercept(targets) {
    amSocialLoginIntercept(targets);
};
