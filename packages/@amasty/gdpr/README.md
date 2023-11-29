# PWA GDPR

## Installation

1. Create an Empty PWA Studio Project by [Scaffolding](https://magento.github.io/pwa-studio/pwa-buildpack/scaffolding/)
2. `cd your_project/src` 
3. `mkdir @amasty` 
4.  copy module folder to `@amasty`
5.  run command from root directory
    - for development: `yarn add link:src/@amasty/gdpr` 
    - for production: `yarn add file:src/@amasty/gdpr`

6. Add call extend-intercept.js to local-intercept.js. Example:

```js
const amGdprIntercept = require('@amasty/gdpr/targets/extend-intercept');

function localIntercept(targets) {
  amGdprIntercept(targets);
}

module.exports = localIntercept;
```
 
