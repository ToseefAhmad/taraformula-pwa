import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const initialValues = { search_query: '' };

/**
 * Returns props necessary to render a Search component.
 *
 * @param {Function} toggleSearch
 * @returns {{initialValues: {search_query: string}, valid: boolean, handleSubmit: ((function({search_query: *}): void)|*), setValid: (value: (((prevState: boolean) => boolean) | boolean)) => void, handleChange: ((function(*): void)|*)}}
 */
export const useSearch = ({ toggleSearch }) => {
    const [valid, setValid] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const history = useHistory();
    const { push, listen } = history;

    // Expand or collapse on input change
    const handleChange = useCallback(
        value => {
            const hasValue = !!value;
            const isValid = hasValue && value.length > 2;
            setValid(isValid);
        },
        [setValid]
    );

    // Navigate on submit
    const handleSubmit = useCallback(
        ({ search_query }) => {
            if (!search_query && search_query.trim().length === 0) {
                search_query = '';
            }
            if (valid) {
                push(`/search.html?query=${search_query}`);
            }
        },
        [push, valid]
    );

    // Close search if location changed
    useEffect(() => {
        return listen(() => {
            toggleSearch(false);
        });
    }, [listen, toggleSearch]);

    // Submit form
    const submitForm = useCallback(() => {
        formApiRef.current.submitForm();
    }, []);

    return {
        handleChange,
        handleSubmit,
        initialValues,
        setValid,
        valid,
        isFocused,
        setIsFocused,
        formApiRef,
        setFormApi,
        submitForm,
        loading,
        setLoading
    };
};
