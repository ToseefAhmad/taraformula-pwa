import { handleActions } from 'redux-actions';

import actions from '../actions/app';

export const name = 'app';

// As far as the server is concerned, the app is always online
const isServer = !globalThis.navigator;
const isOnline = !isServer && navigator.onLine;
const hasBeenOffline = !isServer && !navigator.onLine;

const initialState = {
    drawer: null,
    hasBeenOffline,
    isOnline,
    isPageLoading: false,
    overlay: false,
    pending: {},
    searchOpen: false,
    nextRootComponent: null,
    showAuthModal: false,
    cartPopUpOpen: false,
    cartItem: null,
    overlayWithoutHeader: false,
    overlayWithHeader: false,
    headerRef: null
};

const reducerMap = {
    [actions.toggleDrawer]: (state, { payload }) => {
        return {
            ...state,
            drawer: payload,
            overlay: !!payload
        };
    },
    [actions.toggleDrawerWithoutMask]: (state, { payload }) => {
        return {
            ...state,
            drawer: payload
        };
    },
    [actions.toggleSearch]: state => {
        return {
            ...state,
            searchOpen: !state.searchOpen
        };
    },
    [actions.setOnline]: state => {
        return {
            ...state,
            isOnline: true
        };
    },
    [actions.setOffline]: state => {
        return {
            ...state,
            isOnline: false,
            hasBeenOffline: true
        };
    },
    [actions.setPageLoading]: (state, { payload }) => {
        return {
            ...state,
            isPageLoading: !!payload
        };
    },
    [actions.setNextRootComponent]: (state, { payload }) => {
        return {
            ...state,
            nextRootComponent: payload
        };
    },
    [actions.setShowAuthModal]: (state, { payload }) => {
        return {
            ...state,
            showAuthModal: !!payload
        };
    },
    [actions.setCartPopUp]: (state, { payload }) => {
        return {
            ...state,
            cartItem: payload
        };
    },
    [actions.setOverlayWithoutHeader]: (state, { payload }) => {
        return {
            ...state,
            overlayWithoutHeader: payload
        };
    },
    [actions.setOverlayWithHeader]: (state, { payload }) => {
        return {
            ...state,
            overlayWithHeader: payload
        };
    },
    [actions.setHeaderRef]: (state, { payload }) => {
        return {
            ...state,
            headerRef: payload
        };
    }
};

export default handleActions(reducerMap, initialState);
