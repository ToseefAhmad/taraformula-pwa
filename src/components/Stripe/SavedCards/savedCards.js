import { bool, func } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ThinPlus } from '@app/components/Icons';
import SavedCard from '@app/components/Stripe/SavedCards/savedCard';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStripeSavedCardsPage } from '@app/talons/Stripe/useStripeSavedCardsPage';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import AddCard from './addCard';
import classes from './savedCards.module.css';

const SavedCards = ({ handleAdd, handleCancel, isDialogOpen }) => {
    const {
        savedCards: stripeCards,
        isFetching,
        nameOnCard,
        handleDelete,
        handleConfirmDelete,
        handleCancelDelete,
        confirmDeleteCardId,
        deleteSavedCardLoading
    } = useStripeSavedCardsPage();

    const { formatMessage } = useIntl();
    const { isMiniTabletScreen, isTrueMobileScreen } = useScreenSize();

    const addCardText = formatMessage({
        id: 'savedCards.addCardText',
        defaultMessage: 'Add Payment Method'
    });

    const title = !isFetching ? (
        <h4 className={classes.title}>
            <FormattedMessage id={'savedCards.titleText'} defaultMessage={'Payments'} />
        </h4>
    ) : (
        <Shimmer width="200px" height="32px" classes={{ root_rectangle: classes.titleShimmer }} />
    );

    const addCardLink = !isFetching ? (
        <LinkButton className={classes.addCardLink} onClick={handleAdd}>
            {addCardText}
        </LinkButton>
    ) : (
        <Shimmer width="187px" height="24px" classes={{ root_rectangle: classes.addCardLinkShimmer }} />
    );

    const addCardButton = !isFetching ? (
        <LinkButton className={classes.addButton} key="addAddressButton" onClick={handleAdd}>
            <div className={classes.addButtonContent}>
                <Icon classes={{ root: classes.addButtonIcon }} src={ThinPlus} />
                <span className={classes.addText}>{addCardText}</span>
            </div>
        </LinkButton>
    ) : (
        <Shimmer width="100%" classes={{ root_rectangle: classes.addButtonShimmer }} />
    );

    const savedCards =
        stripeCards &&
        stripeCards.map((stripeCard, i) => {
            const isConfirmingDelete = confirmDeleteCardId === stripeCard.id;

            return isFetching ? (
                <Shimmer width="100%" key={i} classes={{ root_rectangle: classes.cardShimmer }} />
            ) : (
                <Fragment key={i}>
                    <SavedCard
                        savedCard={stripeCard}
                        key={i}
                        nameOnCard={nameOnCard}
                        handleDelete={handleDelete}
                        onConfirmDelete={handleConfirmDelete}
                        onCancelDelete={handleCancelDelete}
                        isConfirmingDelete={isConfirmingDelete}
                        isSavedCardsPage={false}
                    />
                </Fragment>
            );
        });

    if (deleteSavedCardLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'savedCards.deletingCard'} defaultMessage={'Deleting Card Information'} />
            </LoadingIndicator>
        );
    }

    return savedCards && savedCards.length && !isDialogOpen ? (
        <div className={classes.root}>
            <div className={classes.heading}>
                {title}
                {(savedCards.length >= 2 || isMiniTabletScreen) && addCardLink}
            </div>
            <div className={classes.content}>
                {savedCards}
                {((savedCards.length < 2 && !isMiniTabletScreen) || isTrueMobileScreen) && addCardButton}
            </div>
        </div>
    ) : (
        <AddCard isCancelAvailable={!!savedCards.length} handleCancel={handleCancel} />
    );
};

export default SavedCards;

SavedCards.propTypes = {
    handleAdd: func,
    handleCancel: func,
    isDialogOpen: bool
};
