import { array, func, oneOfType, shape, string } from 'prop-types';
import React from 'react';

import { useCmsBlockContext } from '@app/context/CmsBlockContext/useCmsBlockContext';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import Block from './block';
import defaultClasses from './cmsBlock.module.css';

const CmsBlockGroup = props => {
    const { identifiers } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { loading, getCmsBlocks } = useCmsBlockContext();
    const items = getCmsBlocks(identifiers);

    if (!items && loading) {
        return fullPageLoadingIndicator;
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

CmsBlockGroup.propTypes = {
    children: func,
    classes: shape({
        block: string,
        content: string,
        root: string
    }),
    identifiers: oneOfType([string, array])
};

export default CmsBlockGroup;
