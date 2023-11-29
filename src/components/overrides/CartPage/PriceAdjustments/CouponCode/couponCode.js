import { Form } from 'informed';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import LinkButton from '@app/components/overrides/LinkButton';
import TextInput from '@app/components/overrides/TextInput';
import { useToasts, ToastType } from '@app/hooks/useToasts';
import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './couponCode.module.css';

/**
 * A child component of the PriceAdjustments component.
 * This component renders a form for addingg a coupon code to the cart.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [couponCode.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CouponCode from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode";
 */
const CouponCode = () => {
    const talonProps = useCouponCode();
    const [, { addToast }] = useToasts();
    const { data, errors, handleApplyCoupon, handleRemoveCoupon, removingCoupon, applyingCoupon } = talonProps;
    const { formatMessage } = useIntl();

    const removeCouponError = deriveErrorMessage([errors.get('removeCouponMutation')]);
    const addCouponError = deriveErrorMessage([errors.get('applyCouponMutation')]);

    const [value, setValue] = useState('');

    const [input, setInput] = useState('');

    const handleChange = event => {
        setValue(event.target.value);
    };

    const handleSubmit = event => {
        handleApplyCoupon(event);
        setInput(event.couponCode);
    };

    useEffect(() => {
        if (removeCouponError) {
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'couponCode.removeError',
                    defaultMessage: removeCouponError
                })
            });
        }
    }, [addToast, formatMessage, removeCouponError]);

    useEffect(() => {
        if (addCouponError) {
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'couponCode.applyError',
                    defaultMessage: `Coupon code ${input} does not exist`
                })
            });
        }
    }, [addToast, addCouponError, formatMessage, input]);

    useEffect(() => {
        if (data.cart.applied_coupons) {
            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'couponCode.applySuccess',
                    defaultMessage: 'You successfully applied coupon code'
                })
            });
        }
    }, [addToast, data.cart.applied_coupons, formatMessage]);

    if (!data) {
        return null;
    }

    if (errors.get('getAppliedCouponsQuery')) {
        return (
            <div className={classes.errorContainer}>
                <FormattedMessage
                    id={'couponCode.errorContainer'}
                    defaultMessage={'Something went wrong. Please refresh and try again.'}
                />
            </div>
        );
    }

    if (data.cart.applied_coupons) {
        const codes = data.cart.applied_coupons.map(({ code }) => {
            return (
                <div className={classes.removeContainer} key={code}>
                    <span>{code}</span>
                    {removingCoupon ? (
                        <div className={classes.removeLoader}>
                            <LoadingIndicator classes={{ root: classes.loaderIcon }} />
                        </div>
                    ) : (
                        <LinkButton
                            className={classes.removeButton}
                            disabled={removingCoupon}
                            onClick={() => {
                                handleRemoveCoupon(code);
                            }}
                        >
                            <FormattedMessage id={'couponCode.removeButton'} defaultMessage={'Remove'} />
                        </LinkButton>
                    )}
                </div>
            );
        });

        return <div className={classes.appliedCoupon}>{codes}</div>;
    } else {
        const errorMessage = deriveErrorMessage([errors.get('applyCouponMutation')]);

        const formClass = errorMessage ? classes.entryFormError : classes.entryForm;

        return (
            <Form className={formClass} onSubmit={handleSubmit}>
                <Field id="couponCode">
                    <TextInput
                        field="couponCode"
                        id={'couponCode'}
                        label={formatMessage({
                            id: 'couponCode.enterCode',
                            defaultMessage: 'Enter code'
                        })}
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        onChange={handleChange}
                    />
                </Field>
                <Field>
                    {applyingCoupon ? (
                        <LoadingIndicator classes={{ root: classes.loaderIcon }} />
                    ) : (
                        <Button disabled={!value} priority="primary" fill="outline" type="submit">
                            <FormattedMessage id={'couponCode.apply'} defaultMessage={'Apply'} />
                        </Button>
                    )}
                </Field>
            </Form>
        );
    }
};

export default CouponCode;
