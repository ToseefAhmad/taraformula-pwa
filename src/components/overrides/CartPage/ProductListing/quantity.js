import { Form } from 'informed';
import { func, number, string, object, bool } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { Minus as MinusIcon, Plus as PlusIcon } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './quantity.module.css';
import { useQuantity } from './useQuantity';

export const QuantityFields = ({
    initialValue,
    itemId,
    min,
    max,
    onChange,
    message,
    decreaseIcon,
    increaseIcon,
    decreaseIconSize,
    increaseIconSize,
    field,
    sticky,
    revertQty,
    classes: propClasses
}) => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantity({
        initialValue,
        min,
        max,
        onChange,
        sticky,
        revertQty
    });

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = talonProps;

    const errorMessage = message ? <Message>{message}</Message> : null;

    const minusIconToShow = decreaseIcon ? decreaseIcon : MinusIcon;
    const plusIconToShow = increaseIcon ? increaseIcon : PlusIcon;
    const minusIconSize = decreaseIconSize ? decreaseIconSize : 22;
    const plusIconSize = increaseIconSize ? increaseIconSize : 20;
    const fieldName = field ? field : 'quantity';

    return (
        <Fragment>
            <div className={classes.root}>
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonDecrement',
                        defaultMessage: 'Decrease Quantity'
                    })}
                    className={classes.button_decrement}
                    disabled={isDecrementDisabled}
                    onClick={handleDecrement}
                    type="button"
                >
                    <Icon classes={iconClasses} src={minusIconToShow} size={minusIconSize} />
                </button>
                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    classes={{ input: classes.input }}
                    field={fieldName}
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    max={max}
                    onBlur={handleBlur}
                    pattern="[0-9]*"
                />
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonIncrement',
                        defaultMessage: 'Increase Quantity'
                    })}
                    className={classes.button_increment}
                    disabled={isIncrementDisabled}
                    onClick={handleIncrement}
                    type="button"
                >
                    <Icon classes={iconClasses} src={plusIconToShow} size={plusIconSize} />
                </button>
            </div>
            {errorMessage}
        </Fragment>
    );
};

const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    min: number,
    onChange: func,
    message: string,
    decreaseIcon: object,
    increaseIcon: object
};

Quantity.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

QuantityFields.propTypes = {
    initialValue: number,
    itemId: string,
    min: number,
    max: number,
    onChange: func,
    message: string,
    classes: object,
    decreaseIcon: object,
    increaseIcon: object,
    decreaseIconSize: number,
    increaseIconSize: number,
    field: string,
    sticky: bool,
    revertQty: bool
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default Quantity;
