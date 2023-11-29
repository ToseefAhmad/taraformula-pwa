import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { useTrackingContext } from '@app/context/Tracking';
import { useGdprCookie } from '@app/hooks/useGdprCookie';
import useTracking from '@app/hooks/useTracking/useTracking';

import { GET_COOKIE_BANNER_CONFIG, SET_COOKIE_CONSENT } from './grprPopUp.gql';

const CONSENT_SET_COOKIE = 'cookie_consent_set';

export const useGdprPopUp = () => {
    const [selectedGroupIds, setSelectedGroupIds] = useState([]);
    const { data, loading } = useQuery(GET_COOKIE_BANNER_CONFIG);
    const [submitted, setSubmitted] = useState(false);
    const { cookies, setCookie, clearDisallowedCookies } = useGdprCookie();
    const [setCookieConsent] = useMutation(SET_COOKIE_CONSENT);
    const { trackCookieConsent } = useTracking();
    const [, { setCookieConsent: setTrackingConsent }] = useTrackingContext();
    const { getCookieBannerConfig } = data || {};
    const { enabled } = getCookieBannerConfig || false;
    const handleSubmit = async values => {
        const groupIds = [];
        Object.keys(values).forEach(key => {
            if (values[key]) {
                groupIds.push(parseInt(key, 10));
            }
        });

        trackCookieConsent({ type: 'submit' });
        setTrackingConsent(groupIds);
        setSubmitted(true);
        const result = await setCookieConsent({
            variables: {
                groupIds
            }
        });

        if (result.data && result.data.setCookieConsent) {
            setCookie(CONSENT_SET_COOKIE, true, {
                expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            });
            clearDisallowedCookies();
        }
    };

    const handleAllSubmit = async () => {
        setSubmitted(true);
        const result = await setCookieConsent({
            variables: {
                isAllAllowed: true
            }
        });

        if (result.data && result.data.setCookieConsent) {
            setCookie(CONSENT_SET_COOKIE, true, {
                expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            });
        }
    };

    const handleGroupStatus = (value, groupId) => {
        if (value && !selectedGroupIds.includes(groupId)) {
            setSelectedGroupIds([...selectedGroupIds, groupId]);
        } else if (!value && selectedGroupIds.includes(groupId)) {
            setSelectedGroupIds(selectedGroupIds.filter(id => id !== groupId));
        }
    };

    useEffect(() => {
        if (data && data.getCookieBannerConfig) {
            setSelectedGroupIds(data.getCookieBannerConfig.groups.map(group => group.id));
        }
    }, [data]);

    const groups = (data && data.getCookieBannerConfig && data.getCookieBannerConfig.groups) || [];
    const notificationText = (data && data.getCookieBannerConfig && data.getCookieBannerConfig.notificationText) || '';

    const initialValues = {};
    groups.forEach(group => {
        initialValues[group.id.toString()] = true;
    });

    return {
        groups,
        notificationText,
        initialValues,
        isHidden:
            (cookies && !!cookies[CONSENT_SET_COOKIE] && !!cookies.amcookie_allowed) ||
            loading ||
            submitted ||
            !enabled,
        handleSubmit,
        handleAllSubmit,
        handleGroupStatus
    };
};
