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
            paymentCode: 'stripe_payments',
            importPath:
                '@magebit/pwa-studio-stripe/src/components/stripe.js'
        })
    );

    editablePaymentTypes.tap(editablePaymentTypes => {
        editablePaymentTypes.add({
            paymentCode: 'stripe_payments',
            importPath:
                '@magebit/pwa-studio-stripe/src/components/edit.js'
        });
    });
    summaryPagePaymentTypes.tap(paymentSummaries =>
        paymentSummaries.add({
            paymentCode: 'stripe_payments',
            importPath:
                '@magebit/pwa-studio-stripe/src/components/summary.js'
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

    // Add StripeContext around payment methods
    CheckoutPageComponent.addImport('import StripeContextProvider from "@magebit/pwa-studio-stripe/src/context/stripeContextProvider"')
    CheckoutPageComponent.surroundJSX('<PaymentInformation />', '<StripeContextProvider handlePlaceOrder=\{handlePlaceOrder\} checkoutError=\{error\} setCheckoutStep=\{setCheckoutStep\} resetReviewOrderButtonClicked=\{resetReviewOrderButtonClicked\} isGuestCheckout=\{isGuestCheckout\}>')

    /** @TODO: remove this when @magebit/pwa-studio-override-resolver is fixed (MPG-142) */
    CheckoutPageOverrideComponent.addImport('import StripeContextProvider from "@magebit/pwa-studio-stripe/src/context/stripeContextProvider"')
    CheckoutPageOverrideComponent.surroundJSX('<PaymentInformation />', '<StripeContextProvider handlePlaceOrder=\{handlePlaceOrder\} checkoutError=\{error\} setCheckoutStep=\{setCheckoutStep\} resetReviewOrderButtonClicked=\{resetReviewOrderButtonClicked\} isGuestCheckout=\{isGuestCheckout\}>')


    // Do not show placeOrder error if 3d secure
    CheckoutPageComponent.insertAfterSource('if (hasError) {', 'if (error.is3dSecure()) return;');

    /** @TODO: remove this when @magebit/pwa-studio-override-resolver is fixed (MPG-142) */
    CheckoutPageOverrideComponent.insertAfterSource('if (hasError) {', 'if (error.is3dSecure()) return;');

    // Add Stripe Error method for 3d secure
    CheckoutErrorComponent.addImport('import {STRIPE_3DS_ERROR} from "@magebit/pwa-studio-stripe/src/components/PlaceOrderErrors"');
    CheckoutErrorComponent.insertBeforeSource('hasPaymentExpired = () => {',
        'is3dSecure = () => {\n' +
        '        return this.error.graphQLErrors.some(({ message }) =>\n' +
        '            message.includes(STRIPE_3DS_ERROR) \n' +
        '        );\n' +
        '    };'
    );

    // Setting that the standard handlePaymentExpire is ignored if it's 3d secure
    CheckoutErrorComponent.insertAfterSource('message.includes(PAYMENT_ERROR)', '&& !message.includes(STRIPE_3DS_ERROR)')

    // Catching errors on checkout, if 3d secure, do nothing
    CheckoutPageTalon.addImport('import {STRIPE_3DS_ERROR} from "@magebit/pwa-studio-stripe/src/components/PlaceOrderErrors"');
    CheckoutPageTalon.insertAfterSource('} catch (err) {', 'if (err.message.includes(STRIPE_3DS_ERROR)) return;')

    // Add a reset for PaymentInformation from submit
    PaymentInformationComponent.insertAfterSource('<Summary onEdit={showEditModal}', 'onPaymentError={handlePaymentError}')
    PaymentSummaryComponent.insertAfterSource('const { classes: propClasses, onEdit', ', onPaymentError');
    PaymentSummaryComponent.insertAfterSource('return <SummaryPaymentMethodComponent onEdit={onEdit}', 'onPaymentError={onPaymentError}');
};
