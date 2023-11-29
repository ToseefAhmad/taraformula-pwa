import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import { GET_FASTEST_DELIVERY_DATE } from './getItBy.gql';

export const UseGetItBy = (city, getDispatchHours) => {
    const { data } = useQuery(GET_FASTEST_DELIVERY_DATE, {
        variables: {
            city: city
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const date = data && data.getFastestDeliveryDate ? data.getFastestDeliveryDate : null;
    const dispatchHours = date && date.dispatch_hours ? date.dispatch_hours : null;
    const dispatchMinutes = date && date.dispatch_minutes ? date.dispatch_minutes : null;

    const [hoursLeftUntilDispatch, setHoursLeftUntilDispatch] = useState(0);
    const [minutesLeftUntilDispatch, setMinutesLeftUntilDispatch] = useState(0);

    // Set how many hours and minutes are left until dispatch
    const setDispatchTimeLeft = useCallback(() => {
        const now = new Date();

        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();

        const utcTimeNow = Date.UTC(utcYear, utcMonth, utcDate, now.getUTCHours(), now.getUTCMinutes());
        const utcDispatchTime = Date.UTC(utcYear, utcMonth, utcDate, dispatchHours, dispatchMinutes);

        const timeLeftInMsUntilDispatch = utcDispatchTime - utcTimeNow;
        const timeLeftInMinUntilDispatch = timeLeftInMsUntilDispatch / 60000;

        // If there is at least one hour left until dispatch
        if (timeLeftInMinUntilDispatch > 60) {
            const hours = timeLeftInMinUntilDispatch / 60;
            const hoursLeftUntilDispatch = Math.floor(hours);
            const minutesLeftUntilDispatch = Math.round((hours - hoursLeftUntilDispatch) * 60);

            setHoursLeftUntilDispatch(hoursLeftUntilDispatch);
            setMinutesLeftUntilDispatch(minutesLeftUntilDispatch);
        } else {
            setHoursLeftUntilDispatch(0);
            setMinutesLeftUntilDispatch(0);
        }
    }, [dispatchHours, dispatchMinutes]);

    useEffect(() => {
        if (getDispatchHours && date && dispatchHours) {
            setDispatchTimeLeft();
            // Update time left each 5 seconds
            const interval = setInterval(() => {
                setDispatchTimeLeft();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [getDispatchHours, date, city, setDispatchTimeLeft, dispatchHours]);

    return {
        date,
        hoursLeftUntilDispatch,
        minutesLeftUntilDispatch
    };
};
