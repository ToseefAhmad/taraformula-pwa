import { object } from 'prop-types';
import React, { useEffect, useState } from 'react';

import { useProductContext } from '@app/components/overrides/ProductFullDetail/productFullDetail';
import { useYotpoConfig } from '@app/components/Yotpo/useYotpoConfig';
import YotpoSlider from '@app/components/Yotpo/yotpoSlider';
import SliderShimmer from '@app/pageBuilder/ContentTypes/Slider/slider.shimmer';
import { useCmsPageContext } from '@app/RootComponents/CMS/cms';

const yotpoApiHost = 'https://api.yotpo.com/';
const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

const getMedia = async (config = {}) => {
    const pageNumber = config.pageNumber || 1;
    const pageSize = config.pageSize || 10;
    const album = config.album || 'album';
    const storeViewKey = config.storeViewKey || 'key';
    const url = `${yotpoApiHost}v1/widget/${storeViewKey}/albums/by_name?album_name=${album}&page=${pageNumber}&per_page=${pageSize}`;

    /* eslint no-console: ["warn", { allow: ["log"] }] */
    console.log(url);

    try {
        const response = await fetch(url, { method: 'GET', headers });
        const imagesResponse = await response.json();

        return imagesResponse.status.code === 200 ? imagesResponse.response.images : [];
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error loading Yotpo: ' + e.message);
        return [];
    }
};

const Yotpo = ({ yotpoConfig = {} }) => {
    const [yotpoItems, setYotpoItems] = useState(null);

    const { storeConfig } = useYotpoConfig();
    const productContext = useProductContext();
    const cmsPageContext = useCmsPageContext();
    const apiKey = storeConfig.yotpo_api_key;

    useEffect(() => {
        if (!apiKey) return;

        getMedia(yotpoConfig).then(images => {
            if (images) {
                setYotpoItems(images);
            }
        });
    }, [yotpoConfig, apiKey]);

    if (!yotpoItems) {
        return <SliderShimmer />;
    } else if (!yotpoItems.length) {
        return null;
    }

    return (
        <div>
            <YotpoSlider
                items={yotpoItems}
                config={yotpoConfig}
                isProductPage={
                    (productContext && productContext.isProductPage) || (cmsPageContext && cmsPageContext.isCmsPage)
                }
            />
        </div>
    );
};

Yotpo.propTypes = {
    yotpoConfig: object
};

export default Yotpo;
