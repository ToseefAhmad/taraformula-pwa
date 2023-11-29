import { string } from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { Redirect } from 'react-router-dom';

import Hreflangs from '@app/components/Hreflangs';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta, Link } from '@magento/venia-ui/lib/components/Head';
import ProductFullDetail from '@magento/venia-ui/lib/components/ProductFullDetail';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';

import ProductShimmer from './product.shimmer';
import { useProduct } from './useProduct';

/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */

const Product = props => {
    const { __typename: productType } = props;
    const talonProps = useProduct({
        mapProduct
    });

    const { error, loading, product } = talonProps;
    const pageTitle = useMemo(() => formatPageTitle(product), [product]);

    if (error && !product) return <ErrorView />;

    // MB-21732 If done loading but still no product probably product is disabled for that store view
    if (!loading && !product) return <Redirect to={'/404.html'} />;

    if (loading || !product) return <ProductShimmer productType={productType} />;
    return (
        <Fragment>
            <Link rel="canonical" href={product.canonical_full_url} />
            <StoreTitle>{pageTitle}</StoreTitle>
            <Meta name="description" content={product.meta_description} />
            <Hreflangs hreflangs={(product && product.hreflangs) || []} />
            <ProductFullDetail product={product} />
        </Fragment>
    );
};

const formatPageTitle = product => {
    if (product) {
        const subTitle = product.influence_type_label ? product.influence_type_label : '';
        return product.tag_line ? `${product.tag_line} ${product.name}` : `${subTitle} ${product.name}`;
    } else {
        return null;
    }
};

Product.propTypes = {
    __typename: string.isRequired
};

export default Product;
