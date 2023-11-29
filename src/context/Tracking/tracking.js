import { any } from 'prop-types';
import React, { createContext, useContext } from 'react';
import { connect } from 'react-redux';

import GTMVariables from '@app/components/GTMVariables';
import { createTrackingDispatchers, initialTrackingDispatchers } from '@app/store/tracking/actions';
import { initialTrackingState } from '@app/store/tracking/reducer';

import CookieConsent from './cookieConsent';

const TrackingContext = createContext([initialTrackingState, initialTrackingDispatchers]);

const mapState = ({ tracking }) => ({ trackingState: tracking });

const mapDispatch = dispatch => ({
    dispatchers: {
        ...createTrackingDispatchers(dispatch)
    }
});

const TrackingContextProvider = ({ dispatchers, trackingState, children }) => {
    return (
        <TrackingContext.Provider value={[trackingState, dispatchers]}>
            {children}
            <CookieConsent />
            <GTMVariables />
        </TrackingContext.Provider>
    );
};
TrackingContextProvider.propTypes = {
    dispatchers: any,
    trackingState: any,
    children: any
};

export default connect(
    mapState,
    mapDispatch
)(TrackingContextProvider);

export const useTrackingContext = () => useContext(TrackingContext);
