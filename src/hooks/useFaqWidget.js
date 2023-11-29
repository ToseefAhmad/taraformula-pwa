import { useEffect } from 'react';

const QUESTION_BUTTON_SELECTOR = '.faq-section-wrapper';
const ICON_SELECTOR = '.faq-icon';

export const useFaqWidget = () => {
    const questionButtons = document.querySelectorAll(QUESTION_BUTTON_SELECTOR);

    useEffect(() => {
        questionButtons.length &&
            questionButtons.forEach(item => {
                item.addEventListener('click', () => {
                    const answer = item.nextElementSibling;
                    const icon = item.querySelector(ICON_SELECTOR);
                    if (item.classList.contains('active')) {
                        item.classList.remove('active');
                        icon.classList.remove('icon-minus');
                        icon.classList.add('icon-plus');
                        answer.classList.add('hidden');
                    } else {
                        item.classList.add('active');
                        icon.classList.remove('icon-plus');
                        icon.classList.add('icon-minus');
                        answer.classList.remove('hidden');
                    }
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionButtons.length]);
};
