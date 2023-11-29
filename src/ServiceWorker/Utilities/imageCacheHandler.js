import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst } from 'workbox-strategies';

import { THIRTY_DAYS, IMAGES_CACHE_NAME, MAX_NUM_OF_IMAGES_TO_CACHE } from '../defaults';

import { MESSAGE_TYPES } from '@magento/peregrine/lib/util/swUtils';

import { registerMessageHandler } from './messageHandler';
import { isFastNetwork } from './networkUtils';

const imageRegex = new RegExp(/\.(?:png|jpg|jpeg)$/);

const getWidth = url => Number(new URLSearchParams(url.search).get('width'));

const isImage = url => imageRegex.test(url.pathname);

/**
 * IsResizedImage is route checker for workbox
 * that returns true for a valid resized image URL.
 *
 * @param {url: URL, event: FetchEvent} workboxRouteObject
 *
 * @returns {boolean}
 */
export const isResizedImage = ({ url }) => isImage(url) && !isNaN(getWidth(url));

/**
 * This function tries to find same or a larger image
 * from the images cache storage.
 *
 * @param {URL} url
 *
 * @returns {Promise | undefined} A promise that resolves to a valid response
 * object from cache or undefined if the a match could not be found.
 */
export const findSameOrLargerImage = async url => {
    const isYotpoImage = (typeof url === 'string' ? url : url.host).indexOf('yotpo') !== -1;
    const origUrl = url;
    const requestedWidth = getWidth(url);
    const requestedFilename = url.pathname.split('/').reverse()[0];

    const cache = await caches.open(IMAGES_CACHE_NAME);
    const cachedURLs = await cache.keys();
    const cachedSources = await cachedURLs.filter(({ url }) => {
        const cachedImageUrl = new URL(url);
        const cachedFileName = cachedImageUrl.pathname.split('/').reverse()[0];

        // Hack to fetch yotpo urls from cache (they all have similar filenames but different url paths)
        return isYotpoImage ? origUrl.pathname === cachedImageUrl.pathname : cachedFileName === requestedFilename;
    });

    // Find the cached version of this image that is closest to the requested
    // Width without going under it.
    let best = { difference: Infinity, candidate: null };
    for (const candidate of cachedSources) {
        const width = getWidth(new URL(candidate.url));
        /**
         * If the cached image has no resize param continue because
         * we can't safely use it
         */
        if (isNaN(width)) {
            continue;
        }

        const difference = width - requestedWidth;

        /**
         * If cached image is smaller than requested continue because
         * we can't safely use it
         */
        // Use candidate if difference equal 100
        if (difference < -100) {
            continue;
        }

        /**
         * If the cached image is same as what we are looking for, return.
         */
        if (difference === 0) {
            return await cache.match(candidate);
        }

        /**
         * If the cached image is larger than what we saw till now, update
         * the candidate and keep looking for a better version.
         */
        if (difference < best.difference) {
            best = {
                difference,
                candidate
            };
        }
    }
    if (best.candidate) {
        const bestCachedResponse = await cache.match(best.candidate);
        // eslint-disable-next-line no-console
        console.log(
            `ServiceWorker responding to GET ${url.pathname} at ${requestedWidth}w with cached version ${
                best.difference
            }px larger: ${bestCachedResponse.url}`
        );
        return bestCachedResponse;
    }
};

const fetchAndCacheImage = imageURL =>
    fetch(imageURL, { mode: 'no-cors' }).then(response =>
        caches
            .open(IMAGES_CACHE_NAME)
            .then(cache => cache.put(imageURL, response.clone()))
            .then(() => response)
    );

const fetchIfNotCached = imageURL =>
    new Promise(resolve => {
        caches.match(imageURL).then(res => {
            res ? resolve(res) : resolve(fetchAndCacheImage(imageURL));
        });
    });

const handleImagePreFetchRequest = (payload, event) => {
    if (isFastNetwork()) {
        return Promise.all(payload.urls.map(fetchIfNotCached))
            .then(responses => {
                event.ports[0].postMessage({ status: 'done' });
                return responses;
            })
            .catch(err => {
                event.ports[0].postMessage({
                    status: 'error',
                    message: JSON.stringify(err)
                });
                return null;
            });
    } else {
        event.ports[0].postMessage({
            status: 'error',
            message: `Slow Network detected. Not pre-fetching images. ${payload.urls}`
        });
        return null;
    }
};

/**
 * This function registers all message handlers related to
 * image prefetching.
 *
 * Messages it registers handlers to:
 *
 * 1. PREFETCH_IMAGES
 */
export const registerImagePreFetchHandler = () => {
    registerMessageHandler(MESSAGE_TYPES.PREFETCH_IMAGES, handleImagePreFetchRequest);
};

/**
 * This function creates a handler that workbox can use
 * to handle all images.
 */
export const createImageCacheHandler = () =>
    new CacheFirst({
        cacheName: IMAGES_CACHE_NAME,
        plugins: [
            new ExpirationPlugin({
                maxEntries: MAX_NUM_OF_IMAGES_TO_CACHE,
                maxAgeSeconds: THIRTY_DAYS,
                matchOptions: {
                    ignoreVary: true
                }
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    });
