import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useArticleRichSnippet } from './useArticleRichSnippet';

const ArticleRichSnippet = () => {
    const { articleStructuredData } = useArticleRichSnippet();
    const richSnippetJSON = JSON.stringify(articleStructuredData);

    return (
        <Helmet>
            <script type="application/ld+json">{richSnippetJSON}</script>
        </Helmet>
    );
};

export default ArticleRichSnippet;
