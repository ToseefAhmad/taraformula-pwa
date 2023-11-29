import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = [
    'TOGGLE_DRAWER',
    'TOGGLE_DRAWER_WITHOUT_MASK',
    'SET_ONLINE',
    'SET_OFFLINE',
    'TOGGLE_SEARCH',
    'EXECUTE_SEARCH',
    'MARK_ERROR_HANDLED',
    'SET_PAGE_LOADING',
    'SET_NEXT_ROOT_COMPONENT',
    'SET_SHOW_AUTH_MODAL',
    'SET_CART_POP_UP',
    'SET_OVERLAY_WITHOUT_HEADER',
    'SET_OVERLAY_WITH_HEADER',
    'SET_HEADER_REF'
];

export default createActions(...actionTypes, { prefix });
