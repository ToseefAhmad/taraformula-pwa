import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/couponCode.gql';
import PRICE_SUMMARY_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummary.gql';
import SHIPPING_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/shippingMethod.gql';

/**
 * This talon contains the logic for a coupon code form component.
 * It performs effects and returns props data for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Fetch all coupons associated with the cart
 * - Manage the updating state of the cart while a coupon is being applied or removed
 *
 * @function
 *
 * @param {Object} props
 * @param {CouponCodeMutations} props.mutations GraphQL mutations for a cart's coupon code.
 * @param {CouponCodeQueries} props.queries GraphQL queries for a cart's coupon code.
 *
 * @return {CouponCodeTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode';
 */
export const useCouponCode = () => {
    const { getAppliedCouponsQuery, applyCouponMutation, removeCouponMutation } = DEFAULT_OPERATIONS;

    const [{ cartId }] = useCartContext();
    const { data, error: fetchError } = useQuery(getAppliedCouponsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const [applyCoupon, { error: applyError, loading: applyingCoupon }] = useMutation(applyCouponMutation);

    const [removeCoupon, { error: removeCouponError, loading: removingCoupon }] = useMutation(removeCouponMutation);

    const handleApplyCoupon = useCallback(
        async ({ couponCode }) => {
            if (!couponCode) return;
            try {
                await applyCoupon({
                    variables: {
                        cartId,
                        couponCode
                    },
                    refetchQueries: [
                        {
                            query: SHIPPING_OPERATIONS.getSelectedAndAvailableShippingMethodsQuery,
                            variables: { cartId }
                        },
                        {
                            query: PRICE_SUMMARY_OPERATIONS.getPriceSummaryQuery,
                            variables: { cartId }
                        }
                    ]
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [applyCoupon, cartId]
    );

    const handleRemoveCoupon = useCallback(
        async couponCode => {
            try {
                await removeCoupon({
                    variables: {
                        cartId,
                        couponCode
                    },
                    refetchQueries: [
                        {
                            query: SHIPPING_OPERATIONS.getSelectedAndAvailableShippingMethodsQuery,
                            variables: { cartId }
                        },
                        {
                            query: PRICE_SUMMARY_OPERATIONS.getPriceSummaryQuery,
                            variables: { cartId }
                        }
                    ]
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, removeCoupon]
    );

    // Create a memoized error map and toggle individual errors when they change
    const errors = useMemo(
        () =>
            new Map([
                ['getAppliedCouponsQuery', fetchError],
                ['applyCouponMutation', applyError],
                ['removeCouponMutation', removeCouponError]
            ]),
        [applyError, fetchError, removeCouponError]
    );

    return {
        applyingCoupon,
        data,
        errors,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for a cart's coupon code.
 * This is a type used by the {@link useCouponCode} talon.
 *
 * @typedef {Object} CouponCodeMutations
 *
 * @property {GraphQLAST} applyCouponMutation Mutation for applying a coupon code to a cart.
 * @property {GraphQLAST} removeCouponMutation Mutation for removing a coupon code from a cart.
 *
 * @see [CouponCode.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.js}
 * for the queries used Venia
 */

/**
 * GraphQL queries for a cart's coupon code.
 * This is a type used by the {@link useCouponCode} talon.
 *
 * @typedef {Object} CouponCodeQueries
 *
 * @property {GraphQLAST} getAppliedCouponsQuery Query to fetch the currently applied coupons for a cart.
 *
 * @see [CouponCode.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.js}
 * for the queries used Venia
 */

/**
 * Object type returned by the {@link useCouponCode} talon.
 * It provides props data to use when rendering a coupon code component.
 *
 * @typedef {Object} CouponCodeTalonProps
 *
 * @property {boolean} applyingCoupon True if a coupon is currently being applied. False otherwise.
 * @property {Object} data Data returned from the `getAppliedCouponsQuery`.
 * @property {String} errorMessage If GraphQL error occurs, this value is set.
 * @property {Object} fetchError The error data object returned by a GraphQL query.
 * @property {function} handleApplyCoupon Function to call for handling the application of a coupon code to a cart.
 * @property {function} handleRemoveCoupon Function to call for handling the removal of a coupon code from a cart
 * @property {boolean} removingCoupon True if a coupon code is currently being removed. False otherwise.
 */
