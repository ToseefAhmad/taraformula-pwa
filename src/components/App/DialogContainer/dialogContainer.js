import React from 'react';

import GdprPopUp from '@app/components/GdprPopUp';
import { useGdprPopUp } from '@app/components/GdprPopUp/useGdprPopUp';
import GeoIpPopUp from '@app/components/GeoIpPopUp';
import { useGeoIpPopUp } from '@app/components/GeoIpPopUp/useGeoIpPopUp';
import { useScreenSize } from '@app/hooks/useScreenSize';

/**
 * Render any independent dialogs
 */
const DialogContainer = () => {
    const { isHidden: geoIpPopupIsHidden } = useGeoIpPopUp();
    const { isHidden: cookiePopupIsHidden } = useGdprPopUp();
    const { isTrueMobileScreen } = useScreenSize();

    if (!geoIpPopupIsHidden || (!cookiePopupIsHidden && isTrueMobileScreen)) {
        document.documentElement.dataset.scrollLock = 'true';
    } else {
        document.documentElement.dataset.scrollLock = 'false';
    }

    return (
        <>
            <GdprPopUp />
            <GeoIpPopUp />
        </>
    );
};

export default DialogContainer;
