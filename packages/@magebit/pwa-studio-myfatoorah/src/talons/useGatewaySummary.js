import {useGatewayContext} from "../context/gatewayContextProvider";

export const useGatewaySummary = () => {

    const {
        myFatoorahState,
        myFatoorahConfig,
    } = useGatewayContext();

    return {
        myFatoorahState,
        myFatoorahConfig
    };
};
