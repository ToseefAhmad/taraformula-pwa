import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import { useStoreCodeInUrl } from '@app/hooks/useStoreCodeInUrl';

import { GET_GEOLOCATION_CITY } from './geolocation.gql';

export const useGeolocation = () => {
    const [coordinates, setCoordinates] = useState('');
    const [city, setCity] = useState('');
    const [alternateCity, setAlternateCity] = useState('');
    const [allowedGpsLocation, setAllowedGpsLocation] = useState(false);
    const { storeConfigData } = useStoreConfigContext();
    const [cookies, setOriginalCookie] = useCookies();
    const { storeCodeInUrl, storeCode } = useStoreCodeInUrl();

    const [getGeolocation, { data }] = useLazyQuery(GET_GEOLOCATION_CITY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const isGeolocationEnabled = useMemo(() => {
        return storeConfigData && storeConfigData.storeConfig && storeConfigData.storeConfig.geolocation_enabled;
    }, [storeConfigData]);

    const gpsLifetime = useMemo(() => {
        return storeConfigData && storeConfigData.storeConfig && storeConfigData.storeConfig.geolocation_gps_lifetime;
    }, [storeConfigData]);

    useEffect(() => {
        if (coordinates) {
            getGeolocation({ variables: { coordinates } });
        }
    }, [coordinates, getGeolocation]);

    useEffect(() => {
        if (isGeolocationEnabled) {
            if (cookies.location_response) {
                // If we have a stored cookie with the response data, use this data to prevent browser prompts for GPS.
                setCity(cookies.location_response.city);
                setAlternateCity(cookies.location_response.alternateCity);
            } else if (allowedGpsLocation && gpsLifetime && !cookies.location_response && data) {
                // Otherwise, use the backend response to set the data and save this cookie.
                setCity(data && data.getGeolocationData && data.getGeolocationData.city);
                setAlternateCity(data && data.getGeolocationData && data.getGeolocationData.alternate_city);

                const locationResponse = {
                    city: data.getGeolocationData.city,
                    alternateCity: data.getGeolocationData.alternate_city
                };

                setOriginalCookie('location_response', JSON.stringify(locationResponse), {
                    expires: new Date(new Date().setTime(new Date().getTime() + gpsLifetime * 60 * 60 * 1000)),
                    path: storeCodeInUrl() ? `/${storeCode}` : '/'
                });
            }
        }
    }, [
        allowedGpsLocation,
        cookies.location_response,
        data,
        gpsLifetime,
        isGeolocationEnabled,
        setOriginalCookie,
        storeCode,
        storeCodeInUrl
    ]);

    // Successfully gained consent to user location.
    const onSuccess = useCallback(position => {
        setCoordinates(`${position.coords.latitude},${position.coords.longitude}`);
        setAllowedGpsLocation(true);
    }, []);

    // Failed gaining consent to user location.
    const onError = useCallback(() => {
        setCoordinates('fail'); // Update state to send the request to the backend.
    }, []);

    if (isGeolocationEnabled && !cookies.location_response && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    return {
        coordinates,
        city,
        alternateCity
    };
};
