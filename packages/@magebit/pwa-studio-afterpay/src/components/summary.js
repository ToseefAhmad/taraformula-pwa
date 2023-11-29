import { func, shape, string } from 'prop-types';
import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import classes from './summary.module.css';

/**
 * The Summary component of the Afterpay payment method extension.
 */
const Summary = props => {
    const { onEdit } = props;

    return (
        <div className={classes.root}>
            <div className={classes.headingContainer}>
                <h5 className={classes.heading}>
                    <FormattedMessage id={'checkoutPage.paymentInformation'} defaultMessage={'Payment Information'} />
                </h5>
                <LinkButton className={classes.editButton} onClick={onEdit} type="button">
                    <Icon size={16} src={EditIcon} classes={{ icon: classes.editIcon }} />
                    <span className={classes.editText}>
                        <FormattedMessage id={'global.editButton'} defaultMessage={'Edit'} />
                    </span>
                </LinkButton>
            </div>
            <div className={classes.afterpayDetailsContainer}>
                <span className={classes.paymentType}>
                    <FormattedMessage id={'afterpay.paymentMethod'} defaultMessage={'Afterpay'} />
                </span>
                <div className={classes.redirectMessage}>
                    <FormattedMessage
                        id={'afterpay.redirectMessage'}
                        defaultMessage={
                            'After clicking "Place Order", you will be redirected to Afterpay to complete your purchase securely.'
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        afterpayDetailsContainer: string,
        editButton: string,
        editIcon: string,
        editText: string,
        headingContainer: string,
        heading: string,
        paymentType: string
    }),
    onEdit: func,
    onPaymentError: func
};
