import { useFieldApi } from 'informed';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState, useEffect } from 'react';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

/**
 * This talon contains logic for a product quantity UI component.
 * It performs effects and returns prop data for rendering a component that lets you
 * modify the quantity of a cart item.
 *
 * This talon performs the following effects:
 *
 * - Updates the state of the quantity field when the initial value changes
 *
 * @function
 *
 * @param {Object} props
 * @param {number} props.initialValue the initial quantity value
 * @param {number} props.min the minimum allowed quantity value
 * @param {function} props.onChange change handler to invoke when quantity value changes
 *
 * @returns {QuantityTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';
 */
export const useQuantity = props => {
    const { initialValue, min, max, onChange, sticky, revertQty } = props;

    const [prevQuantity, setPrevQuantity] = useState(initialValue);

    const quantityFieldApi = useFieldApi('quantity');

    // If its sticky block, update qty field there too
    const stickyQuantityFieldApi = useFieldApi(sticky ? 'sticky-quantity' : null);

    const { value: quantity } = useFieldState('quantity');
    const { value: stickyQuantity } = useFieldState(sticky && 'sticky-quantity');

    const [isIncrementDisabled, setIsIncrementDisabled] = useState(true);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // Actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !quantity || quantity <= 1, [quantity]);

    // Fire the onChange after some wait time. We calculate the current delay
    // As enough time for a user to spam inc/dec quantity but not enough time
    // For a user to click inc/dec on Product A and then click Product B.
    const debouncedOnChange = useMemo(
        () =>
            debounce(val => {
                setPrevQuantity(val);
                onChange(val);
            }, 350),
        [onChange]
    );

    const handleDecrement = useCallback(() => {
        const newQuantity = quantity - 1;
        quantityFieldApi.setValue(newQuantity);
        if (stickyQuantityFieldApi) {
            stickyQuantityFieldApi.setValue(newQuantity);
        }
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi, stickyQuantityFieldApi]);

    const handleIncrement = useCallback(() => {
        const newQuantity = quantity + 1;
        quantityFieldApi.setValue(newQuantity);
        if (stickyQuantityFieldApi) {
            stickyQuantityFieldApi.setValue(newQuantity);
        }
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi, stickyQuantityFieldApi]);

    const handleBlur = useCallback(() => {
        // Only submit the value change if it has changed.
        if (typeof quantity === 'number' && quantity !== prevQuantity) {
            debouncedOnChange(quantity);

            // Make sure to update both sticky qty fields
            if (stickyQuantityFieldApi) {
                quantityFieldApi.setValue(quantity);
                stickyQuantityFieldApi.setValue(quantity);
            }
            // Add check if sticky qty is used
        } else if (sticky && typeof stickyQuantity === 'number' && stickyQuantity !== prevQuantity) {
            debouncedOnChange(stickyQuantity);

            // Make sure to update both sticky qty fields
            if (stickyQuantityFieldApi) {
                quantityFieldApi.setValue(stickyQuantity);
                stickyQuantityFieldApi.setValue(stickyQuantity);
            }
        }
    }, [debouncedOnChange, prevQuantity, quantity, stickyQuantity, stickyQuantityFieldApi, quantityFieldApi, sticky]);

    const maskInput = useCallback(
        value => {
            try {
                // For some storefronts decimal values are allowed.
                const nextVal = parseFloat(value);
                if (value && isNaN(nextVal)) throw new Error(`${value} is not a number.`);
                if (nextVal < min) return min;
                else return nextVal;
            } catch (err) {
                return prevQuantity;
            }
        },
        [min, prevQuantity]
    );

    /**
     * Everytime max qty changes, update the button states.
     */
    useEffect(() => {
        setIsIncrementDisabled(!quantity || quantity >= max);
    }, [max, quantity]);

    /**
     * Everytime initialValue changes, update the quantity field state.
     */
    useEffect(() => {
        quantityFieldApi.setValue(initialValue);
        if (stickyQuantityFieldApi) {
            stickyQuantityFieldApi.setValue(initialValue);
        }
    }, [initialValue, quantityFieldApi, stickyQuantityFieldApi]);

    /**
     * If there is a quantity error, update quantity back to initalValue.
     */
    useEffect(() => {
        if (revertQty) {
            quantityFieldApi.setValue(initialValue);
            if (stickyQuantityFieldApi) {
                stickyQuantityFieldApi.setValue(initialValue);
            }
        }
    }, [initialValue, quantityFieldApi, stickyQuantityFieldApi, revertQty]);

    return {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    };
};

/** JSDoc type definitions */

/**
 * Object type returned by the {@link useQuantity} talon.
 * It provides props data for a quantity UI component.
 *
 * @typedef {Object} QuantityTalonProps
 *
 * @property {boolean} isDecrementDisabled True if decrementing should be disabled
 * @property {boolean} isIncrementDisabled True if incrementing should be disabled
 * @property {function} handleBlur Callback function for handling a blur event on a component
 * @property {function} handleDecrement Callback function for handling a quantity decrement event
 * @property {function} handleIncrement Callback function for handling an increment event
 * @property {function} maskInput Function for masking a value when decimal values are allowed
 */
