import { ElementsConsumer } from '@stripe/react-stripe-js';
import { bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStripeSavedCardsPage } from '@app/talons/Stripe/useStripeSavedCardsPage';
import Button from '@magento/venia-ui/lib/components/Button';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './addCard.module.css';
import CardSection from './cardSection';

const AddCard = ({ handleCancel, isCancelAvailable, ...props }) => {
    const { handleSave, stripeState, saveNewCardLoading } = useStripeSavedCardsPage(props);

    const handleSaveAndReturn = () => {
        handleSave().then(() => {
            handleCancel();
        });
    };

    if (saveNewCardLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'addCard.savingCard'} defaultMessage={'Saving Payment Method'} />
            </LoadingIndicator>
        );
    }

    return (
        <div className={classes.root}>
            <h4 className={classes.title}>
                <FormattedMessage id={'addCard.addNewCardText'} defaultMessage={'Card Details'} />
            </h4>
            <CardSection />
            <div className={classes.actions}>
                <Button disabled={!stripeState.cardFieldsComplete} onClick={handleSaveAndReturn}>
                    <FormattedMessage id={'addCard.savePayment'} defaultMessage={'Save Payment'} />
                </Button>
                {isCancelAvailable && (
                    <Button onClick={handleCancel}>
                        <FormattedMessage id={'global.cancel'} defaultMessage={'Cancel'} />
                    </Button>
                )}
            </div>
        </div>
    );
};

AddCard.propTypes = {
    handleCancel: func,
    isCancelAvailable: bool
};

AddCard.defaultProps = {
    isCancelAvailable: true
};

const InjectedForm = props => {
    return (
        <ElementsConsumer>
            {({ stripe, elements }) => <AddCard stripe={stripe} elements={elements} {...props} />}
        </ElementsConsumer>
    );
};

export default InjectedForm;
