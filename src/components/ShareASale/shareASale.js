import { string } from 'prop-types';
import React, { useEffect } from 'react';

const ShareASale = props => {
    useEffect(() => {
        if (!props.orderNumber) {
            const script = document.createElement('script');
            script.src = 'https://www.dwin1.com/55969.js';
            script.async = true;
            script.type = 'text/javascript';
            script.defer = 'defer';
            document.body.appendChild(script);
        }
    }, [props.orderNumber]);

    return (
        <>
            {props.orderNumber ? (
                <img
                    src={`https://www.shareasale.com/sale.cfm?tracking=${props.orderNumber}&amount=${
                        props.subtotal
                    }&merchantID=143383&transtype=sale`}
                    alt="shareASale"
                    width="1"
                    height="1"
                />
            ) : null}
        </>
    );
};

ShareASale.propTypes = {
    orderNumber: string,
    subtotal: string
};

export default ShareASale;
