import { number, shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import Hreflangs from '@app/components/Hreflangs';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta, Link } from '@magento/venia-ui/lib/components/Head';
import { GET_PAGE_SIZE } from '@magento/venia-ui/lib/RootComponents/Category/category.gql';

import defaultClasses from './category.module.css';
import CategoryContent from './categoryContent';
import { useCategory } from './useCategory';

const Category = props => {
    const { id } = props;

    const talonProps = useCategory({
        id,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });

    const {
        error,
        metaDescription,
        metaTitle,
        loading,
        categoryData,
        initialProductsData,
        additionalProducts,
        pageControl,
        sortProps,
        pageSize,
        canonicalUrlFull
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    if (!categoryData) {
        if (error && pageControl.currentPage === 1) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }

    return (
        <Fragment>
            <Link rel="canonical" href={canonicalUrlFull} />
            <StoreTitle>{metaTitle}</StoreTitle>
            <Meta name="description" content={metaDescription} />
            <Hreflangs hreflangs={(categoryData && categoryData.category.hreflangs) || []} />
            <CategoryContent
                categoryId={id}
                classes={classes}
                data={categoryData}
                initialProductsData={initialProductsData}
                additionalProducts={additionalProducts}
                isLoading={loading}
                pageControl={pageControl}
                sortProps={sortProps}
                pageSize={pageSize}
                totalPages={pageControl.totalPages}
            />
        </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    id: number
};

Category.defaultProps = {
    id: 3
};

export default Category;
