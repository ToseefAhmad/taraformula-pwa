import classnames from 'classnames';
import { number, shape, string } from 'prop-types';
import React, { createContext, Fragment, useContext } from 'react';
import { useIntl } from 'react-intl';

import Hreflangs from '@app/components/Hreflangs';
import SitelinksSearchBoxRichSnippet from '@app/components/SitelinksSearchBoxRichSnippet';
import { Directions } from '@app/hooks/useDirection';
import { useFaqWidget } from '@app/hooks/useFaqWidget';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CategoryList from '@magento/venia-ui/lib/components/CategoryList';
import { Meta, StoreTitle, Link } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import defaultClasses from './cms.module.css';

const CmsPageContext = createContext();
const { Provider } = CmsPageContext;

const PAGE_LAYOUT_OPTIONS = {
    '2columns-left': 'twoColumnsLeft',
    '2columns-right': 'twoColumnsRight'
};

const CMSPage = props => {
    const { identifier } = props;

    const talonProps = useCmsPage({ identifier });

    const { cmsPage, hasContent, rootCategoryId, shouldShowLoadingIndicator, showLtr } = talonProps;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    useFaqWidget();

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    if (hasContent) {
        const {
            content_heading,
            description,
            title,
            meta_title,
            meta_description,
            content,
            hreflangs,
            page_layout,
            canonical_full_url
        } = cmsPage;
        const headingElement = content_heading && (
            <h1 className={showLtr ? classes.headingLtr : classes.heading}>{content_heading}</h1>
        );
        const descriptionElement = description && <p className={classes.description}>{description}</p>;
        const isHomePage = identifier === 'home';

        const pageTitle = !isHomePage ? meta_title || title : undefined;

        const pageContentClasses = `${classes.page_wrapper} ${identifier}`;
        const pageLayout = page_layout && PAGE_LAYOUT_OPTIONS[page_layout];
        const pageContentClassesWithLayout = pageLayout
            ? classnames(pageContentClasses, classes[pageLayout])
            : pageContentClasses;

        const contextValue = {
            isCmsPage: !isHomePage
        };

        const canonicalUrl =
            canonical_full_url.slice(-1) === '/' ? canonical_full_url.slice(0, -1) : canonical_full_url;

        return (
            <Fragment>
                <SitelinksSearchBoxRichSnippet />
                <StoreTitle>{pageTitle}</StoreTitle>
                <Link rel="canonical" href={canonicalUrl} />
                <Meta name="title" content={pageTitle} />
                <Meta name="description" content={meta_description} />
                <Hreflangs hreflangs={hreflangs} />
                <Provider value={contextValue}>
                    <div className={pageContentClassesWithLayout} {...(showLtr ? { dir: Directions.ltr } : null)}>
                        <div className={classes.sidebar}>
                            {headingElement}
                            {descriptionElement}
                        </div>
                        <div className={classes.content}>
                            <RichContent html={content} />
                        </div>
                    </div>
                </Provider>
            </Fragment>
        );
    }

    // Fallback to a category list if there is no cms content.
    return (
        <CategoryList
            title={formatMessage({
                id: 'cms.shopByCategory',
                defaultMessage: 'Shop by category'
            })}
            id={rootCategoryId}
        />
    );
};

CMSPage.propTypes = {
    identifier: string,
    id: number,
    classes: shape({
        page_wrapper: string,
        content: string,
        sidebar: string,
        heading: string,
        description: string
    })
};

export default CMSPage;

export const useCmsPageContext = () => useContext(CmsPageContext);
