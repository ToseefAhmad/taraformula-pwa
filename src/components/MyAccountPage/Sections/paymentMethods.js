import React from 'react';
import { FormattedMessage } from 'react-intl';

import SavedCard from '@app/components/Stripe/SavedCards/savedCard';
import { useStripeSavedCardsPage } from '@app/talons/Stripe/useStripeSavedCardsPage';
import Link from '@magento/venia-ui/lib/components/Link';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './myAccountSection.module.css';

const PaymentMethods = () => {
    const {
        savedCards,
        isFetching,
        nameOnCard,
        handleDelete,
        deleteCardError,
        deleteSavedCardLoading,
        hasDeleteCardError
    } = useStripeSavedCardsPage();

    const savedCardComponents = savedCards
        ? savedCards.slice(0, 2).map((savedCard, i) => {
              return isFetching ? (
                  <Shimmer width="100%" height="119px" key={i} />
              ) : (
                  <SavedCard
                      savedCard={savedCard}
                      key={i}
                      nameOnCard={nameOnCard}
                      handleDelete={handleDelete}
                      deleteCardError={deleteCardError}
                      deleteSavedCardLoading={deleteSavedCardLoading}
                      hasDeleteCardError={hasDeleteCardError}
                      isPaymentMethodsPage={false}
                  />
              );
          })
        : null;

    return savedCards && savedCards.length ? (
        <div className={classes.root}>
            <div className={classes.heading}>
                <h4 className={classes.title}>
                    <FormattedMessage id={'paymentMethods.sectionTitleText'} defaultMessage={'Payment Methods'} />
                </h4>
                <Link className={classes.link} to={'/payment-methods'}>
                    <FormattedMessage id={'paymentMethods.sectionLinkText'} defaultMessage={'Manage Payments'} />
                </Link>
            </div>
            <div className={classes.content}>{savedCardComponents}</div>
        </div>
    ) : null;
};

export default PaymentMethods;
