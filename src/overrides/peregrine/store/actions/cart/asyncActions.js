import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import actions from '@magento/peregrine/lib/store/actions/cart/actions';
import { signOut } from '@magento/peregrine/lib/store/actions/user';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const storage = new BrowserPersistence();

export const createCart = payload =>
    async function thunk(dispatch, getState) {
        const { fetchCartId } = payload;
        const { cart } = getState();

        // If a cart already exists in the store, exit
        if (cart.cartId) {
            return;
        }

        // Request a new cart.
        dispatch(actions.getCart.request());

        // If a cart exists in storage, act like we just received it
        const cartId = await retrieveCartId();
        if (cartId) {
            await dispatch(actions.getCart.receive(cartId));
            return;
        }

        try {
            // Errors can come from graphql and are not thrown
            const { data, errors } = await fetchCartId({
                fetchPolicy: 'no-cache'
            });

            let receivePayload;

            if (errors) {
                receivePayload = new Error(errors);
            } else {
                receivePayload = data.cartId;
                // Write to storage in the background
                saveCartId(data.cartId);
            }

            dispatch(actions.getCart.receive(receivePayload));
        } catch (error) {
            // If we are unable to create a cart, the cart can't function, so
            // We forcibly throw so the upstream actions won't retry.
            dispatch(actions.getCart.receive(error));
            throw new Error('Unable to create cart');
        }
    };

export const addItemToCart = (payload = {}) => {
    const { addItemMutation, fetchCartDetails, fetchCartId, item, quantity, parentSku } = payload;

    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.addItem.request(payload));

        const { cart, user } = getState();
        const { cartId } = cart;
        const { isSignedIn } = user;

        try {
            const variables = {
                cartId,
                parentSku,
                product: item,
                quantity,
                sku: item.sku
            };

            await addItemMutation({
                variables
            });

            // 2019-02-07  Moved these dispatches to the success clause of
            // AddItemToCart. The cart should only open on success.
            // In the catch clause, this action creator calls its own thunk,
            // So a successful retry will wind up here anyway.
            await dispatch(
                getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                })
            );
            dispatch(actions.addItem.receive());
        } catch (error) {
            dispatch(actions.addItem.receive(error));

            const shouldRetry = !error.networkError && isInvalidCart(error);

            // Only retry if the cart is invalid or the cartId is missing.
            if (shouldRetry) {
                if (isSignedIn) {
                    // Since simple persistence just deletes auth token without
                    // Informing Redux, we need to perform the sign out action
                    // To reset the user and cart slices back to initial state.
                    await dispatch(signOut());
                } else {
                    // Delete the cached ID from local storage and Redux.
                    // In contrast to the save, make sure storage deletion is
                    // Complete before dispatching the error--you don't want an
                    // Upstream action to try and reuse the known-bad ID.
                    await dispatch(removeCart());
                }

                // Then create a new one
                try {
                    await dispatch(
                        createCart({
                            fetchCartId
                        })
                    );
                } catch (error) {
                    // If creating a cart fails, all is not lost. Return so that the
                    // User can continue to at least browse the site.
                    return;
                }

                // And fetch details
                await dispatch(
                    getCartDetails({
                        fetchCartId,
                        fetchCartDetails
                    })
                );

                // Then retry this operation
                return thunk(...arguments);
            }
        }
    };
};

/**
 * Applies changes in options/quantity to a cart item.
 *
 * @param payload.cartItemId {Number} the id of the cart item we are updating
 * @param payload.item {Object} the new configuration item if changes are selected.
 * @param payload.quantity {Number} the quantity of the item being updated
 * @param payload.productType {String} 'ConfigurableProduct' or other.
 */
export const updateItemInCart = (payload = {}) => {
    const { cartItemId, fetchCartDetails, fetchCartId, item, productType, quantity, removeItem, updateItem } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.updateItem.request(payload));

        const { cart, user } = getState();
        const { cartId } = cart;
        const { isSignedIn } = user;

        try {
            if (productType === 'ConfigurableProduct') {
                // You _must_ remove before adding or risk deleting the item
                // Entirely if only quantity has been modified.
                await dispatch(
                    removeItemFromCart({
                        item: {
                            id: cartItemId
                        },
                        fetchCartDetails,
                        fetchCartId,
                        removeItem
                    })
                );
                await dispatch(
                    addItemToCart({
                        ...payload
                    })
                );
            } else {
                // If the product is a simple product we can just use the
                // UpdateCartItems graphql mutation.
                await updateItem({
                    variables: {
                        cartId,
                        itemId: cartItemId,
                        quantity
                    }
                });
                // The configurable product conditional dispatches actions that
                // Each call getCartDetails. For simple items we must request
                // Details after the mutation completes. This may change when
                // We migrate to the `cart` query for details, away from REST.
                await dispatch(
                    getCartDetails({
                        fetchCartId,
                        fetchCartDetails
                    })
                );
            }

            dispatch(actions.updateItem.receive());
        } catch (error) {
            dispatch(actions.updateItem.receive(error));

            const shouldRetry = !error.networkError && isInvalidCart(error);
            if (shouldRetry) {
                // Delete the cached ID from local storage and Redux.
                // In contrast to the save, make sure storage deletion is
                // Complete before dispatching the error--you don't want an
                // Upstream action to try and reuse the known-bad ID.
                await dispatch(removeCart());

                // Then create a new one
                try {
                    await dispatch(
                        createCart({
                            fetchCartId
                        })
                    );
                } catch (error) {
                    // If creating a cart fails, all is not lost. Return so that the
                    // User can continue to at least browse the site.
                    return;
                }

                // And fetch details
                await dispatch(
                    getCartDetails({
                        fetchCartId,
                        fetchCartDetails
                    })
                );

                if (isSignedIn) {
                    // The user is signed in and we just received their cart.
                    // Retry this operation.
                    return thunk(...arguments);
                } else {
                    // The user is a guest and just received a brand new (empty) cart.
                    // Add the updated item to that cart.
                    await dispatch(
                        addItemToCart({
                            ...payload
                        })
                    );
                }
            }
        }
    };
};

