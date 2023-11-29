import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

const HEADER_MOBILE = 62;
const HEADER_DESKTOP = 72;

/**
 * Created this component to make space under the fixed header to pull the content under the header
 *
 * @param headerRef
 * @param cmsBlockLoaded
 * @returns {JSX.Element}
 * @constructor
 */
const HeaderSpace = ({ headerRef, cmsBlockLoaded }) => {
    const { isDesktopXlScreen } = useScreenSize();
    const { innerWidth } = useWindowSize();
    const [headerHeight, setHeaderHeight] = useState(isDesktopXlScreen ? HEADER_DESKTOP : HEADER_MOBILE);

    /**
     * Using here setInterval because the reference offsetHeight changes are not triggering the component re-render.
     * That causes that header height is 0 and content is on the top of the page behind the header
     */
    const headerHeightInterval = setInterval(() => {
        if (headerRef.current && headerRef.current.getBoundingClientRect().height === headerHeight) {
            clearInterval(headerHeightInterval);
            return;
        }

        if (headerRef.current && headerRef.current.getBoundingClientRect().height > 0) {
            clearInterval(headerHeightInterval);
            setHeaderHeight(headerRef.current.getBoundingClientRect().height);
        }
    }, 500);

    useEffect(() => {
        if (headerRef.current && headerRef.current.offsetHeight > 0) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [cmsBlockLoaded, headerRef]);

    useLayoutEffect(() => {
        setHeaderHeight(
            headerRef.current && headerRef.current.getBoundingClientRect().height > 0
                ? headerRef.current.getBoundingClientRect().height
                : headerHeight
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [innerWidth]);

    return <div style={{ height: headerHeight }} />;
};

HeaderSpace.propTypes = {
    headerRef: PropTypes.any,
    cmsBlockLoaded: PropTypes.bool
};

export default HeaderSpace;
