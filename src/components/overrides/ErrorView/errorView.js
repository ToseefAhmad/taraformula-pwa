import React from 'react';

import { useCmsPage } from '@app/overrides/peregrine/talons/Cms/useCmsPage';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './errorView.module.css';

const identifier = 'no-route';

const ErrorView = () => {
    const { cmsPage, loading } = useCmsPage({ identifier });

    if (!cmsPage) {
        return null;
    }

    const { content } = cmsPage;

    return (
        <div className={classes.root}>
            {loading ? (
                <div className={classes.shimmerRoot}>
                    <Shimmer classes={{ root_rectangle: classes.shimmerHeading }} />
                    <Shimmer classes={{ root_rectangle: classes.shimmerSubtitle }} />
                    <Shimmer classes={{ root_rectangle: classes.shimmerButton }} />
                </div>
            ) : (
                <RichContent html={content} />
            )}
        </div>
    );
};

export default ErrorView;
