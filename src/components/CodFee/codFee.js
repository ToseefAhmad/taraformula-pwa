import React, { useMemo } from 'react';

import { useCodFee } from '@app/components/CodFee/useCodFee';

import classes from './codFee.module.css';

const CodFee = () => {
    const talonProps = useCodFee({});

    const { codData, codDataError, codDataLoading } = talonProps;

    return useMemo(() => {
        if (
            codDataLoading ||
            codDataError ||
            !codData ||
            !codData.storeConfig ||
            !codData.storeConfig.payment_cod_fee_disclaimer
        ) {
            return null;
        }

        return <span className={classes.codFeeDisclaimer}>{codData.storeConfig.payment_cod_fee_disclaimer}</span>;
    }, [codData, codDataError, codDataLoading]);
};

export default CodFee;
