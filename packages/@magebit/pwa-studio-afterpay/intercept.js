const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');
    specialFeatures.tap(flags => {
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    const {
        checkoutPagePaymentTypes,
        editablePaymentTypes,
        summaryPagePaymentTypes
    } = targets.of('@magento/venia-ui');

    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'afterpay',
            importPath:
                '@magebit/pwa-studio-afterpay/src/components/afterpay.js'
        })
    );

    editablePaymentTypes.tap(editablePaymentTypes => {
        editablePaymentTypes.add({
            paymentCode: 'afterpay',
            importPath:
                '@magebit/pwa-studio-afterpay/src/components/edit.js'
        });
    });

    summaryPagePaymentTypes.tap(paymentSummaries =>
        paymentSummaries.add({
            paymentCode: 'afterpay',
            importPath:
                '@magebit/pwa-studio-afterpay/src/components/summary.js'
        })
    );

    // Importing Required Components
    const CheckoutPageComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.js'
    );

    /** @TODO: remove this when @magebit/pwa-studio-override-resolver is fixed (MPG-142) */
    const CheckoutPageOverrideComponent = targetables.reactComponent(
        'src/components/overrides/CheckoutPage/checkoutPage.js'
    );

    const CheckoutErrorComponent = targetables.reactComponent(
        '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError.js'
    );

    const CheckoutPageTalon = targetables.reactComponent(
        '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage.js'
    );

    const PaymentInformationComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentInformation.js'
    );

    const PaymentSummaryComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summary.js'
    );

    // Add AfterpayContext around payment methods
    CheckoutPageComponent.addImport('import AfterpayContextProvider from "@magebit/pwa-studio-afterpay/src/context/afterpayContextProvider"')
    CheckoutPageComponent.surroundJSX('<PaymentInformation />', '<AfterpayContextProvider handlePlaceOrder=\{handlePlaceOrder\} checkoutError=\{error\} setCheckoutStep=\{setCheckoutStep\} resetReviewOrderButtonClicked=\{resetReviewOrderButtonClicked\} isGuestCheckout=\{isGuestCheckout\}>')

    /** @TODO: remove this when @magebit/pwa-studio-override-resolver is fixed (MPG-142) */
    CheckoutPageOverrideComponent.addImport('import AfterpayContextProvider from "@magebit/pwa-studio-afterpay/src/context/afterpayContextProvider"')
    CheckoutPageOverrideComponent.surroundJSX('<PaymentInformation />', '<AfterpayContextProvider handlePlaceOrder=\{handlePlaceOrder\} checkoutError=\{error\} setCheckoutStep=\{setCheckoutStep\} resetReviewOrderButtonClicked=\{resetReviewOrderButtonClicked\} isGuestCheckout=\{isGuestCheckout\}>')

    // Add a reset for PaymentInformation from submit
    PaymentInformationComponent.insertAfterSource('<Summary onEdit={showEditModal}', 'onPaymentError={handlePaymentError}')
    PaymentSummaryComponent.insertAfterSource('const { classes: propClasses, onEdit', ', onPaymentError');
    PaymentSummaryComponent.insertAfterSource('return <SummaryPaymentMethodComponent onEdit={onEdit}', 'onPaymentError={onPaymentError}');
};
