import {node} from "prop-types";
import React, {createContext, useContext, useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";

import {useExternalScript} from "../talons/useExternalScript";

import { getDirection, Directions } from '@app/hooks/useDirection';
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {useGatewayConfig} from "../talons/useGatewayConfig";

import classes from './context.module.css'
const GatewayContext = createContext({});

const GatewayContextProvider = ({children}) => {

    const { gatewayConfig, gatewayConfigLoading } = useGatewayConfig();

    const [myFatoorahState, setMyFatoorahState] = useState({
        selectedGateway: null,
        gatewayName: null
    });

    if (gatewayConfigLoading) {
        return (
            <div className={classes.spacing}>
                <h4>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h4>
                <LoadingIndicator>
                    <FormattedMessage
                        id={'checkoutPage.loadingPaymentInformation'}
                        defaultMessage={'Fetching Payment Information'}
                    />
                </LoadingIndicator>
            </div>
        );
    }

    if(gatewayConfig.storeConfig.myfatoorah_gateway_enabled === "1") {
        return (
            <GatewayContext.Provider value={{
                myFatoorahState,
                setMyFatoorahState
            }}>
                {children}
            </GatewayContext.Provider>
        );
    }

    return (
        <div>{children}</div>
    )
};

GatewayContextProvider.propTypes = {
    children: node
}

export default GatewayContextProvider;
export const useGatewayContext = () => useContext(GatewayContext);

