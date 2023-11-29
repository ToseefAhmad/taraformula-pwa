import { bool, string, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Close } from '@app/components/Icons';
import classes from '@app/components/Ingredients/IngredientProductPage/ingredientProductPage.module.css';
import { useScrollLock } from '@magento/peregrine';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const IngredientsPopUp = ({ data, handleClose, isPopOpen }) => {
    // Keep scroll lock
    useScrollLock(isPopOpen);

    // Don't load content if its false
    if (!isPopOpen) {
        return null;
    }

    return (
        <Portal>
            <div className={isPopOpen ? classes.popUpWrapper : classes.hidden}>
                <div className={classes.popUp}>
                    <div className={classes.contentWrapper}>
                        <div className={classes.popUpHeader}>
                            <div className={classes.header}>
                                <FormattedMessage
                                    id={'ingredients.allIngredients'}
                                    defaultMessage={'All ingredients'}
                                />
                            </div>
                            <div className={classes.iconDiv}>
                                <Close onClick={handleClose} />
                            </div>
                        </div>

                        <RichContent classes={{ root: classes.ingredientsList }} html={data} />
                    </div>
                </div>
            </div>
        </Portal>
    );
};

IngredientsPopUp.propTypes = {
    data: string,
    handleClose: func,
    isPopOpen: bool
};

export default IngredientsPopUp;
