import { useEffect, useMemo, useState } from 'react';

import { useYotpoConfig } from '../Yotpo/useYotpoConfig';

export const useProductRichSnippet = props => {
    const { product } = props;
    const { storeConfig } = useYotpoConfig();
    const [yotpoReviews, SeYotpoReviews] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            /* Source: https://apidocs.yotpo.com/reference/get-bottom-line-total-reviews-and-average-score */

            const url = `https://api.yotpo.com/products/${storeConfig.yotpo_api_key}/${product.id}/bottomline`;
            try {
                const fetchReviews = await fetch(url, { 'Content-Type': 'application/json', mode: 'cors' });
                const data = await fetchReviews.json();
                SeYotpoReviews(data.response.bottomline);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }
        };

        if (!yotpoReviews) fetchData();
    }, [storeConfig.yotpo_api_key, product.id, yotpoReviews]);

    const availabilityStatus = useMemo(() => {
        if (product && product.stock_status === 'IN_STOCK') {
            return 'https://schema.org/InStock';
        } else {
            return 'https://schema.org/OutOfStock';
        }
    }, [product]);

    const productStructuredData = useMemo(() => {
        if (!product) return;

        const baseUrl = globalThis.location.origin;
        const price = product.price_range.maximum_price.final_price;
        const image = product.media_gallery_entries.map(item => `${baseUrl}/media/catalog/${item.file}`);

        if (yotpoReviews && yotpoReviews.total_reviews) {
            const structuredData = {
                '@context': 'https://schema.org/',
                '@type': 'Product',
                name: product.name,
                image,
                description: product.description_string,
                sku: product.sku,
                brand: {
                    '@type': 'Brand',
                    name: 'Tara'
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    reviewCount: yotpoReviews.total_reviews,
                    ratingValue: yotpoReviews.average_score
                },
                offers: {
                    '@type': 'Offer',
                    price: price.value,
                    priceCurrency: price.currency,
                    availability: availabilityStatus,
                    url: product.canonical_full_url
                }
            };

            return structuredData;
        }
        const structuredDataWithoutAggregateRating = {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image,
            description: product.description_string,
            sku: product.sku,
            brand: {
                '@type': 'Brand',
                name: 'Tara'
            },
            offers: {
                '@type': 'Offer',
                price: price.value,
                priceCurrency: price.currency,
                availability: availabilityStatus,
                url: product.canonical_full_url
            }
        };

        return structuredDataWithoutAggregateRating;
    }, [availabilityStatus, product, yotpoReviews]);

    return {
        productStructuredData
    };
};
