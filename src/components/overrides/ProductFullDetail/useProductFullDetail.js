import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import { GET_CART_ITEMS_FOR_PRODUCT_PAGE } from '@app/RootComponents/Product/product.gql';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import defaultOperations from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql';
import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const { attribute_id, attribute_code } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // Option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(value => !!value).length;

    return numProductSelections < numProductOptions;
};

const getSelectedProduct = (product, optionCodes, optionSelections) => {
    const { variants } = product;

    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    const matchingVariant =
        isConfigurable && optionsSelected
            ? findMatchingVariant({
                  optionCodes,
                  optionSelections,
                  variants
              })
            : null;

    return matchingVariant ? matchingVariant.product : product;
};

const getAvailableQty = (product, optionCodes, optionSelections, cartData) => {
    const selectedProduct = getSelectedProduct(product, optionCodes, optionSelections);
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    // Return 1 in order for not to show out of stock for configurable products
    if (isConfigurable && !optionsSelected) {
        return 1;
    }

    if (cartData && cartData.cart && cartData.cart.items) {
        const item = cartData.cart.items.find(
            item => item.product.sku === selectedProduct.sku || item.product.sku === product.sku
        );

        if (item) {
            return selectedProduct.max_qty - item.quantity;
        }
    }

    return selectedProduct.max_qty;
};

const getIsOutOfStock = (availableQty, selectedProduct) => {
    return selectedProduct.stock_status === OUT_OF_STOCK_CODE || availableQty <= 0;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // Variant's image to the media gallery. NOTE: This _can_, and does,
        // Include variants such as size. If Magento is configured to display
        // An image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? [...item.product.media_gallery_entries, ...media_gallery_entries] : media_gallery_entries;
    }

    return value;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// Product has multiple related categories. This function filters and selects
// One category id for that purpose.
export const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // Breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // Will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(category => !breadcrumbSet.has(category.id));

    // If we couldn't find a leaf category then just use the first category
    // In the list for this product.
    return leafCategory.id || categories[0].id;
};

const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price.regularPrice.amount;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? item.product.price.regularPrice.amount : product.price.regularPrice.amount;
    }

    return value;
};