export const removeItemFromCart = payload => {
    const { item, fetchCartDetails, fetchCartId, removeItem } = payload;

    return async function thunk(dispatch, getState) {
        dispatch(actions.removeItem.request(payload));

        const { cart } = getState();
        const { cartId } = cart;

        try {
            await removeItem({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });

            dispatch(actions.removeItem.receive());
        } catch (error) {
            dispatch(actions.removeItem.receive(error));

            const shouldResetCart = !error.networkError && isInvalidCart(error);
            if (shouldResetCart) {
                // Delete the cached ID from local storage.
                // The reducer handles clearing out the bad ID from Redux.
                // In contrast to the save, make sure storage deletion is
                // Complete before dispatching the error--you don't want an
                // Upstream action to try and reuse the known-bad ID.
                await dispatch(removeCart());
                // Then create a new one
                try {
                    await dispatch(
                        createCart({
                            fetchCartId
                        })
                    );
                } catch (error) {
                    // If creating a cart fails, all is not lost. Return so that the
                    // User can continue to at least browse the site.
                    return;
                }
            }
        }

        await dispatch(
            getCartDetails({
                fetchCartId,
                fetchCartDetails
            })
        );
    };
};

export const getCartDetails = payload => {
    const { fetchCartId, fetchCartDetails } = payload;

    return async function thunk(dispatch, getState, { apolloClient }) {
        const { cart, user } = getState();
        const { cartId } = cart;
        const { isSignedIn } = user;

        // If there isn't a cart, create one then retry this operation
        if (!cartId) {
            try {
                await dispatch(
                    createCart({
                        fetchCartId
                    })
                );
            } catch (error) {
                // If creating a cart fails, all is not lost. Return so that the
                // User can continue to at least browse the site.
                return;
            }
            return thunk(...arguments);
        }

        // Once we have the cart id indicate that we are starting to make
        // Async requests for the details.
        dispatch(actions.getDetails.request(cartId));

        try {
            const { data } = await fetchCartDetails({
                variables: { cartId },
                fetchPolicy: 'network-only'
            });
            const { cart: details } = data;

            dispatch(actions.getDetails.receive({ details }));
        } catch (error) {
            dispatch(actions.getDetails.receive(error));

            const shouldResetCart = !error.networkError && isInvalidCart(error);
            if (shouldResetCart) {
                if (isSignedIn) {
                    // Since simple persistence just deletes auth token without
                    // Informing Redux, we need to perform the sign out action
                    // To reset the user and cart slices back to initial state.
                    await dispatch(signOut());
                } else {
                    // Delete the cached ID from local storage.
                    await dispatch(removeCart());
                }

                // Clear cart data from Apollo cache
                await clearCartDataFromCache(apolloClient);

                // Create a new cart
                try {
                    await dispatch(
                        createCart({
                            fetchCartId
                        })
                    );
                } catch (error) {
                    // If creating a cart fails, all is not lost. Return so that the
                    // User can continue to at least browse the site.
                    return;
                }

                // Retry this operation
                return thunk(...arguments);
            }
        }
    };
};

export const setCartIdToState = cartId =>
    async function thunk(dispatch) {
        await dispatch(actions.getCart.receive(cartId));
    };

export const removeCart = () =>
    async function thunk(dispatch) {
        // Clear the cartId from local storage.
        await clearCartId();

        // Clear the cart info from the redux store.
        dispatch(actions.reset());
    };

/* Helpers */
// eslint-disable-next-line func-style
export async function retrieveCartId() {
    const storeCode = storage.getItem('store_view_code') || 'default';
    return storage.getItem(storeCode + '_cartId');
}

// eslint-disable-next-line func-style
export async function saveCartId(id) {
    const storeCode = storage.getItem('store_view_code') || 'default';
    return storage.setItem(storeCode + '_cartId', id);
}

// eslint-disable-next-line func-style
export async function clearCartId() {
    const storeCode = storage.getItem('store_view_code') || 'default';
    return storage.removeItem(storeCode + '_cartId');
}

// eslint-disable-next-line func-style
async function retrieveImageCache() {
    return storage.getItem('imagesBySku') || {};
}

// eslint-disable-next-line func-style
async function saveImageCache(cache) {
    return storage.setItem('imagesBySku', cache);
}

// eslint-disable-next-line func-style
export async function writeImageToCache(item = {}) {
    const { media_gallery_entries: media, sku } = item;

    if (sku) {
        const image = media && (media.find(m => m.position === 1) || media[0]);

        if (image) {
            const imageCache = await retrieveImageCache();

            // If there is an image and it differs from cache
            // Write to cache and save in the background
            if (imageCache[sku] !== image) {
                imageCache[sku] = image;
                saveImageCache(imageCache);

                return image;
            }
        }
    }
}

// Returns true if the cart is invalid.
// eslint-disable-next-line func-style
function isInvalidCart(error) {
    return !!(
        error.graphQLErrors &&
        error.graphQLErrors.find(
            err =>
                err.message.includes('Could not find a cart') ||
                err.message.includes("The cart isn't active") ||
                err.message.includes('The current user cannot perform operations on cart')
        )
    );
}
