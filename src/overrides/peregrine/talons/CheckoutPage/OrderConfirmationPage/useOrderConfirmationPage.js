import { useMemo } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const storage = new BrowserPersistence();

const getStorageData = () => {
    const item = storage.getItem('checkout_order_data');
    if (item) {
        item.cart.isSuccessful = true;
        storage.setItem('checkout_order_data', item);
    }
    return item;
};

const getOrderNumber = () => {
    const item = storage.getItem('checkout_order_number');
    let number = item;
    if (item) {
        if (typeof item === 'object') {
            number = item.number;
        } else {
            storage.setItem('checkout_order_number', { number: item, isSuccessful: true });
        }
    }
    return number;
};

export const flatten = ({ cart }) => {
    const { applied_gift_cards, prices, shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const shippingMethod = `${address.selected_shipping_method.carrier_title} - ${
        address.selected_shipping_method.method_title
    }`;

    return {
        city: address.city,
        country: address.country.label,
        country_code: address.country.code,
        email: cart.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region.label,
        area: address.area,
        block: address.block,
        neighborhood: address.neighborhood,
        zone: address.zone,
        avenue: address.avenue,
        house_building: address.house_building,
        floor: address.floor,
        building: address.building,
        flat: address.flat,
        postal_code: address.postal_code,
        additional_numbers: address.additional_numbers,
        id_number: address.id_number,
        shippingMethod,
        street: address.street,
        totalItemQuantity: cart.total_quantity,
        telephone: address.telephone,
        selectedPaymentMethod: cart.selected_payment_method,
        priceTotals: {
            subtotal: prices.subtotal_excluding_tax,
            total: prices.grand_total,
            discounts: prices.discounts,
            giftCards: applied_gift_cards,
            taxes: prices.applied_taxes,
            shipping: shipping_addresses,
            appliedCoupons: cart.applied_coupons,
            codFee: cart.codFee
        }
    };
};

export const useOrderConfirmationPage = ({ data, orderNumber }) => {
    const [{ isSignedIn }] = useUserContext();

    const { flatData, itemsData } = useMemo(() => {
        const storageData = getStorageData();
        const flattenedData = flatten(data || storageData);
        const itemsData = data || storageData || [];

        return { flatData: flattenedData, itemsData };
    }, [data]);

    const orderNr = useMemo(() => {
        const storageNr = getOrderNumber();
        const orderNrValue = orderNumber || storageNr;
        return orderNrValue;
    }, [orderNumber]);

    return {
        itemsData,
        flatData,
        isSignedIn,
        orderNumber: orderNr
    };
};
