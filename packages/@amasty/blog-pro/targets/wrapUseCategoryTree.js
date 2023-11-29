import { useNavLink } from '@amasty/blog-pro/src/talons/useNavLink';
import { useMemo } from 'react';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Navigation/navigation.gql';
import { useQuery } from '@apollo/client';

const wrapUseCategoryTree = original => props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getRootCategoryId } = operations;

    const { label, isEnabled, urlKey } = useNavLink();

    const defaultReturnData = original(props);

    const { data: getRootCategoryData } = useQuery(getRootCategoryId);

    const rootCategoryId = useMemo(() => {
        if (getRootCategoryData) {
            return getRootCategoryData.storeConfig.root_category_id;
        }
    }, [getRootCategoryData]);

    const { childCategories, data } = defaultReturnData || {};
    const parentCategory = data && data.category;
    const { id } = parentCategory || {};
    const isTopLevel = id === rootCategoryId;

    const categories = useMemo(() => {
        if (
            !isEnabled ||
            !isTopLevel ||
            !childCategories ||
            !childCategories.size
        ) {
            return childCategories;
        }

        const children = new Map(childCategories);
        const randomId = Math.floor(Math.random() * 1000000);

        const category = {
            children_count: '0',
            id: randomId,
            include_in_menu: 1,
            position: 0,
            name: label || '',
            url_path: urlKey,
            url_suffix: ''
        };

        children.set(randomId, {
            category,
            isLeaf: true
        });

        return children;
    }, [childCategories, label, isEnabled, urlKey, isTopLevel]);

    return {
        ...defaultReturnData,
        childCategories: categories
    };
};

export default wrapUseCategoryTree;
