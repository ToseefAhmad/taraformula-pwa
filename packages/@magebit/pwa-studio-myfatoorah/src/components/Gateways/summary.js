import { func, shape, string } from 'prop-types';
import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import classes from './summary.module.css';
import {useGatewaySummary} from "../../talons/useGatewaySummary";
import Icon from "@magento/venia-ui/lib/components/Icon";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";

/**
 * The Summary component of the MyFatoorah payment method extension.
 */
const Summary = props => {
    const {
        myFatoorahState
    } = useGatewaySummary();

    const { resetPayment } = props;

    return (
        <div className={classes.root}>
            <div className={classes.headingContainer}>
                <h5 className={classes.heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformation'}
                        defaultMessage={'Payment Information'}
                    />
                </h5>
                <LinkButton
                    className={classes.editButton}
                    onClick={resetPayment}
                    type="button"
                >
                    <Icon
                        size={16}
                        src={EditIcon}
                        classes={{ icon: classes.editIcon }}
                    />
                    <span className={classes.editText}>
                        <FormattedMessage
                            id={'global.editButton'}
                            defaultMessage={'Edit'}
                        />
                    </span>
                </LinkButton>
            </div>
            <div className={classes.mfDetailsContainer}>
                <span className={classes.paymentType}>
                    <FormattedMessage
                        id={'paymentMethodCode.myfatoorah_gateway_' + myFatoorahState.selectedGateway}
                        defaultMessage={myFatoorahState.gatewayName}
                    />
                </span>
            </div>
        </div>
    );
};

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        mfDetailsContainer: string,
        editButton: string,
        editIcon: string,
        editText: string,
        headingContainer: string,
        heading: string,
        paymentType: string
    }),
    onPaymentError: func,
    resetPayment: func
};
