const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
  const targetables = Targetables.using(targets);

  // add gdpr context provider
  const ContextProvider = targetables.reactComponent(
    '@magento/venia-ui/lib/components/App/contextProvider.js'
  );
  const AmGdprContextProvider = ContextProvider.addImport(
    "AmGdprContextProvider from '@amasty/gdpr/src/context'"
  );

  ContextProvider.insertBeforeSource(
    'const ContextProvider = ({ children }) => {',
    `contextProviders.push(${AmGdprContextProvider});\n`
  );

  const CreateAccount = targetables.reactComponent(
    '@magento/venia-ui/lib/components/CreateAccount/createAccount.js'
  );

  const AmCheckbox = CreateAccount.addImport('AmCheckbox from "@amasty/gdpr"');

  CreateAccount.insertAfterJSX(
    'div className={classes.subscribe}',
    `<${AmCheckbox} location="registration" />`
  );

  const Card = targetables.reactComponent(
    '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethods.js'
  );

  const AmCheckboxCard = Card.addImport('AmCheckbox from "@amasty/gdpr"');

  Card.insertAfterJSX(
    'RadioGroup',
    `<${AmCheckboxCard} location="checkout" />`
  );

  const Footer = targetables.reactComponent(
    '@magento/venia-ui/lib/components/Footer/footer.js'
  );

  const PrivacyPolicy = Footer.addImport(
    '{ PrivacyPolicy } from "@amasty/gdpr"'
  );

  Footer.insertAfterJSX(
    'div className={classes.branding}',
    `<${PrivacyPolicy} />`
  );
};
