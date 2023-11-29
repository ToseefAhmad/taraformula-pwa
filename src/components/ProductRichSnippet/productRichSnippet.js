import { object } from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useProductRichSnippet } from './useProductRichSnippet';

const ProductRichSnippet = props => {
    const { product } = props;
    const { productStructuredData } = useProductRichSnippet({ product: { ...product } });
    const richSnippetJSON = JSON.stringify(productStructuredData);

    return (
        <Helmet>
            <script type="application/ld+json">{richSnippetJSON}</script>
        </Helmet>
    );
};

ProductRichSnippet.propTypes = {
    product: object
};

export default ProductRichSnippet;
