import { TrackingActions } from './actions';

export const initialTrackingState = {
    cookieConsent: [0]
};

export const trackingReducer = (state = initialTrackingState, action) => {
    switch (action.type) {
        case TrackingActions.setCookieConsent:
            return {
                ...state,
                cookieConsent: action.payload
            };
        default:
            return state;
    }
};
