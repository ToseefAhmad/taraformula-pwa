import { bool, func } from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import Suggestions from '../Suggestions/suggestions';

import { GET_AUTOCOMPLETE_RESULTS } from './autocomplete.gql';
import classes from './autocomplete.module.css';
import { useAutocomplete, MessageType } from './useAutocomplete';

const Autocomplete = ({ valid, setLoading, toggleSearch }) => {
    const { filters, messageType, products, showSuggestions } = useAutocomplete({
        queries: {
            getAutocompleteResults: GET_AUTOCOMPLETE_RESULTS
        },
        valid
    });

    const { formatMessage } = useIntl();
    const MESSAGES = new Map()
        .set(
            MessageType.ERROR,
            formatMessage({
                id: 'autocomplete.error',
                defaultMessage: 'An error occurred while fetching results.'
            })
        )
        .set(
            MessageType.EMPTY_RESULT,
            formatMessage({
                id: 'autocomplete.emptyResult',
                defaultMessage: 'No results were found.'
            })
        );

    const message = MESSAGES.get(messageType);
    const rootClassName = showSuggestions || message ? classes.root_visible : classes.root_hidden;

    useEffect(() => {
        if (messageType === MessageType.LOADING) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [messageType, setLoading]);

    return (
        <div className={rootClassName}>
            <div className={classes.message}>{message}</div>
            <div>
                <Suggestions
                    showSuggestions={showSuggestions}
                    products={products || {}}
                    filters={filters}
                    toggleSearch={toggleSearch}
                />
            </div>
        </div>
    );
};

export default Autocomplete;

Autocomplete.propTypes = {
    valid: bool,
    setLoading: func.isRequired,
    toggleSearch: func.isRequired
};
