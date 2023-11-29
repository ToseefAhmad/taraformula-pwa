import { array, func, oneOfType, shape, string } from 'prop-types';
import React, { useEffect } from 'react';

import { useCmsBlockContext } from '@app/context/CmsBlockContext/useCmsBlockContext';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Block from '@magento/venia-ui/lib/components/CmsBlock/block';
import defaultClasses from '@magento/venia-ui/lib/components/CmsBlock/cmsBlock.module.css';

const CmsBlockAdvanced = ({ identifiers, propsClasses, shimmer: Shimmer, setCmsBlockLoaded = null }) => {
    const classes = useStyle(defaultClasses, propsClasses);
    const { loading, getCmsBlocks } = useCmsBlockContext();
    const items = getCmsBlocks(identifiers);

    useEffect(() => {
        if (setCmsBlockLoaded) {
            setCmsBlockLoaded(loading);
        }
    }, [loading, setCmsBlockLoaded]);

    if (!items) {
        if (loading && Shimmer) {
            return <Shimmer />;
        }

        return null;
    }

    if (!Array.isArray(items) || !items.length) {
        return null;
    }

    const BlockChild = typeof children === 'function' ? children : Block;
    const blocks = items.map((item, index) => (
        <BlockChild key={item.identifier} className={classes.block} index={index} {...item} />
    ));

    return (
        <div className={classes.root}>
            <div className={classes.content}>{blocks}</div>
        </div>
    );
};

CmsBlockAdvanced.propTypes = {
    children: func,
    propsClasses: shape({
        block: string,
        content: string,
        root: string
    }),
    shimmer: func,
    identifiers: oneOfType([string, array]),
    setCmsBlockLoaded: func
};

export default CmsBlockAdvanced;
