import { shape, string, bool, func } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { Search as SearchIcon } from '@app/components/Icons';
import { useSearchTrigger } from '@magento/peregrine/lib/talons/Header/useSearchTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components//Icon';

import defaultClasses from './searchTrigger.module.css';

const SearchTrigger = React.forwardRef((props, ref) => {
    const { active, onClick } = props;

    const talonProps = useSearchTrigger({
        onClick
    });

    const { handleClick } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const searchClass = active ? classes.open : classes.root;

    const searchText = formatMessage({
        id: 'searchTrigger.search',
        defaultMessage: 'Search'
    });

    return (
        <button className={searchClass} aria-label={searchText} onClick={handleClick} ref={ref}>
            <Icon src={SearchIcon} />
        </button>
    );
});

SearchTrigger.propTypes = {
    classes: shape({
        root: string,
        open: string
    }),
    active: bool,
    onClick: func
};

export default SearchTrigger;
