import { object } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import classes from '@app/components/Iubenda/iubenda.module.css';
import useIubenda from '@app/components/Iubenda/useIubenda';
import { getDirection, Directions } from '@app/hooks/useDirection';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const Iubenda = ({ iubendaConfig = {} }) => {
    const { content, loading, hasError } = useIubenda({ iubendaConfig });

    const shimmerContent = (
        <Fragment>
            <Shimmer width={'60%'} height={'30px'} style={{ marginBottom: '10px' }} />
            <Shimmer width={'100%'} height={'100px'} style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Shimmer width={'60%'} height={'30px'} style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Shimmer width={'100%'} height={'100px'} style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Shimmer width={'60%'} height={'30px'} style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Shimmer width={'100%'} height={'100px'} style={{ marginTop: '10px', marginBottom: '10px' }} />
        </Fragment>
    );

    const pageContent = loading ? (
        shimmerContent
    ) : (
        <div className={classes.root} dangerouslySetInnerHTML={{ __html: content }} />
    );

    return !hasError ? (
        pageContent
    ) : (
        <div {...(getDirection() === Directions.rtl ? { dir: Directions.rtl } : null)}>
            <FormattedMessage id="iubenda.error" defaultMessage="Something went wrong. Please try again later" />
        </div>
    );
};

Iubenda.propTypes = {
    iubendaConfig: object
};

export default Iubenda;
