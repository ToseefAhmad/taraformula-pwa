import {useStripeSavedCardsPage} from '@magebit/pwa-studio-stripe/src/talons/useStripeSavedCardsPage';
import React, {useEffect} from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import {FormattedMessage, useIntl} from 'react-intl';
const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

import {useToasts} from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './savedCards.module.css';

const SavedCards = () => {

    const {
        handleDelete,
        deleteSavedCardLoading,
        savedCards,
        deleteCardError,
        hasDeleteCardError
    } = useStripeSavedCardsPage();

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasDeleteCardError) {
            const message =
                deleteCardError && deleteCardError.message
                    ? deleteCardError.message
                    : formatMessage({
                        id: 'stripe.deleteCardError',
                        defaultMessage: 'We were unable to delete your saved card. Please, try again!'
                    });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(deleteCardError);
            }
        }
    }, [addToast, deleteCardError, formatMessage, hasDeleteCardError]);

    if(deleteSavedCardLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'stripe.deletingCard'}
                    defaultMessage={'Deleting Card Information'}
                />
            </LoadingIndicator>
        )
    }

    return savedCards.length ? (
        <div className={classes.root}>
            {savedCards.map((savedCard, i) => {
                return (
                    <div className={classes.savedCard} key={i}>
                        <div className={classes.brand}>{savedCard.brand}</div>
                        <div className={classes.last4}>**** {savedCard.last4}</div>
                        <div className={classes.expiry}>{savedCard.exp_month}/{savedCard.exp_year}</div>
                        <div className={classes.actions}>
                            <button
                                className={classes.deleteButton}
                                aria-label={formatMessage({
                                    id: 'global.delete',
                                    defaultMessage: 'Delete'
                                })}
                                onClick={() => {
                                    handleDelete(savedCard)
                                }}
                            >
                                <FormattedMessage
                                    id={'global.delete'}
                                    defaultMessage={'Delete'}
                                />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    ) : (
        <FormattedMessage
            id={'stripe.noSavedCards'}
            defaultMessage={'You do not have any saved cards yet.'}
        />
    );
};

export default SavedCards;
