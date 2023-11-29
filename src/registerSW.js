import { VALID_SERVICE_WORKER_ENVIRONMENT, handleMessageFromSW } from '@magento/peregrine/lib/util/swUtils';

export const registerSW = () => {
    if (VALID_SERVICE_WORKER_ENVIRONMENT && globalThis.navigator) {
        window.navigator.serviceWorker
            .register('/sw.js')
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('SW Registered');
            })
            .catch(() => {
                /**
                 * Console.* statements are removed by webpack
                 * in production mode. window.console.* are not.
                 */
                window.console.warn('Failed to register SW.');
            });

        navigator.serviceWorker.addEventListener('message', e => {
            const { type, payload } = e.data;
            handleMessageFromSW(type, payload, e);
        });
    }
};