/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const { addConfigurableProductToCartMutation, addSimpleProductToCartMutation, product } = props;
    const { getProductCategories, trackAddToCart } = useTracking();
    const [, { addToast }] = useToasts();
    const [
        ,
        {
            actions: { setCartPopUp }
        }
    ] = useAppContext();

    const hasDeprecatedOperationProp = !!(addConfigurableProductToCartMutation || addSimpleProductToCartMutation);

    const operations = mergeOperations(defaultOperations, props.operations);

    const productType = product.__typename;

    const isSupportedProductType = isSupported(productType);

    const [{ cartId }] = useCartContext();

    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    const { data: storeConfigData } = useQuery(operations.getWishlistConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const { data: cartData } = useQuery(GET_CART_ITEMS_FOR_PRODUCT_PAGE, {
        fetchPolicy: 'cache-and-network',
        variables: {
            cartId
        }
    });

    const [
        addConfigurableProductToCart,
        { error: errorAddingConfigurableProduct, loading: isAddConfigurableLoading }
    ] = useMutation(addConfigurableProductToCartMutation || operations.addConfigurableProductToCartMutation);

    const [addSimpleProductToCart, { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }] = useMutation(
        addSimpleProductToCartMutation || operations.addSimpleProductToCartMutation
    );

    const [addProductToCart, { error: errorAddingProductToCart, loading: isAddProductLoading }] = useMutation(
        operations.addProductToCartMutation
    );

    const breadcrumbCategoryId = useMemo(() => getBreadcrumbCategoryId(product.categories), [product.categories]);

    const derivedOptionSelections = useMemo(() => deriveOptionSelectionsFromProduct(product), [product]);

    const [optionSelections, setOptionSelections] = useState(derivedOptionSelections);

    const derivedOptionCodes = useMemo(() => deriveOptionCodesFromProduct(product), [product]);
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(() => getIsMissingOptions(product, optionSelections), [product, optionSelections]);

    const selectedProduct = useMemo(() => getSelectedProduct(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const availableQty = useMemo(
        () => getAvailableQty(product, optionCodes, optionSelections, cartData, selectedProduct),
        [product, optionCodes, optionSelections, cartData, selectedProduct]
    );

    const [maxQty, setMaxQty] = useState(availableQty);

    const isOutOfStock = useMemo(() => getIsOutOfStock(availableQty, selectedProduct), [availableQty, selectedProduct]);

    const mediaGalleryEntries = useMemo(() => getMediaGalleryEntries(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values.find(item => item.value_index === value);

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    // Get selected Option labels.
    const selectedOptionLabels = useMemo(() => {
        const selectedLabels = [];
        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);
            const selectedOption = product.configurable_options.find(element => element.attribute_id === key);
            const selectedValue = values.find(item => item.value_index === value);

            if (selectedValue) {
                selectedLabels.push({
                    option: selectedOption.label,
                    attributeValue: selectedValue.store_label,
                    key: selectedValue.value_index
                });
            }
        });
        return selectedLabels;
    }, [attributeIdToValuesMap, optionSelections, product]);

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;

            if (quantity > maxQty) {
                addToast({
                    type: ToastType.ERROR,
                    message: formatMessage({
                        id: 'addToCart.notAvailable',
                        defaultMessage: 'Requested quantity is not available'
                    }),
                    timeout: false
                });

                return;
            }

            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                const payload = {
                    item: product,
                    productType,
                    quantity
                };

                if (isProductConfigurable(product)) {
                    appendOptionsToPayload(payload, optionSelections, optionCodes);
                }

                if (isSupportedProductType) {
                    const variables = {
                        cartId,
                        parentSku: payload.parentSku,
                        product: payload.item,
                        quantity: payload.quantity,
                        sku: payload.item.sku
                    };
                    // Use the proper mutation for the type.
                    if (productType === 'SimpleProduct') {
                        try {
                            await addSimpleProductToCart({
                                variables
                            });
                            trackAddToCart({
                                currencyCode: product.price_range.maximum_price.final_price.currency,
                                products: [
                                    {
                                        quantity: quantity,
                                        sku: product.sku,
                                        name: product.name,
                                        price: product.price_range.maximum_price.final_price.value,
                                        category: getProductCategories(product.categories)
                                    }
                                ]
                            });
                        } catch (error) {
                            addToast({
                                type: ToastType.ERROR,
                                message: error.message,
                                timeout: false
                            });
                            return;
                        }
                    } else if (productType === 'ConfigurableProduct') {
                        try {
                            await addConfigurableProductToCart({
                                variables
                            });
                            trackAddToCart({
                                currencyCode: product.price_range.maximum_price.final_price.currency,
                                products: [
                                    {
                                        quantity: quantity,
                                        sku: product.sku,
                                        name: product.name,
                                        price: product.price_range.maximum_price.final_price.value,
                                        category: getProductCategories(product.categories)
                                    }
                                ]
                            });
                        } catch (error) {
                            addToast({
                                type: ToastType.ERROR,
                                message: error.message,
                                timeout: false
                            });
                            return;
                        }
                    }
                } else {
                    console.error('Unsupported product type. Cannot add to cart.');
                }
            } else {
                const variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }

                try {
                    await addProductToCart({ variables });

                    trackAddToCart({
                        currencyCode: product.price_range.maximum_price.final_price.currency,
                        products: [
                            {
                                quantity: quantity,
                                sku: product.sku,
                                name: product.name,
                                price: product.price_range.maximum_price.final_price.value,
                                category: getProductCategories(product.categories)
                            }
                        ]
                    });
                } catch (error) {
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message,
                        timeout: false
                    });
                    return;
                }
            }

            // Trigger mini-cart pop-up
            setCartPopUp({ cartItem: { ...product, ...{ quantity: quantity }, selectedOptionLabels } });
        },
        [
            addConfigurableProductToCart,
            addProductToCart,
            addSimpleProductToCart,
            addToast,
            cartId,
            hasDeprecatedOperationProp,
            isSupportedProductType,
            optionCodes,
            optionSelections,
            product,
            productType,
            selectedOptionsArray,
            setCartPopUp,
            trackAddToCart,
            selectedOptionLabels,
            formatMessage,
            maxQty,
            getProductCategories
        ]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // Of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
            const maxQty = getAvailableQty(product, optionCodes, nextOptionSelections, cartData);
            setMaxQty(maxQty);
        },
        [optionSelections, product, optionCodes, cartData]
    );

    const productPrice = useMemo(() => getConfigPrice(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: productPrice,
        sku: product.sku
    };

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([errorAddingSimpleProduct, errorAddingConfigurableProduct, errorAddingProductToCart]),
        [errorAddingConfigurableProduct, errorAddingProductToCart, errorAddingSimpleProduct]
    );

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

    const wishlistButtonProps = {
        buttonText: isSelected =>
            isSelected
                ? formatMessage({
                      id: 'wishlistButton.addedText',
                      defaultMessage: 'Added to Favorites'
                  })
                : formatMessage({
                      id: 'wishlistButton.addText',
                      defaultMessage: 'Add to Favorites'
                  }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    return {
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled:
            isOutOfStock || isMissingOptions || isAddConfigurableLoading || isAddSimpleLoading || isAddProductLoading,
        isSupportedProductType,
        mediaGalleryEntries,
        shouldShowWishlistButton:
            isSignedIn && storeConfigData && !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        wishlistButtonProps,
        wishlistItemOptions,
        selectedOptionLabels,
        maxQty,
        selectedProduct
    };
};
