import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useTrackingContext } from '@app/context/Tracking/tracking';

const CookieConsent = () => {
    const [, { setCookieConsent }] = useTrackingContext();
    const [cookies] = useCookies();

    /* eslint-disable react-hooks/exhaustive-deps */
    // We want the cookie value on initial page load only
    useEffect(() => {
        if (cookies.amcookie_allowed !== undefined) {
            const cookieConsent = cookies.amcookie_allowed.split(',').map(id => parseInt(id));
            setCookieConsent(cookieConsent);
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    return null;
};

export default CookieConsent;
