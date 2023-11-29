import { useQuery } from '@apollo/client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { findBestMatch } from 'string-similarity';

import { useGeolocation } from '@app/components/Geolocation/useGeolocation';
import { usePriceSummary } from '@app/components/overrides/CartPage/PriceSummary/usePriceSummary';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

import { GET_CITY_CARRIERS } from './cityCarriers.gql';

const storage = new BrowserPersistence();

const CITY_CARRIER_SELECTED_CITY = 'city_carrier_selected_city';

export const useCityCarriers = () => {
    const { flatData } = usePriceSummary();
    const shippingAddressCity = flatData.shipping && flatData.shipping.length ? flatData.shipping[0].city : null;
    const { city: geolocatedCity, alternateCity: geolocatedAlternativeCity } = useGeolocation();

    const { data } = useQuery(GET_CITY_CARRIERS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const carriers = data && data.getCountryShippingMethods ? data.getCountryShippingMethods : null;

    // If customer selected city from popup, show estimates for this city.
    // If not, but he has a shipping address, get the city from their shipping address.
    const city = storage.getItem(CITY_CARRIER_SELECTED_CITY)
        ? storage.getItem(CITY_CARRIER_SELECTED_CITY)
        : shippingAddressCity;
    const [selectedCity, setSelectedCity] = useState(city);
    const [defaultCity, setDefaultCity] = useState(null);

    useEffect(() => {
        if (carriers) {
            const defaultLookup = carriers.filter(function(carrier) {
                return carrier.default === true;
            });

            if (defaultLookup) {
                setDefaultCity(defaultLookup[0]);
            }
        }
    }, [carriers]);

    const handleSelectCity = useCallback(
        city => {
            setSelectedCity(city);
            if (city) {
                storage.setItem(CITY_CARRIER_SELECTED_CITY, city);
            } else {
                storage.removeItem(CITY_CARRIER_SELECTED_CITY);
            }
        },
        [setSelectedCity]
    );

    const getCityData = useCallback(
        city => {
            if (carriers) {
                for (let i = 0; i < carriers.length; i++) {
                    if (carriers[i].city === city) {
                        return carriers[i];
                    }
                }
            }
            return null;
        },
        [carriers]
    );

    // Returns selected city and it's shipping methods
    const selectedCityAndCarriers = useMemo(() => {
        if (!carriers) {
            return null;
        }

        // If we have no city data, try to take the default city, otherwise take the first in the list.
        if (!selectedCity && !geolocatedCity && !geolocatedAlternativeCity) {
            return defaultCity ? defaultCity : carriers[0];
        } else {
            // If the user has manually selected a city, try to get data for it.
            let cityData = getCityData(selectedCity);

            // If the selected city doesn't exist or wasn't selected, try to find data by geolocation.
            if (!cityData) {
                const cities = carriers.map(carrier => {
                    return carrier.city;
                });

                // Find the best match from two options for a city.
                const bestCityMatch = geolocatedCity && !!cities.length ? findBestMatch(geolocatedCity, cities) : null;
                const bestAlternateMatch =
                    geolocatedAlternativeCity && !!cities.length
                        ? findBestMatch(geolocatedAlternativeCity, cities)
                        : null;
                let bestMatch;

                if (bestCityMatch && bestAlternateMatch) {
                    bestMatch =
                        bestCityMatch.bestMatch.rating > bestAlternateMatch.bestMatch.rating
                            ? bestCityMatch.bestMatch
                            : bestAlternateMatch.bestMatch;
                } else if (!bestCityMatch && !bestAlternateMatch) {
                    bestMatch = null;
                } else {
                    bestMatch = bestCityMatch ? bestCityMatch.bestMatch : bestAlternateMatch.bestMatch;
                }

                // Only match 70% or better match as a "valid" location.
                if (bestMatch && bestMatch.rating > 0.7) {
                    cityData = getCityData(bestMatch.target);
                }
            }

            // If shipping methods weren't found, this most likely means that the shipping method saved in storage
            // Is no longer saved in configs, therefore, simply return default city if available, or the first one.
            return cityData ? cityData : defaultCity ? defaultCity : carriers[0];
        }
    }, [carriers, defaultCity, geolocatedAlternativeCity, geolocatedCity, getCityData, selectedCity]);

    // If we have some city saved in storage, but this city was removed from configs, then remove it from storage as well
    useEffect(() => {
        const cityData = getCityData(selectedCity);

        if (!cityData) {
            handleSelectCity(null);
        }
    }, [selectedCity, handleSelectCity, getCityData]);

    return {
        allCitiesAndCarriers: carriers,
        selectedCityAndCarriers: selectedCityAndCarriers,
        handleSelectCity,
        selectedCity
    };
};
