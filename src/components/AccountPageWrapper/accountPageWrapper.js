import { node, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Close as IconClose } from '@app/components/Icons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useStripeContext } from '@app/talons/Stripe/stripeContextProvider';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './accountPageWrapper.module.css';
import { useAccountPageWrapper } from './useAccountPageWrapper.js';

const ACCOUNT_MENU_ITEMS = [
    {
        name: 'My Account',
        id: 'accountPageWrapper.account',
        url: '/account'
    },
    {
        name: 'Account Information',
        id: 'accountPageWrapper.information',
        url: '/account-information'
    },
    {
        name: 'Address Book',
        id: 'accountPageWrapper.addressBook',
        url: '/address-book'
    },
    {
        name: 'My Orders',
        id: 'accountPageWrapper.orders',
        url: '/order-history'
    }
];

const AccountPageWrapper = ({ children, pageTitle, path }) => {
    const { stripeConfig } = useStripeContext();
    const { handleSignOut } = useAccountPageWrapper();
    const { isMobileScreen, isTabletScreen } = useScreenSize();
    const { trackMyAccount } = useTracking();

    const accountMenuItems = ACCOUNT_MENU_ITEMS.map(item => {
        return (
            <li key={item.id}>
                <Link
                    className={item.url === path ? classes.menuItemActive : classes.menuItem}
                    key={item.id}
                    to={item.url}
                >
                    <FormattedMessage id={item.id} defaultMessage={item.name} />
                </Link>
            </li>
        );
    });
    const accountMenu = (
        <ul key={'accountMenu'}>
            {accountMenuItems}
            <li key={'accountPageWrapper.signOut'}>
                <button onClick={handleSignOut} className={classes.signOut}>
                    <FormattedMessage id="accountPageWrapper.signOut" defaultMessage="Sign Out" />
                </button>
            </li>
        </ul>
    );

    const [isActive, setIsActive] = useState(false);
    const accordionContent = isActive ? [accountMenu] : null;
    const closeIcon = isActive ? <Icon classes={{ icon: classes.icon }} src={IconClose} /> : null;

    useEffect(() => {
        if (isTabletScreen) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [isTabletScreen]);

    const accountMenuBasedOnScreenSize =
        isMobileScreen && !isTabletScreen ? (
            <div className={!isActive ? classes.menuClosed : null}>
                <button
                    className={classes.menuTitleWrapper}
                    onClick={() => {
                        setIsActive(!isActive);
                        trackMyAccount();
                    }}
                >
                    <span className={classes.menuTitle}>
                        <FormattedMessage id="accountPageWrapper.menuTitle" defaultMessage="Menu" />
                    </span>
                    {closeIcon}
                </button>
                {accordionContent}
            </div>
        ) : (
            [accountMenu]
        );

    if (stripeConfig && stripeConfig.stripe_cc_enabled === '1') {
        accountMenuItems.splice(
            3,
            0,
            <li key="accountPageWrapper.payment">
                <Link
                    className={'/payment-methods' === path ? classes.menuItemActive : classes.menuItem}
                    key="accountPageWrapper.payment"
                    to="/payment-methods"
                >
                    <FormattedMessage id="accountPageWrapper.payment" defaultMessage="Payment Methods" />
                </Link>
            </li>
        );
    }

    return (
        <div className={classes.root}>
            <StoreTitle>{pageTitle}</StoreTitle>
            <h2 className={classes.title}>{pageTitle}</h2>
            <div className={classes.menu}>{accountMenuBasedOnScreenSize}</div>
            <div className={classes.content}>{children}</div>
        </div>
    );
};

export default AccountPageWrapper;

AccountPageWrapper.propTypes = {
    children: node,
    pageTitle: string,
    path: string
};
