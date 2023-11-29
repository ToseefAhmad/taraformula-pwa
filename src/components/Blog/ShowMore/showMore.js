import { func, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';

import classes from './showMore.module.css';

const ShowMore = ({ pageControl: { currentPage, setPage, totalPages }, title }) => {
    if (totalPages <= 1) {
        return <div className={classes.showMorePlaceHolder} />;
    }

    return (
        totalPages > 1 && (
            <div className={classes.pagination}>
                <Button
                    priority="primary"
                    fill="transparent"
                    onClick={() => {
                        setPage(currentPage + 1);
                    }}
                >
                    {title}
                </Button>
            </div>
        )
    );
};
ShowMore.propTypes = {
    title: string,
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired
};

ShowMore.defaultProps = {
    title: <FormattedMessage id="global.showMore" defaultMessage="Load More" />
};

export default ShowMore;
