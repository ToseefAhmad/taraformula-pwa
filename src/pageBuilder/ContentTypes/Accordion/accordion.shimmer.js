import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const AccordionShimmer = () => {
    return <Shimmer aria-live="polite" aria-busy="true" width="100%" height={20} />;
};

export default AccordionShimmer;
