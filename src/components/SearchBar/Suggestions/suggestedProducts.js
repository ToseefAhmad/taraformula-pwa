import { arrayOf, number, oneOfType, shape, string } from 'prop-types';
import React, { useEffect, useState } from 'react';

import GalleryItem from '@app/components/overrides/Gallery/item';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';

import classes from './suggestedProducts.module.css';

const LIMIT_DEFAULT = 4;
const LIMIT_TABLET = 6;

const SuggestedProducts = ({ products }) => {
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const { innerWidth } = useWindowSize();

    useEffect(() => {
        if (innerWidth >= 532 && innerWidth < 702) {
            setLimit(LIMIT_TABLET);
        } else {
            setLimit(LIMIT_DEFAULT);
        }
    }, [innerWidth, setLimit]);

    const items = products.slice(0, limit).map(product => (
        <li key={product.id}>
            <GalleryItem
                item={product}
                isSupportedProductType={isSupported(product.__typename)}
                classes={{
                    root: classes.productRoot,
                    images: classes.productImages,
                    name: classes.productName,
                    type: classes.productType,
                    price: classes.productPrice,
                    actionWrapper: classes.productActionWrapper,
                    actionsContainer: classes.productActionsContainer
                }}
            />
        </li>
    ));

    return (
        <>
            <AmProductLabelProvider products={products} mode="CATEGORY">
                <ul className={classes.root}>{items}</ul>
            </AmProductLabelProvider>
        </>
    );
};

export default SuggestedProducts;

SuggestedProducts.propTypes = {
    products: arrayOf(
        shape({
            id: oneOfType([number, string]).isRequired
        })
    ).isRequired
};
