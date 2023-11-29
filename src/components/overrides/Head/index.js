import { string } from 'prop-types';
import React from 'react';
export { default as HeadProvider } from '@magento/venia-ui/lib/components/Head/headProvider';
import { Helmet } from 'react-helmet-async';
import { useIntl } from 'react-intl';

Helmet.defaultProps.defer = false;

export const Link = ({ children, ...tagProps }) => {
    return (
        <Helmet>
            <link {...tagProps}>{children}</link>
        </Helmet>
    );
};

Link.propTypes = {
    children: string
};

export const Meta = ({ children, ...tagProps }) => {
    return (
        <Helmet>
            <meta {...tagProps}>{children}</meta>
        </Helmet>
    );
};

Meta.propTypes = {
    children: string
};

export const Style = ({ children, ...tagProps }) => {
    return (
        <Helmet>
            <style {...tagProps}>{children}</style>
        </Helmet>
    );
};

Style.propTypes = {
    children: string
};

export const Title = ({ children, ...tagProps }) => {
    return (
        <Helmet>
            <title {...tagProps}>{children}</title>
        </Helmet>
    );
};

Title.propTypes = {
    children: string
};

export const StoreTitle = ({ children, ...tagProps }) => {
    const { formatMessage } = useIntl();

    let titleText;

    if (children) {
        const storeName = formatMessage({
            id: 'global.pageName',
            defaultMessage: `Tara Nature's Formula`
        });
        titleText = `${children} - ${storeName}`;
    } else {
        titleText = formatMessage({
            id: 'global.global.defaultPageName',
            defaultMessage: `Tara - Nature's Formula`
        });
    }

    return (
        <Helmet>
            <title {...tagProps}>{titleText}</title>
        </Helmet>
    );
};

StoreTitle.propTypes = {
    children: string
};
