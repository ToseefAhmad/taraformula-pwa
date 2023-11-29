import React from 'react';

import { Meta } from '@magento/venia-ui/lib/components/Head';

// Facebook tag return
const FacebookTag = props => {
    if (props.location.includes('.qa')) {
        return <Meta name="facebook-domain-verification" content="9jwywjql7vt5tlc13p0wb9s12vo1id" />;
    } else if (props.location.includes('.com.kw')) {
        return <Meta name="facebook-domain-verification" content="wlg40l94825k1lnizf17zbca6jw6f5" />;
    } else if (props.location.includes('.ae')) {
        return <Meta name="facebook-domain-verification" content="rs980n2tm4b2e1smkkd9nfgqadfndr" />;
    } else {
        return null;
    }
};

export default FacebookTag;
