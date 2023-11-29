import { combineReducers, createStore } from 'redux';

import { enhancer, reducers } from '@magento/peregrine';

// This is the connective layer between the Peregrine store and the
// Venia-concept UI. You can add your own reducers/enhancers here and combine
// Them with the Peregrine exports.
//
// Example:
// Const rootReducer = combineReducers({ ...reducers, ...myReducers });
// Const rootEnhancer = composeEnhancers(enhancer, myEnhancer);
// Export default createStore(rootReducer, rootEnhancer);
const rootReducer = combineReducers(reducers);

export default createStore(rootReducer, enhancer);
