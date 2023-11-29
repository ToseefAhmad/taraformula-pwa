import { useEffect } from 'react';

const injectScript = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//checkout.tabby.ai/tabby-promo.js';
    script.dataset.script = 'tabby-promo-script';
    document.head.append(script);

    return script;
};

export const useTabbyPromoScript = () => {
    useEffect(() => {
        const tabbyPromoScript = document.querySelector('[data-script="tabby-promo-script"]');

        if (tabbyPromoScript) {
            tabbyPromoScript.remove();
        }

        const script = injectScript();

        return () => {
            script.remove();
        };
    }, []);
};
