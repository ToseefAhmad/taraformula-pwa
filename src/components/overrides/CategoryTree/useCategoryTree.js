import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './categoryTree.gql';

/**
 * @typedef {object} CategoryNode
 * @prop {object} category - category data
 * @prop {boolean} isLeaf - true if the category has no children
 */

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render a CategoryTree component.
 *
 * @param {object} props
 * @param {number} props.categoryId - category id for this node
 * @param {DocumentNode} props.query - GraphQL query
 * @param {function} props.updateCategories - bound action creator
 * @return {{ childCategories: Map<number, CategoryNode> }}
 */
const useCategoryTree = props => {
    const { categoryId, updateCategories } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getNavigationMenuQuery } = operations;

    const [runQuery, queryResult] = useLazyQuery(getNavigationMenuQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { data } = queryResult;
    const { storeConfigData: categoryUrlData } = useStoreConfigContext();

    const categoryUrlSuffix = useMemo(() => {
        if (categoryUrlData) {
            return categoryUrlData.storeConfig.category_url_suffix;
        }
    }, [categoryUrlData]);
    // Fetch categories
    useEffect(() => {
        if (categoryId != null) {
            runQuery({ variables: { id: categoryId } });
        }
    }, [categoryId, runQuery]);

    // Update redux with fetched categories
    useEffect(() => {
        if (data && data.category) {
            updateCategories(data.category);
        }
    }, [data, updateCategories]);

    const rootCategory = data && data.category;

    const { children = [] } = rootCategory || {};

    const childCategories = useMemo(() => {
        const childCategories = new Map();

        // Add the root category when appropriate.
        if (rootCategory && rootCategory.include_in_menu && rootCategory.url_path) {
            childCategories.set(rootCategory.id, {
                category: rootCategory,
                isLeaf: true
            });
        }

        children.map(category => {
            if (category.include_in_menu) {
                const isLeaf = !parseInt(category.children_count);
                childCategories.set(category.id, { category, isLeaf });
            }
        });

        return childCategories;
    }, [children, rootCategory]);

    return { childCategories, data, categoryUrlSuffix };
};

export default useCategoryTree;
