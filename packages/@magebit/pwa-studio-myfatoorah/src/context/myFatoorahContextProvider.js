import {node} from "prop-types";
import React, {createContext, useContext, useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";

import {useExternalScript} from "../talons/useExternalScript";

import { getDirection, Directions } from '@app/hooks/useDirection';
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import { useUserContext } from '@magento/peregrine/lib/context/user';
import classes from './context.module.css'

const MyFatoorahContext = createContext({});

const MyFatoorahContextProvider = ({children}) => {
    const [scriptUrl, setScriptUrl] = useState(null);
    const externalScript = useExternalScript(scriptUrl);
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();

    const [myFatoorahState, setMyFatoorahState] = useState({
        cardFieldsComplete: false,
        cardBrand: null,
        cardLast4: null,
        secureRequired: false,
        paymentIntents: [],
        externalScriptLoaded: false
    });

    const [myFatoorahConfig, setMyFatoorahConfig] = useState({
        isTesting: null,
        countryCode: "KWT",
        sessionId: null,
        cardViewId: "card-element",
        style: {
            direction: getDirection() === Directions.rtl ? "rtl" : "ltr",
            cardHeight: isUserSignedIn ? 200 : 150
        }
    })

    useEffect(() => {
        if (myFatoorahConfig.isTesting !== null) {
            if(myFatoorahConfig.isTesting) {
                setScriptUrl('https://demo.myfatoorah.com/cardview/v1/session.js');
            } else {
                setScriptUrl('https://portal.myfatoorah.com/cardview/v1/session.js');
            }
        }
    }, [myFatoorahConfig.isTesting])

    useEffect(() => {
        if (externalScript === 'ready') {
            setMyFatoorahState(prevState => ({
                ...prevState,
                externalScriptLoaded: true
            }))
        }
    }, [externalScript, setMyFatoorahState])

    if (externalScript.loading) {
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

    return (
        <MyFatoorahContext.Provider value={{
            myFatoorahState,
            setMyFatoorahState,
            myFatoorahConfig,
            setMyFatoorahConfig
        }}>
            {children}
        </MyFatoorahContext.Provider>
    );
};

MyFatoorahContextProvider.propTypes = {
    children: node
}

export default MyFatoorahContextProvider;
export const useMyFatoorahContext = () => useContext(MyFatoorahContext);

