import { useQuery } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/paymentMethods.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const paymentIcons = {
    afterpay: '/static-assets/icons/afterpay.png',
    myfatoorah_gateway_b: '/static-assets/icons/benefit-bahrain.png',
    default: '/static-assets/icons/credit-card.svg',
    tabby_installments: '/static-assets/icons/tabby.svg',
    tabby_cc_installments: '/static-assets/icons/tabby.svg',
    tabby_checkout: '/static-assets/icons/tabby.svg',
    myfatoorah_gateway_kn: '/static-assets/icons/knet.svg',
    myfatoorah_gateway_s: '/static-assets/icons/sadad.svg',
    embedpay: '/static-assets/icons/myfatoorahcc.png',
    cashondelivery: '/static-assets/icons/cashondelivery.svg'
};

export const usePaymentMethods = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getPaymentMethodsQuery } = operations;

    const [{ cartId }] = useCartContext();

    const { data, loading } = useQuery(getPaymentMethodsQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const { value: currentSelectedPaymentMethod } = useFieldState('selectedPaymentMethod');

    const availablePaymentMethods =
        data &&
        data.cart.available_payment_methods &&
        data.cart.available_payment_methods.map(payment => {
            if (paymentIcons[payment.code]) {
                return Object.assign({}, payment, { image: paymentIcons[payment.code] });
            }
            return Object.assign({}, payment, { image: paymentIcons['default'] });
        });

    const initialSelectedMethod = (availablePaymentMethods.length && availablePaymentMethods[0].code) || null;

    return {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        initialSelectedMethod,
        isLoading: loading
    };
};
