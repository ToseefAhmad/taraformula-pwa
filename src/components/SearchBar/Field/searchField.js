import { Text as InformedText } from 'informed';
import { func, bool } from 'prop-types';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

import classes from './searchField.module.css';
import { useSearchField } from './useSearchField';

const SearchField = ({ isSearchOpen, onChange, setIsFocused }) => {
    const { inputRef } = useSearchField({ isSearchOpen });
    const { formatMessage } = useIntl();

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, [setIsFocused]);

    return (
        <InformedText
            field="search_query"
            placeholder={formatMessage({
                id: 'searchField.placeholder',
                defaultMessage: 'What are you looking for?'
            })}
            className={classes.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onValueChange={onChange}
            forwardedRef={inputRef}
        />
    );
};

export default SearchField;

SearchField.propTypes = {
    isSearchOpen: bool,
    onChange: func.isRequired,
    setIsFocused: func.isRequired
};
