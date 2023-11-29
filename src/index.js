import React from 'react';
import { render } from 'react-dom';

import { registerPageBuilder } from '@app/pageBuilder';
import app from '@magento/peregrine/lib/store/actions/app';
import Adapter from '@magento/venia-ui/lib/components/Adapter';

import { registerSW } from './registerSW';
import store from './store';
import './theme/index.css';

// Register custom Page Builder components
registerPageBuilder();

// Server rendering differs from browser rendering
const isServer = !globalThis.document;

// eslint-disable-next-line no-warning-comments
// TODO: on the server, the http request should provide the origin
const origin = isServer ? process.env.MAGENTO_BACKEND_URL : globalThis.location.origin;

// On the server, components add styles to this set and we render them in bulk
const styles = new Set();

const tree = <Adapter origin={origin} store={store} styles={styles} />;

if (isServer) {
    // eslint-disable-next-line no-warning-comments
    // TODO: ensure this actually renders correctly
    import('react-dom/server').then(({ default: ReactDOMServer }) => {
        // eslint-disable-next-line no-console
        console.log(ReactDOMServer.renderToString(tree));
    });
} else {
    render(tree, document.getElementById('root'));
    registerSW();

    globalThis.addEventListener('online', () => {
        store.dispatch(app.setOnline());
    });
    globalThis.addEventListener('offline', () => {
        store.dispatch(app.setOffline());
    });
}
