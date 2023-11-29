import { useQuery } from '@apollo/client';
import React from 'react';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import { GET_TERMS_AND_CONDITIONS } from './termsAndConditions.gql';

const TermsAndConditions = () => {
    const { loading, error, data } = useQuery(GET_TERMS_AND_CONDITIONS);

    if (!data) {
        if (loading) {
            return <LoadingIndicator />;
        }
        if (error) {
            return <ErrorView message={error.message} />;
        }

        return <ErrorView message="Terms and conditions are not available" />;
    }

    const items = data.checkoutAgreements;

    if (!Array.isArray(items) || !items.length) {
        return <ErrorView message="Terms and conditions are not available" />;
    }

    const checkoutAgreement = items.find(() => true);

    return <RichContent html={checkoutAgreement.content} />;
};

export default TermsAndConditions;
