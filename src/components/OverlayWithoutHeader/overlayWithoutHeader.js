import React from 'react';

import classes from './overlayWithoutHeader.module.css';
import { useOverlayWithoutHeader } from './useOverlayWithoutHeader';

/**
 * Overlay without header.
 * This component creates overlay button for everything on the page except header.
 */
const OverlayWithoutHeader = () => {
    const { isOpen, close } = useOverlayWithoutHeader();
    const className = isOpen ? classes.root_active : classes.root;

    return <button className={className} onClick={close} />;
};

export default OverlayWithoutHeader;
