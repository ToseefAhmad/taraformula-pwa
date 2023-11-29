https://magento.github.io/pwa-studio/technologies/basic-concepts/internationalization/

All translation files can be found in /var/www/monumentmetalspwa-storefront/i18n as json files. Based on the STORE*
VIEW_CODE, the appropriate file will be applied. Instead of the standard ISO language tag the filename format follows
Magento’s convention for specifying locale: <language id in lowercase>*<country id in uppercase>.json. For example:
en_US.json, en_GB.json, fr_FR.json.

All translation files contain the same keys and should contain translated key values.

Key naming convention is:

- componentName.functionalityName (key example: signIn.loading)

If it is possible use global.functionalityName (for words like cancel, submit, password, free etc).

If you need to add a new key, add it to all files. If duplicate values are possible
(like productListing components in multiple parent components), use parentChild naming (cartPageProductListing.loading)

Files are sorted alphabetically, use this to sort - https://novicelab.org/jsonabc/
