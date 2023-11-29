import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './product.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getStoreConfigData - Fetches storeConfig product url suffix using a server query
 * @param {GraphQLAST}  props.queries.getProductQuery - Fetches product using a server query
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getProductDetailQuery } = operations;
    const { pathname } = useLocation();
    const { trackProductView, trackProductDetails, getProductCategories } = useTracking();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { storeConfigData } = useStoreConfigContext();

    const productUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const slug = pathname.split('/').pop();
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const { error, loading, data } = useQuery(getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey
        },
        onCompleted: data => {
            const product = data.products && data.products.items.find(item => item.url_key === urlKey);
            if (product) {
                trackProductDetails({
                    currencyCode: product.price_range.maximum_price.final_price.currency,
                    product: {
                        name: product.name,
                        sku: product.sku,
                        price: product.price_range.maximum_price.final_price.value,
                        quantity: 1,
                        category: getProductCategories(product.categories)
                    }
                });
            }
        }
    });

    const isBackgroundLoading = !!data && loading;

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // Display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(item => item.url_key === urlKey);

        if (!product) {
            return null;
        }

        return mapProduct(product);
    }, [data, mapProduct, urlKey]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        if (product) {
            trackProductView({
                sku: product.sku,
                price: product.price_range.maximum_price.final_price.value,
                currencyCode: product.price_range.maximum_price.final_price.currency,
                name: product.name,
                categories: product.categories.map(cat => cat.name)
            });
        }
    }, [trackProductView, product]);

    return {
        error,
        loading,
        product
    };
};
