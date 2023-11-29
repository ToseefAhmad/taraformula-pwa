import { bool } from 'prop-types';
import React from 'react';

import classes from '@app/components/Blog/blog.module.css';
import { useScreenSize } from '@app/hooks/useScreenSize';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const HeroBlogPostShimmer = ({
    isImgPlaceholder = false,
    isDatePlaceholder = false,
    isTitlePlaceholder = false,
    isTextPlaceholder = false,
    isTagPlaceholder = false
}) => {
    const { isMobileScreen, isTabletScreen, isDesktopScreen } = useScreenSize();
    // Image placeholder
    if (isImgPlaceholder) {
        return (
            <div className={classes.imagesLoading}>
                <Shimmer width={'100%'} height={isMobileScreen ? '228px' : '450px'} />
            </div>
        );
    }
    // Date block placeholder
    if (isDatePlaceholder) {
        return (
            <div className={classes.date}>
                <Shimmer width={'100px'} height={'24px'} />
            </div>
        );
    }
    // Post title placeholder
    if (isTitlePlaceholder) {
        return isMobileScreen || isTabletScreen ? (
            <div>
                <Shimmer width={'100%'} height={'64px'} style={{ marginTop: '5px', marginBottom: '6px' }} />
            </div>
        ) : (
            <div>
                <Shimmer width={'100%'} height={'70px'} style={{ marginTop: '5px', marginBottom: '5px' }} />
                <Shimmer width={'100%'} height={'77px'} style={{ marginTop: '5px', marginBottom: '5px' }} />
            </div>
        );
    }
    // Simple text placeholder
    if (isTextPlaceholder) {
        return (
            <div className={classes.content}>
                <Shimmer width={'100%'} height={'14px'} style={{ marginTop: '5px', marginBottom: '5px' }} />
                <Shimmer width={'100%'} height={'14px'} style={{ marginTop: '5px', marginBottom: '5px' }} />
                <Shimmer width={'100%'} height={'14px'} style={{ marginTop: '5px', marginBottom: '5px' }} />
            </div>
        );
    }
    // Tag placeholder
    if (isTagPlaceholder) {
        return <Shimmer width={isDesktopScreen ? '300px' : '100px'} height={'24px'} style={{ marginTop: '10px' }} />;
    }

    return '';
};

HeroBlogPostShimmer.prototype = {
    isImgPlaceholder: bool,
    isDatePlaceholder: bool,
    isTitlePlaceholder: bool,
    isTextPlaceholder: bool,
    isTagPlaceholder: bool
};

export default HeroBlogPostShimmer;
