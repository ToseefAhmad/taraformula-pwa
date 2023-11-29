import { shape, string } from 'prop-types';
import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Gallery, { GalleryShimmer } from '../Gallery';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import ProductSort, { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer';

import defaultClasses from './searchPage.module.css';

const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));
const FilterSidebar = React.lazy(() => import('@magento/venia-ui/lib/components/FilterSidebar'));

const SearchPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useSearchPage();
    const { data, error, filters, loading, pageControl, searchCategory, searchTerm, sortProps } = talonProps;

    const { formatMessage } = useIntl();
    const [currentSort] = sortProps;

    const noResults = data && data.products.items.length === 0;

    const searchContentClass = !noResults ? classes.searchContent : classes.searchContentError;

    const content = useMemo(() => {
        if (loading && !noResults) {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <GalleryShimmer
                            classes={{
                                items: classes.items
                            }}
                            items={Array.from({ length: 6 }).fill(null)}
                        />
                    </section>
                    <section className={classes.pagination} />
                </Fragment>
            );
        }

        if (!data && error) {
            return (
                <div className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResult'}
                        defaultMessage={'No results found. The search term may be missing or invalid.'}
                    />
                </div>
            );
        }

        if (!data) {
            return null;
        }

        if (data.products.items.length === 0) {
            return (
                <div className={classes.noResult}>
                    <h1>
                        <FormattedMessage id={'searchPage.noResultImportant'} defaultMessage={'No results found!'} />
                    </h1>
                </div>
            );
        } else {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <Gallery
                            classes={{
                                items: classes.items
                            }}
                            items={data.products.items}
                        />
                    </section>
                    <section className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </section>
                </Fragment>
            );
        }
    }, [
        loading,
        noResults,
        data,
        error,
        classes.gallery,
        classes.items,
        classes.pagination,
        classes.noResult,
        pageControl
    ]);

    const productsCount = data && data.products && data.products.total_count ? data.products.total_count : 0;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = productsCount;
    const shouldShowSortShimmer = !productsCount && loading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const maybeFilterModal = shouldShowFilterButtons ? <FilterModal filters={filters} /> : null;

    const maybeSidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : (
        !noResults && shouldShowFilterShimmer && <FilterSidebarShimmer />
    );

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} />
    ) : (
        shouldShowSortShimmer && <ProductSortShimmer />
    );

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : (
        shouldShowSortShimmer && <SortedByContainerShimmer />
    );

    const searchResultsHeading = loading ? (
        <Shimmer width={5} />
    ) : !data ? null : searchTerm ? (
        <FormattedMessage
            id={'searchPage.searchTerm'}
            values={{
                // eslint-disable-next-line react/display-name
                highlight: chunks => <span className={classes.headingHighlight}>{chunks}</span>,
                category: searchCategory,
                term: searchTerm
            }}
            defaultMessage={'Showing results:'}
        />
    ) : (
        <FormattedMessage id={'searchPage.searchTermEmpty'} defaultMessage={'Showing all results:'} />
    );

    const itemCountHeading =
        data && !loading ? (
            <span className={classes.totalPages}>
                {formatMessage(
                    {
                        id: 'searchPage.totalPages',
                        defaultMessage: `items`
                    },
                    { totalCount: productsCount }
                )}
            </span>
        ) : loading ? (
            <Shimmer width={5} />
        ) : null;

    const metaLabel = [searchTerm, `${STORE_NAME} Search`].filter(Boolean).join(' - ');

    return (
        <article className={classes.root}>
            <div className={classes.sidebar}>
                <Suspense fallback={<FilterSidebarShimmer />}>{maybeSidebar}</Suspense>
            </div>
            <div className={searchContentClass}>
                {noResults && (
                    <div className={classes.backButtonContainer}>
                        <Link to={resourceUrl('/')} className={classes.backButton}>
                            <FormattedMessage id={'cartPage.backToHome'} defaultMessage={'Back to home'} />
                        </Link>
                    </div>
                )}
                <div className={classes.heading}>
                    <div className={classes.headingRow}>
                        <div className={classes.searchInfo}>
                            {searchResultsHeading}
                            {itemCountHeading}
                        </div>
                        <div className={classes.headerButtons}>
                            {maybeFilterButtons}
                            {maybeSortButton}
                        </div>
                    </div>
                    {maybeSortContainer}
                </div>
                {content}
                <Suspense fallback={null}>{maybeFilterModal}</Suspense>
            </div>
            <StoreTitle>{metaLabel}</StoreTitle>
            <Meta name="title" content={metaLabel} />
            <Meta name="description" content={metaLabel} />
        </article>
    );
};

export default SearchPage;

SearchPage.propTypes = {
    classes: shape({
        noResult: string,
        root: string,
        totalPages: string
    })
};
