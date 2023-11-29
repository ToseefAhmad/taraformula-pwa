import { useRef, useState } from 'react';

export const useImageZoom = ({ activeImageRefIndex }) => {
    const [zooming, setZooming] = useState(false);
    const lensRef = useRef([]);
    const lens = lensRef.current[activeImageRefIndex];
    const resultRef = useRef(null);
    const result = resultRef.current;
    const imageRef = useRef([]);
    const img = imageRef.current[activeImageRefIndex];

    const getCursorPos = e => {
        let x = 0;
        let y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image:*/
        const a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    };

    const moveLens = e => {
        if (img == undefined || lens == undefined || result == undefined) return;

        let x;
        let y;
        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;

        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = img.width * cx + 'px ' + img.height * cy + 'px';
        /* Prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /* Get the cursor's x and y positions:*/
        const pos = getCursorPos(e);
        /* Calculate the position of the lens:*/
        x = pos.x - lens.offsetWidth / 2;
        y = pos.y - lens.offsetHeight / 2;
        /* Prevent the lens from being positioned outside the image:*/
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        /* Set the position of the lens:*/
        lens.style.left = x + 'px';
        lens.style.top = y + 'px';
        /* Display what the lens "sees":*/
        result.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
    };

    return { imageRef, lensRef, resultRef, moveLens, zooming, setZooming };
};
