import React from 'react';

import classes from './overlayWithHeader.module.css';
import { useOverlayWithHeader } from './useOverlayWithHeader';

/**
 * Overlay with header.
 * This component creates overlay button for everything on the page. To have your element visible, add z-index 30 to your element.
 */
const OverlayWithHeader = () => {
    const { isOpen, close } = useOverlayWithHeader();
    const className = isOpen ? classes.root_active : classes.root;

    return <button className={className} onClick={close} />;
};

export default OverlayWithHeader;
