import { func } from 'prop-types';
import React from 'react';

import CmsBlockAdvanced from '@app/components/CmsBlockAdvanced';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './topBar.module.css';

const TopBar = ({ setCmsBlockLoaded }) => {
    const identifiers = 'header_top_bar';

    const blockShimmer = () => <Shimmer width={'100%'} height={'22px'} />;

    return (
        <CmsBlockAdvanced
            identifiers={identifiers}
            propsClasses={{
                root: classes.root,
                block: classes.topBarBlock,
                content: classes.topBarContent
            }}
            shimmer={blockShimmer}
            setCmsBlockLoaded={setCmsBlockLoaded}
        />
    );
};

TopBar.propTypes = {
    setCmsBlockLoaded: func
};

export default TopBar;
