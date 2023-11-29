import { useEffect } from 'react';

export const useWriteReview = () => {
    const button = document.querySelector('.write-question-review-buttons-container');
    const reviewButton = button && button.cloneNode(true);
    const reviewContainer = document.querySelector('.write-review-wrapper.write-form');

    useEffect(() => {
        const reviewButtonHandler = () => {
            if (reviewContainer.style.maxHeight !== '0px' && reviewContainer.clientHeight !== 0) {
                reviewContainer.style.maxHeight = '0px';
            } else {
                reviewContainer.style.maxHeight = reviewContainer.scrollHeight + 200 + 'px';
            }
        };

        if (reviewContainer) {
            reviewContainer.style.maxHeight = '0px';

            try {
                button.parentNode.replaceChild(reviewButton, button);
            } catch (error) {
                console.error('Yotpo button parentnode is null ' + error);
            }
        }

        reviewButton && reviewButton.addEventListener('click', reviewButtonHandler);

        return () => {
            reviewButton && reviewButton.removeEventListener('click', reviewButtonHandler);
        };
    }, [button, reviewButton, reviewContainer]);
};
