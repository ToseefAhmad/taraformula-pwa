import { shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { Bag as ShoppingCartIcon } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';
import defaultClasses from './cartTrigger.module.css';
import { useCartTrigger } from './useCartTrigger';

const CartTrigger = props => {
    const { handleLinkClick, itemCount, hideCartTrigger } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const buttonAriaLabel = formatMessage(
        {
            id: 'cartTrigger.ariaLabel',
            defaultMessage: 'Toggle mini cart. You have {count} items in your cart.'
        },
        { count: itemCount }
    );
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;

    const maybeItemCounter = itemCount ? <span className={classes.counter}>{itemCountDisplay}</span> : null;
    const iconClass = itemCount ? classes.icon : classes.icon_empty;

    return hideCartTrigger ? null : (
        // Because this button behaves differently on desktop and mobile
        // We render two buttons that differ only in their click handler
        // And control which one displays via CSS.
        <>
            <div className={classes.triggerContainer}>
                <button aria-label={buttonAriaLabel} className={classes.trigger} onClick={handleLinkClick}>
                    <Icon src={ShoppingCartIcon} classes={{ icon: iconClass }} />
                    {maybeItemCounter}
                </button>
            </div>
            <button aria-label={buttonAriaLabel} className={classes.link} onClick={handleLinkClick}>
                <Icon src={ShoppingCartIcon} />
                {maybeItemCounter}
            </button>
        </>
    );
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        counter: string,
        link: string,
        openIndicator: string,
        root: string,
        trigger: string,
        triggerContainer: string
    })
};
