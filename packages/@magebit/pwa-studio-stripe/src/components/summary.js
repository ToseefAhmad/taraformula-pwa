import { useStripe } from "@magebit/pwa-studio-stripe/src/talons/useStripe";
import {ElementsConsumer} from "@stripe/react-stripe-js";
import { func, shape, string } from 'prop-types';
import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import classes from './summary.module.css';

/**
 * The Summary component of the Stripe payment method extension.
 */
const Summary = props => {
    const { onEdit } = props;

    const { stripeState } = useStripe(props);

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
                    onClick={onEdit}
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
            <div className={classes.stripeDetailsContainer}>
                <span className={classes.paymentType}>
                    <FormattedMessage
                        id={'stripe.paymentType'}
                        values={{
                            brand: stripeState.cardBrand.toUpperCase(),
                            last4: stripeState.cardLast4
                        }}
                        defaultMessage={'{brand} ending in {last4}'}
                    />
                </span>
            </div>
        </div>
    );
};

const InjectedSummaryForm = props => {
    return (
        <ElementsConsumer>
            {({ stripe, elements }) => (
                <Summary stripe={stripe} elements={elements} {...props} />
            )}
        </ElementsConsumer>
    );
}

export default InjectedSummaryForm;

Summary.propTypes = {
    classes: shape({
        root: string,
        stripeDetailsContainer: string,
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
