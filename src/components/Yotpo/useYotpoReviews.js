import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';

const injectScript = appKey => {
    /* Source: https://support.yotpo.com/en/article/generic-other-platforms-installing-yotpo */
    const script = document.createElement('script');
    script.async = true;
    script.src = '//staticw2.yotpo.com/' + appKey + '/widget.js';
    script.dataset.script = 'yotpo-reviews';
    document.head.append(script);

    return script;
};

export const useYotpoReviews = appKey => {
    useEffect(() => {
        if (!appKey) return;

        const yotpoScript = document.querySelector('[data-script="yotpo-reviews"]');

        if (yotpoScript) {
            yotpoScript.remove();
        }

        const script = injectScript(appKey);
        return () => {
            script.remove();
        };
    }, [appKey]);
};

export const useYotpoReviewsRefresh = (debounceTime = 200) => {
    const debouncedRefresh = useMemo(() => {
        const refreshWidgets = window.yotpo ? window.yotpo.refreshWidgets.bind(window.yotpo) : () => {};

        return debounce(refreshWidgets, debounceTime);
    }, [debounceTime]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.yotpo) {
            debouncedRefresh();
        }
    }, [debouncedRefresh]);
};
