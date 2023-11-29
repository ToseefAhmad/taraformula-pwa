import { object } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const storage = new BrowserPersistence();

const AfterpayRedirect = () => {
    const redirectUrl = storage.getItem('afterpay_redirectUrl');

    useEffect(() => {
        window.location = redirectUrl;
    }, [redirectUrl]);

    return (
        <LoadingIndicator>
            <FormattedMessage id={'checkoutPage.redirecting'} defaultMessage={'Redirecting...'} />
        </LoadingIndicator>
    );
};

AfterpayRedirect.propTypes = {
    data: object
};

export default AfterpayRedirect;
