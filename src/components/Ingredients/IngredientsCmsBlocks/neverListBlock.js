import { chunk } from 'lodash';
import { string } from 'prop-types';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

import classes from '@app/components/Ingredients/IngredientsCmsBlocks/neverList.module.css';
import { useCmsBlockContext } from '@app/context/CmsBlockContext/useCmsBlockContext';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import Block from '@magento/venia-ui/lib/components/CmsBlock/block';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const NeverListBlock = ({ identifiers }) => {
    const [blocks, setBlocks] = useState(null);
    const { loading, getCmsBlocks } = useCmsBlockContext();

    const items = useMemo(() => getCmsBlocks(identifiers), [getCmsBlocks, identifiers]);

    const { innerWidth } = useWindowSize();

    useEffect(() => {
        if (!items && loading) {
            return fullPageLoadingIndicator;
        }

        if (!Array.isArray(items) || !items.length) {
            return;
        }

        const BlockChild = typeof children === 'function' ? children : Block;
        setBlocks(items.map((item, index) => <BlockChild key={item.identifier} index={index} {...item} />));
    }, [loading, items]);

    // We need this effect, to make titles of the NEVER LIST CMS BLOCK the same height
    useLayoutEffect(() => {
        if (blocks == null || !blocks.length) {
            return;
        }

        // Collecting and breaking the array in to small chunks by 2, for the future comparing
        const textBlocks = chunk(
            Array.from(document.querySelectorAll('[class*="neverListSection"] [class*="text-root"]')),
            2
        );

        textBlocks.map(arrayItems => {
            // Unset min-height, that was set previously
            arrayItems.map(item => {
                item.firstElementChild.style.removeProperty('min-height');
            });

            let maxHeight = 0;

            if (arrayItems.length <= 1) {
                return;
            }

            // Comparing heights and setting the max value
            arrayItems.map(item => {
                if (item.firstElementChild.offsetHeight > maxHeight) {
                    maxHeight = item.firstElementChild.offsetHeight;
                }
            });

            // Adding min-height to each item
            arrayItems.map(item => {
                if (maxHeight > 0) {
                    item.firstElementChild.style.minHeight = maxHeight + 'px';
                }
            });
        });
    }, [blocks, innerWidth]);

    return (
        <div className={classes.neverList}>
            <div>{blocks}</div>
        </div>
    );
};

NeverListBlock.propTypes = {
    identifiers: string
};

export default NeverListBlock;
