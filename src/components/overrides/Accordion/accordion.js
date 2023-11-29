import { bool, node, shape, string } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useAccordion } from '@magento/peregrine/lib/talons/Accordion/useAccordion';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accordion.module.css';

const AccordionContext = createContext();
const { Provider } = AccordionContext;

const Accordion = props => {
    const { canOpenMultiple = true, children } = props;

    // The talon is the source of truth for the context value.
    const talonProps = useAccordion({ canOpenMultiple, children });
    const { handleSectionToggle, openSectionIds } = talonProps;
    const contextValue = {
        handleSectionToggle,
        openSectionIds
    };

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Provider value={contextValue}>
            <div className={classes.root}>{children}</div>
        </Provider>
    );
};

Accordion.propTypes = {
    canOpenMultiple: bool,
    children: node,
    classes: shape({
        root: string
    })
};

export default Accordion;

export const useAccordionContext = () => useContext(AccordionContext);
