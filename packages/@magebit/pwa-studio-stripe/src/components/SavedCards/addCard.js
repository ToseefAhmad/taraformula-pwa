import CardSection from '@magebit/pwa-studio-stripe/src/components/cardSection';
import {useStripeSavedCardsPage} from '@magebit/pwa-studio-stripe/src/talons/useStripeSavedCardsPage';
import {ElementsConsumer} from '@stripe/react-stripe-js';
import React, {useEffect} from 'react';
import {AlertCircle as AlertCircleIcon} from 'react-feather';
const errorIcon = <Icon src={AlertCircleIcon} size={20}/>;
import {FormattedMessage, useIntl} from 'react-intl';

import {useToasts} from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from "./addCard.module.css";

const AddCard = props => {

    const {
        handleSave,
        stripeState,
        saveNewCardLoading,
        hasSaveNewCardError,
        saveNewCardError
    } = useStripeSavedCardsPage(props);

    const {formatMessage} = useIntl();
    const [, {addToast}] = useToasts();

    useEffect(() => {
        if (hasSaveNewCardError) {
            const message =
                saveNewCardError && saveNewCardError.message
                    ? saveNewCardError.message
                    : formatMessage({
                        id: 'stripe.saveCardError',
                        defaultMessage: 'We were unable to save your saved card. Please, try again!'
                    });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(saveNewCardError);
            }
        }
    }, [addToast, saveNewCardError, formatMessage, hasSaveNewCardError]);

    if (saveNewCardLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'stripe.savingCard'}
                    defaultMessage={'Saving Card Information'}
                />
            </LoadingIndicator>
        )
    }

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <FormattedMessage
                    id={'stripe.addNewCard'}
                    defaultMessage={'Add a new saved card'}
                />
            </div>
            <CardSection/>
            <button
                className={classes.saveButton}
                disabled={!stripeState.cardFieldsComplete}
                aria-label={{
                    id: 'global.save',
                    defaultMessage: 'Save'
                }}
                onClick={handleSave}
            >
                <FormattedMessage
                    id={'global.save'}
                    defaultMessage={'Save'}
                />
            </button>
        </div>
    );
};

const InjectedForm = props => {
    return (
        <ElementsConsumer>
            {({stripe, elements}) => (
                <AddCard stripe={stripe} elements={elements} {...props} />
            )}
        </ElementsConsumer>
    );
}

export default InjectedForm;
