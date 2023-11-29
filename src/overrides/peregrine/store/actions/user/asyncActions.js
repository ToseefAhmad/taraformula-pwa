import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { removeCart } from '@magento/peregrine/lib/store/actions/cart';
import { clearCheckoutDataFromStorage } from '@magento/peregrine/lib/store/actions/checkout';
import actions from '@magento/peregrine/lib/store/actions/user/actions';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const storage = new BrowserPersistence();

export const signOut = (payload = {}) =>
    async function thunk(dispatch, getState, { apolloClient }) {
        const { revokeToken } = payload;

        if (revokeToken) {
            // Send mutation to revoke token.
            try {
                await revokeToken();
            } catch (error) {
                console.error('Error Revoking Token', error);
            }
        }

        // Remove token from local storage and Redux.
        await dispatch(clearToken());
        await dispatch(actions.reset());
        await clearCheckoutDataFromStorage();
        await clearCartDataFromCache(apolloClient);
        await clearCustomerDataFromCache(apolloClient);

        // Now that we're signed out, forget the old (customer) cart.
        // We don't need to create a new cart here because we're going to refresh
        // The page immediately after.
        await dispatch(removeCart());
    };

export const getUserDetails = ({ fetchUserDetails }) =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {
            dispatch(actions.getDetails.request());

            try {
                const { data } = await fetchUserDetails();

                dispatch(actions.getDetails.receive(data.customer));
            } catch (error) {
                dispatch(actions.getDetails.receive(error));
            }
        }
    };

export const resetPassword = ({ email }) =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetPassword.request());

        // eslint-disable-next-line no-warning-comments
        // TODO: actually make the call to the API.
        // For now, just return a resolved promise.
        await Promise.resolve(email);

        dispatch(actions.resetPassword.receive());
    };

export const setToken = (token, ttl = 3600) =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Store token in local storage.
        // eslint-disable-next-line no-warning-comments
        // TODO: Get correct token expire time from API
        storage.setItem('signin_token', token, ttl);

        // Persist in store
        dispatch(actions.setToken(token));
    };

export const clearToken = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Clear token from local storage
        storage.removeItem('signin_token');

        // Remove from store
        dispatch(actions.clearToken());
    };
