import React from 'react';

import { BannerShimmer } from '@magento/pagebuilder/lib/ContentTypes/Banner';
import bannerConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Banner/configAggregator';
import buttonItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ButtonItem/configAggregator';
import buttonsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Buttons/configAggregator';
import columnConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Column/configAggregator';
import ColumnGroup from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup';
import columnGroupConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup/configAggregator';
import imageConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Image/configAggregator';
import Row from '@magento/pagebuilder/lib/ContentTypes/Row';
import sliderConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Slider/configAggregator';
import videoConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Video/configAggregator';

import { AccordionShimmer } from './ContentTypes/Accordion';
import accordionConfigAggregator from './ContentTypes/Accordion/configAggregator';
import accordionItemConfigAggregator from './ContentTypes/AccordionItem/configAggregator';
import BestsellerSlider from './ContentTypes/BestsellerSlider';
import bestsellersConfigAggregator from './ContentTypes/BestsellerSlider/configAggregator';
import ButtonItem from './ContentTypes/ButtonItem';
import { ButtonsShimmer } from './ContentTypes/Buttons';
import Column from './ContentTypes/Column';
import { ImageShimmer } from './ContentTypes/Image';
import iubendaBlockConfigAggregator from './ContentTypes/Iubenda/configAggregator';
import productsConfigAggregator from './ContentTypes/Products/configAggregator';
import rowConfigAggregator from './ContentTypes/Row/configAggregator';
import { SliderShimmer } from './ContentTypes/Slider';
import yotpoInstagramBlockConfigAggregator from './ContentTypes/YotpoInstagramBlock/configAggregator';

export const contentTypesConfig = {
    row: {
        configAggregator: rowConfigAggregator,
        component: Row
    },
    column: {
        configAggregator: columnConfigAggregator,
        component: Column
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Products'))
    },
    image: {
        configAggregator: imageConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Image')),
        componentShimmer: ImageShimmer
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Buttons')),
        componentShimmer: ButtonsShimmer
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    mc_bestseller_slider: {
        configAggregator: bestsellersConfigAggregator,
        component: BestsellerSlider
    },
    accordion: {
        configAggregator: accordionConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Accordion')),
        componentShimmer: AccordionShimmer
    },
    'accordion-item': {
        configAggregator: accordionItemConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/AccordionItem'))
    },
    mc_yotpo_instagram_block: {
        configAggregator: yotpoInstagramBlockConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/YotpoInstagramBlock')),
        componentShimmer: SliderShimmer
    },
    mc_iubenda_block: {
        configAggregator: iubendaBlockConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Iubenda'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Video'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    'column-line': {
        configAggregator: columnGroupConfigAggregator,
        component: ColumnGroup
    }
};
