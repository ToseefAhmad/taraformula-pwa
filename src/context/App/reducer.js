import { createActions } from '@app/util/action';

export const initialState = {
    isRestoringCart: false,
    canCloseDrawer: true
};

export const AppActions = {
    setIsRestoringCart: 'APP/SET_IS_RESTORING_CART',
    setCanCloseDrawer: 'APP/SET_CAN_CLOSE_DRAWER'
};

export const createAppDispatchers = dispatch => createActions(AppActions, dispatch);

export const initialAppDispatchers = () => {
    return;
};

export const appReducer = (state, action) => {
    switch (action.type) {
        case AppActions.setIsRestoringCart:
            return {
                ...state,
                isRestoringCart: action.payload
            };
        case AppActions.setCanCloseDrawer:
            return {
                ...state,
                canCloseDrawer: action.payload
            };
    }
};
