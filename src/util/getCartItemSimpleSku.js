const findVariant = item => {
    if (item.__typename === 'ConfigurableCartItem' && item.configured_variant) {
        if (item.product.__typename === 'ConfigurableProduct') {
            return item.product.variants.find(variant => variant.product.id === item.configured_variant.id);
        }
    }
};

export const getCartItemSimpleSku = item => {
    if (item.product.__typename !== 'ConfigurableProduct') {
        return item.product.sku;
    }

    if (item.product.__typename === 'ConfigurableProduct' && item.product.variants) {
        const variant = findVariant(item);
        return (variant && variant.product.sku) || item.product.sku;
    }
};
