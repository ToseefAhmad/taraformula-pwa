import { shape, string } from 'prop-types';
import React from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const YotpoItemShimmer = ({ classes }) => {
    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer key="image">
                <Image
                    alt="Placeholder for item image"
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </Shimmer>
            <Shimmer width="100%" key="title" />
        </div>
    );
};

YotpoItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default YotpoItemShimmer;
