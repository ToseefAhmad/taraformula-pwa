import { bool, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './navigation.module.css';

const PreviousNextNavigation = ({ links, left = false, loading }) => {
    if (!links || links.length <= 0) {
        return null;
    }

    const lastLink = links[0];
    const title = left ? (
        <FormattedMessage id="blog.previous" defaultMessage="Previous" />
    ) : (
        <FormattedMessage id="blog.next" defaultMessage="Next" />
    );

    return (
        <div className={left ? classes.navigationLeft : classes.navigationRight}>
            {loading && links ? (
                <div>
                    <Shimmer width={'100%'} height={'24px'} />
                    <Shimmer width={'100%'} height={'48px'} style={{ marginTop: '5px' }} />
                </div>
            ) : (
                <Link className={classes.link} to={lastLink.url_key} title={lastLink.title}>
                    <span className={classes.title}>{title}</span>
                    <span className={classes.text}>{lastLink.title}</span>
                </Link>
            )}
        </div>
    );
};
PreviousNextNavigation.propTypes = {
    left: bool,
    links: shape({
        url_key: string,
        title: string
    }),
    loading: bool
};

export default PreviousNextNavigation;
