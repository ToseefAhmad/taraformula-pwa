import { array, bool, func, number, object, shape, string } from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';

import Gallery, { GalleryShimmer } from '@app/components/overrides/Gallery';
import TopBlockShimmer from '@app/RootComponents/Category/Shimmers/topBlockShimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import defaultClasses from './category.module.css';
import NoProductsFound from './NoProductsFound';
import { useCategoryContent } from './useCategoryContent';

const CategoryContent = props => {
    const {
        categoryId,
        data,
        initialProductsData,
        additionalProducts,
        isLoading,
        pageControl,
        pageSize,
        totalPages
    } = props;

    const showMoreRef = useRef();
    const talonProps = useCategoryContent({
        categoryId,
        data,
        initialProductsData,
        additionalProducts,
        currentPage: pageControl.currentPage,
        pageSize,
        setPage: pageControl.setPage,
        showMoreRef
    });

    const { categoryDescription, items, totalPagesFromData } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const [noProductsFound, setNoProductsFound] = useState(false);
    useEffect(() => setNoProductsFound(!totalPagesFromData && !isLoading), [isLoading, totalPagesFromData]);

    const categoryDescriptionElement =
        !isLoading && categoryDescription ? (
            <RichContent html={categoryDescription} classes={{ root: classes.categoryDescriptionRoot }} />
        ) : isLoading ? (
            <TopBlockShimmer />
        ) : null;

    const content = useMemo(() => {
        if (noProductsFound) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? <Gallery items={items} /> : <GalleryShimmer items={items} />;

        return (
            <Fragment>
                <section className={classes.gallery}>{gallery}</section>
            </Fragment>
        );
    }, [categoryId, classes.gallery, items, noProductsFound, totalPagesFromData]);

    const cmsBlockId =
        data && data.category ? (data.category.url_path ? 'cat-bottom-banner-' + data.category.url_path : null) : null;

    const catBottomContent = cmsBlockId && (
        <CmsBlock identifiers={cmsBlockId} classes={{ root: classes.bannerBlock }} />
    );

    return (
        <Fragment>
            <article className={classes.root}>
                {!noProductsFound && <div className={classes.banner}>{categoryDescriptionElement}</div>}
                <div className={classes.contentWrapper}>
                    <div className={classes.categoryContent}>
                        {content}
                        {pageControl.currentPage < totalPages && <div ref={showMoreRef} />}
                    </div>
                </div>
            </article>
            {!noProductsFound && <div className={classes.bottomBanner}>{catBottomContent}</div>}
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        banner: string,
        categoryContent: string,
        bottomBanner: string
    }),
    // SortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    categoryId: number,
    data: object,
    initialProductsData: array,
    additionalProducts: array,
    isLoading: bool,
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }),
    pageSize: number,
    totalPages: number
};
