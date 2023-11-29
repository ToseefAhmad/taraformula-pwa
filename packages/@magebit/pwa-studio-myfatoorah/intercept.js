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

    // Embed Pay
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'embedpay',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/embedPay.js'
        })
    );

    editablePaymentTypes.tap(editablePaymentTypes => {
        editablePaymentTypes.add({
            paymentCode: 'embedpay',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/edit.js'
        });
    });
    summaryPagePaymentTypes.tap(paymentSummaries =>
        paymentSummaries.add({
            paymentCode: 'embedpay',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/summary.js'
        })
    );

    // Payment Gateway KNET
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'myfatoorah_gateway_kn',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/knet.js'
        })
    );

    // Payment Gateway Sadad
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'myfatoorah_gateway_s',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/sadad.js'
        })
    );

    // Payment Gateway Benefit
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'myfatoorah_gateway_b',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/benefit.js'
        })
    );

    // Payment Gateway UAE Debit Cards
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'myfatoorah_gateway_uaecc',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/uaeDebitCards.js'
        })
    );

    // Payment Gateway Qatar Debit Cards
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'myfatoorah_gateway_np',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/qatarDebitCards.js'
        })
    );

    // Payment Gateway Oman Net
    // @TODO check if on code is correct
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'myfatoorah_gateway_on',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/omanNet.js'
        })
    );

    summaryPagePaymentTypes.tap(paymentSummaries =>
        paymentSummaries.add({
            paymentCode: 'myfatoorah_gateway',
            importPath:
                '@magebit/pwa-studio-myfatoorah/src/components/Gateways/summary.js'
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

    // Add MyFatoorahContextProvider around payment methods
    CheckoutPageComponent.addImport('import MyFatoorahContextProvider from "@magebit/pwa-studio-myfatoorah/src/context/myFatoorahContextProvider"')
    CheckoutPageComponent.addImport('import GatewayContextProvider from "@magebit/pwa-studio-myfatoorah/src/context/gatewayContextProvider"')
    CheckoutPageComponent.surroundJSX('<PaymentInformation />', '<MyFatoorahContextProvider />')
    CheckoutPageComponent.surroundJSX('<PaymentInformation />', '<GatewayContextProvider />')

    /** @TODO: remove this when @magebit/pwa-studio-override-resolver is fixed (MPG-142) */
    CheckoutPageOverrideComponent.addImport('import MyFatoorahContextProvider from "@magebit/pwa-studio-myfatoorah/src/context/myFatoorahContextProvider"')
    CheckoutPageOverrideComponent.addImport('import GatewayContextProvider from "@magebit/pwa-studio-myfatoorah/src/context/gatewayContextProvider"')
    CheckoutPageOverrideComponent.surroundJSX('<PaymentInformation />', '<MyFatoorahContextProvider />')
    CheckoutPageOverrideComponent.surroundJSX('<PaymentInformation />', '<GatewayContextProvider />')
};
