import { array } from 'prop-types';
import React from 'react';

import { Link } from '@magento/venia-ui/lib/components/Head';

const Hreflangs = ({ hreflangs }) => {
    // Remove global and save it for x-default
    const xDefaultIndex = hreflangs.findIndex(hreflang => hreflang.lang === 'en-GL');
    const xDefaultUrl = hreflangs[xDefaultIndex] && hreflangs[xDefaultIndex].url;
    hreflangs = hreflangs.filter(item => item.lang !== 'en-GL');

    const result = hreflangs.map(hreflang => (
        <Link key={hreflang.lang} rel="alternate" hreflang={hreflang.lang} href={hreflang.url} />
    ));

    // Adding xDefault. It's always en-US
    // Haven't found a way to add 2 links with same href. en-US above and x-default below have the same href
    // So using vanilla javascript here
    if (xDefaultIndex !== -1) {
        if (!document.querySelectorAll('link[hreflang="x-default"]').length) {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = 'x-default';
            link.href = xDefaultUrl || hreflangs[0].url;
            document.head.appendChild(link);
        }
    }

    return result;
};

Hreflangs.propTypes = {
    hreflangs: array
};

Hreflangs.defaultProps = {
    hreflangs: []
};

export default Hreflangs;
