import {useMutation} from "@apollo/client";
import {useCallback, useState} from "react";

import {BrowserPersistence} from "@magento/peregrine/lib/util";

import OPERATIONS from "./myFatoorah.gql";
import store from '@app/store';
import { saveCartId } from '@app/overrides/peregrine/store/actions/cart/asyncActions';
import actions from '@magento/peregrine/lib/store/actions/cart/actions';
import { useHistory } from "react-router-dom";

const storage = new BrowserPersistence();

export const usePaymentValidation = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [validationSubmitted, setValidationSubmitted] = useState(false);
    const [cartData, setCartData] = useState(storage.getItem('myfatoorah_data'));
    const [placeOrderData, setPlaceOrderData] = useState(storage.getItem('myfatoorah_placeOrderData'));
    const { push } = useHistory();

    const [
        getRedirectUrl
    ] = useMutation(OPERATIONS.getRedirectUrl);

    const [
        getPaymentValidation
    ] = useMutation(OPERATIONS.getPaymentValidation);

    const fetchRedirectUrl = useCallback(async (cartData, placeOrderData) => {
        try {
            storage.setItem('myfatoorah_data', cartData);
            storage.setItem('myfatoorah_placeOrderData', placeOrderData);
            const data = await getRedirectUrl({
                variables: {
                    orderId: placeOrderData.placeOrder.order.order_number,
                    sessionId: storage.getItem('myfatoorah_session_id'),
                    gateway: storage.getItem('myfatoorah_gateway'),
                }
            });

            cartData['cart']['selected_payment_method']['gateway_name'] = data.data.getMyFatoorahRedirectUrl.gateway_name
            cartData['cart']['selected_payment_method']['gateway_code'] = data.data.getMyFatoorahRedirectUrl.gateway_code
            storage.setItem('myfatoorah_data', cartData);

            window.location = data.data.getMyFatoorahRedirectUrl.redirect_url;
        } catch(e) {
            console.error(e);
        }
    }, [getRedirectUrl])

    const fetchPaymentValidation = useCallback(async (paymentId) => {
        try {
            setValidationSubmitted(true);
            const data = await getPaymentValidation({
                variables: {
                    paymentId
                }
            });
            const status = data.data.getMyFatoorahPaymentValidation.status;

            // Restoring cart after payment failed
            if (data.data.getMyFatoorahPaymentValidation.quote_id) {
                await saveCartId(data.data.getMyFatoorahPaymentValidation.quote_id);
                await store.dispatch(actions.getCart.receive(data.data.getMyFatoorahPaymentValidation.quote_id));
            }

            if (status === 'success') {
                setIsSuccess(true);
            } else {
                push('/checkout?paymentFailed=1');
                setIsSuccess(false);
            }
            setIsLoading(false);
        } catch(e) {
            console.error(e);
            push('/checkout?paymentFailed=1');
            setIsSuccess(false);
            setIsLoading(false);
        }
        storage.removeItem('myfatoorah_data');
        storage.removeItem('myfatoorah_placeOrderData');
    }, [getPaymentValidation, setValidationSubmitted]);

    return {
        fetchRedirectUrl,
        isLoading,
        fetchPaymentValidation,
        cartData,
        placeOrderData,
        validationSubmitted,
        isSuccess,
        orderNumber: (placeOrderData && placeOrderData.placeOrder.order.order_number) || null
    }
};
