import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import classes from '@app/components/Blog/blog.module.css';
import List from '@app/components/Blog/List';
import { useBlogHreflangs } from '@app/components/Blog/useBlogHreflangs';
import Hreflangs from '@app/components/Hreflangs';
import { useListPage } from '@app/talons/useListPage';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';

const ListPage = () => {
    const {
        itemId,
        name,
        pageTitle,
        meta_tags: metaTags,
        meta_title: metaTitle,
        meta_description: metaDescription,
        pageType
    } = useListPage();

    const location = useLocation();
    const blogHreflangs = useBlogHreflangs(location.pathname, itemId, pageType);

    return (
        <Fragment>
            <StoreTitle>{metaTitle || name}</StoreTitle>
            <Meta name="description" content={metaDescription} />
            <Meta name="tags" content={metaTags} />
            {/* MB-21800 noindex, follow temporarily until Tag and Author pages have more valuable content*/}
            <Meta name="robots" content="noindex, follow" />
            <Hreflangs hreflangs={blogHreflangs} />

            <h1 className={classes.heading}>{pageTitle}</h1>

            <List id={itemId} />
        </Fragment>
    );
};

export default ListPage;
