module.exports = targets => {
    const { checkoutPagePaymentTypes } = targets.of('@magento/venia-ui');
    checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'cashondelivery',
            importPath: 'src/components/overrides/CheckoutPage/PaymentMethod/CashOnDelivery/cashOnDelivery.js'
        })
    );
};
