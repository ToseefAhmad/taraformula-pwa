import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { ToastType } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import defaultOperations from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/addToListButton.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useSingleWishlist = props => {
    const { afterAdd, beforeAdd, item } = props;

    const operations = mergeOperations(defaultOperations, props.operations);

    const [
        addProductToWishlist,
        { data: addProductData, error: errorAddingProduct, loading: isAddingToWishlist }
    ] = useMutation(operations.addProductToWishlistMutation);

    const {
        client,
        data: { customerWishlistProducts }
    } = useQuery(operations.getProductsInWishlistsQuery);

    const isSelected = useMemo(() => {
        return customerWishlistProducts.includes(item.sku) || isAddingToWishlist;
    }, [customerWishlistProducts, isAddingToWishlist, item.sku]);

    const [showLoginToast, setShowLoginToast] = useState(0);

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const handleClick = useCallback(async () => {
        if (!isSignedIn) {
            setShowLoginToast(current => ++current);
        } else {
            try {
                if (beforeAdd) {
                    await beforeAdd();
                }

                await addProductToWishlist({
                    variables: { wishlistId: '0', itemOptions: item }
                });

                client.writeQuery({
                    query: operations.getProductsInWishlistsQuery,
                    data: {
                        customerWishlistProducts: [...customerWishlistProducts, item.sku]
                    }
                });

                if (afterAdd) {
                    afterAdd();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [
        addProductToWishlist,
        afterAdd,
        beforeAdd,
        client,
        customerWishlistProducts,
        isSignedIn,
        item,
        operations.getProductsInWishlistsQuery
    ]);

    const loginToastProps = useMemo(() => {
        if (showLoginToast) {
            return {
                type: ToastType.INFO,
                message: formatMessage({
                    id: 'wishlist.galleryButton.loginMessage',
                    defaultMessage: 'Please sign-in to your Account to save items for later.'
                })
            };
        }

        return null;
    }, [formatMessage, showLoginToast]);

    const successToastProps = useMemo(() => {
        if (addProductData) {
            return {
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'wishlist.galleryButton.successMessageGeneral',
                    defaultMessage: 'Item successfully added to your favorites list.'
                })
            };
        }

        return null;
    }, [addProductData, formatMessage]);

    const errorToastProps = useMemo(() => {
        if (errorAddingProduct) {
            return {
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'wishlist.galleryButton.addError',
                    defaultMessage: 'Something went wrong adding the product to your wishlist.'
                })
            };
        }

        return null;
    }, [errorAddingProduct, formatMessage]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': formatMessage({
                id: 'wishlistButton.addText',
                defaultMessage: 'Add to Favorites'
            }),
            isDisabled: isSelected,
            onPress: handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick, isSelected]
    );

    return {
        buttonProps,
        buttonText: props.buttonText && props.buttonText(isSelected),
        customerWishlistProducts,
        errorToastProps,
        handleClick,
        isSelected,
        loginToastProps,
        successToastProps
    };
};
