import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useSitelinksSearchBoxRichSnippet } from './useSitelinksSearchBoxRichSnippet';

const SitelinksSearchBoxRichSnippet = () => {
    const { sitelinksSearchBoxStructuredData } = useSitelinksSearchBoxRichSnippet();
    const richSnippetJSON = JSON.stringify(sitelinksSearchBoxStructuredData);

    return (
        <Helmet>
            <script type="application/ld+json">{richSnippetJSON}</script>
        </Helmet>
    );
};

export default SitelinksSearchBoxRichSnippet;
