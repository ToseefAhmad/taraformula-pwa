import { useCookies } from 'react-cookie';

export const useGdprCookie = () => {
    const [cookies, setOriginalCookie, removeOriginalCookie] = useCookies();

    const setCookie = (name, value, options) => {
        const disallowedCookies = cookies.amcookie_disallowed;
        if (disallowedCookies) {
            if (disallowedCookies.split(',').includes(name)) {
                return;
            }
        }
        setOriginalCookie(name, value, options);
    };

    const clearDisallowedCookies = () => {
        const disallowedCookies = cookies.amcookie_disallowed && cookies.amcookie_disallowed.split(',');

        if (disallowedCookies && disallowedCookies.length) {
            Object.keys(cookies).forEach(cookie => {
                if (disallowedCookies.includes(cookie)) {
                    removeOriginalCookie(cookie);
                }
            });
        }
    };

    return {
        cookies,
        setCookie,
        removeCookie: removeOriginalCookie,
        clearDisallowedCookies
    };
};
