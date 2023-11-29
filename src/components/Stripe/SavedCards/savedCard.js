import { bool, number, object, func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';

import classes from './savedCard.module.css';

const SavedCard = ({
    savedCard,
    nameOnCard,
    handleDelete,
    onConfirmDelete,
    onCancelDelete,
    isConfirmingDelete,
    isPaymentMethodsPage
}) => {
    const { formatMessage } = useIntl();

    const confirmDeleteButtonClasses = {
        root_normalPriorityNegative: classes.confirmDeleteButton
    };
    const cancelDeleteButtonClasses = {
        root_lowPriority: classes.cancelDeleteButton
    };

    const deleteButton = isPaymentMethodsPage && (
        <div className={classes.actions}>
            <Button
                aria-label={formatMessage({
                    id: 'global.delete',
                    defaultMessage: 'Delete'
                })}
                onClick={() => {
                    handleDelete(savedCard);
                }}
                priority="secondary"
                fill="outline"
            >
                <FormattedMessage id={'global.remove'} defaultMessage={'Remove'} />
            </Button>
        </div>
    );

    const maybeConfirmingDeleteOverlay = isConfirmingDelete && (
        <div className={classes.confirmDeleteContainer}>
            <Button
                classes={confirmDeleteButtonClasses}
                priority="normal"
                type="button"
                negative={true}
                onClick={onConfirmDelete}
            >
                <FormattedMessage id={'global.remove'} defaultMessage={'Remove'} />
            </Button>
            <Button classes={cancelDeleteButtonClasses} priority="low" type="button" onClick={onCancelDelete}>
                <FormattedMessage id={'global.cancel'} defaultMessage={'Cancel'} />
            </Button>
        </div>
    );

    return (
        <div className={classes.root}>
            <dl className={classes.content}>
                <dd>
                    <span className={classes.brand}>{nameOnCard.firstname}</span> <span>{nameOnCard.lastname}</span>
                </dd>
                <dd>
                    <span className={classes.brand}>{savedCard.brand}</span> <span>****</span>
                    <span>{savedCard.last4}</span>
                </dd>
                <dd>
                    <span className={classes.expire}>
                        <FormattedMessage id={'savedCards.expiryText'} defaultMessage={'Exp.'} />
                    </span>{' '}
                    <span>
                        {savedCard.exp_month}.{savedCard.exp_year}
                    </span>
                </dd>
            </dl>
            {maybeConfirmingDeleteOverlay}
            {deleteButton}
        </div>
    );
};

export default SavedCard;

SavedCard.propTypes = {
    savedCard: object,
    nameOnCard: shape({
        firstname: string,
        lastname: string
    }),
    key: number,
    handleDelete: func,
    deleteSavedCardLoading: bool,
    deleteCardError: object,
    hasDeleteCardError: bool,
    isPaymentMethodsPage: bool,
    onConfirmDelete: func,
    onCancelDelete: func,
    isConfirmingDelete: bool
};

SavedCard.defaultProps = {
    isPaymentMethodsPage: true
};
