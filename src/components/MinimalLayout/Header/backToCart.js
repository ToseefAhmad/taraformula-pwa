import React from 'react';
import { FormattedMessage } from 'react-intl';

import { GET_ITEM_COUNT_QUERY } from '@app/components/overrides/Header/cartTrigger.gql';
import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import classes from './backToCart.module.css';

const BackToCart = () => {
    const { handleLinkClick } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });
    return (
        <button className={classes.link} onClick={handleLinkClick}>
            <FormattedMessage id="minimalHeader.backToCart" defaultMessage="< Shopping bag" />
        </button>
    );
};

export default BackToCart;
