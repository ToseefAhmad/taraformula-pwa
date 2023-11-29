import React, { useEffect } from 'react';

import useTracking from '@app/hooks/useTracking/useTracking';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const GTMVariables = () => {
    const [{ isSignedIn, currentUser }] = useUserContext();
    const { trackUserInitialized } = useTracking();

    useEffect(() => {
        if (!isSignedIn || currentUser.email) {
            trackUserInitialized({
                id: currentUser.id,
                email: currentUser.email
            });
        }
    }, [isSignedIn, currentUser.email, currentUser.id, trackUserInitialized]);

    return (
        <>
            <div id="gtm-user-id" style={{ display: 'none' }}>
                {currentUser.id}
            </div>
            <div id="gtm-user-email" style={{ display: 'none' }}>
                {currentUser.email}
            </div>
        </>
    );
};

export default GTMVariables;
