import React from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './featuredPosts.module.css';

const FeaturedPostsShimmer = () => {
    const { isMobileScreen, isTabletScreen, isDesktopScreen } = useScreenSize();
    const imgHeight = isMobileScreen ? '247px' : '228px';
    const imgPlaceholder = <Shimmer width={'100%'} height={imgHeight} style={{ minWidth: '215px' }} />;
    const categoryPlaceholder = (
        <Shimmer width={'60px'} height={'16px'} style={{ marginTop: '3px', marginBottom: '3px' }} />
    );
    const textPlaceholder = (
        <div>
            <Shimmer
                width={'100px'}
                height={isMobileScreen ? '20px' : '16px'}
                style={{ marginTop: isMobileScreen ? '12px' : '5px' }}
            />
            <Shimmer width={'100%'} height={'27px'} style={{ marginTop: '8px' }} />
            <Shimmer width={'100%'} height={'27px'} style={{ marginTop: '2px' }} />
        </div>
    );
    return (
        <div className={classes.carouselLoading}>
            <div>
                {categoryPlaceholder}
                <Shimmer
                    width={isMobileScreen && !isTabletScreen ? '70%' : '100%'}
                    height={imgHeight}
                    style={{ minWidth: '215px', marginRight: isMobileScreen && !isTabletScreen ? '11px' : '0' }}
                />
                {textPlaceholder}
            </div>
            <div>
                {categoryPlaceholder}
                <Shimmer
                    width={isMobileScreen && !isTabletScreen ? '27%' : '100%'}
                    height={imgHeight}
                    style={{ minWidth: '50px' }}
                />
                {textPlaceholder}
            </div>
            {(isDesktopScreen || isTabletScreen) && (
                <div>
                    {categoryPlaceholder}
                    {imgPlaceholder}
                    {textPlaceholder}
                </div>
            )}
            {isDesktopScreen && (
                <div>
                    {categoryPlaceholder}
                    {imgPlaceholder}
                    {textPlaceholder}
                </div>
            )}
        </div>
    );
};

export default FeaturedPostsShimmer;
