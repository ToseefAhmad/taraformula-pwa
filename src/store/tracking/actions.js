import { createActions } from '@app/util/action';

export const TrackingActions = {
    setUserData: 'TRACKING/SET_USER_DATA',
    setCookieConsent: 'TRACKING/SET_COOKIE_CONSENT'
};

export const createTrackingDispatchers = dispatch => createActions(TrackingActions, dispatch);

export const initialTrackingDispatchers = createTrackingDispatchers(() => undefined);
