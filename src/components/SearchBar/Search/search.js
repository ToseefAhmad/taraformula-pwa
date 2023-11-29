import { Form } from 'informed';
import PropTypes from 'prop-types';
import React from 'react';
import { X } from 'react-feather';

import Autocomplete from '../Autocomplete/autocomplete';
import SearchField from '../Field/searchField';

import { ArrowRightLong } from '@app/components/Icons';
import Icon from '@app/components/overrides/Icon';
import { useScreenSize } from '@app/hooks/useScreenSize';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './search.module.css';
import { useSearch } from './useSearch';

const Search = ({ isOpen, toggleSearch, offsetTop, searchRef }) => {
    const {
        handleChange,
        handleSubmit,
        initialValues,
        valid,
        isFocused,
        setIsFocused,
        setFormApi,
        submitForm,
        loading,
        setLoading
    } = useSearch({ isOpen, toggleSearch });
    const { isDesktopScreen } = useScreenSize();
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const loadingIndicatorClassName = loading ? classes.loaderIcon : classes.loaderIcon_hidden;

    return (
        <div
            ref={searchRef}
            className={rootClassName}
            style={{ top: offsetTop, maxHeight: 'calc(100% - ' + offsetTop + 'px)' }}
        >
            <div className={classes.container}>
                <Form
                    getApi={setFormApi}
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.search}>
                        <SearchField isSearchOpen={isOpen} onChange={handleChange} setIsFocused={setIsFocused} />
                        <LoadingIndicator classes={{ root: loadingIndicatorClassName }} />
                        {isFocused ? (
                            <button
                                type="button"
                                disabled={!valid}
                                onMouseDown={submitForm}
                                className={classes.goButton}
                            >
                                <Icon src={ArrowRightLong} classes={{ icon: classes.searchIcon }} />
                            </button>
                        ) : (
                            <button type="button" onClick={toggleSearch} className={classes.closeButton}>
                                <Icon
                                    size={isDesktopScreen ? 44 : 34}
                                    src={X}
                                    classes={{ icon: classes.searchIcon }}
                                    attrs={{ strokeWidth: 'currentStrokeWidth' }}
                                />
                            </button>
                        )}
                    </div>
                    <div className={classes.autocomplete}>
                        <Autocomplete valid={valid} setLoading={setLoading} toggleSearch={toggleSearch} />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Search;

Search.propTypes = {
    isOpen: PropTypes.bool,
    toggleSearch: PropTypes.func.isRequired,
    searchRef: PropTypes.any.isRequired,
    offsetTop: PropTypes.number
};
