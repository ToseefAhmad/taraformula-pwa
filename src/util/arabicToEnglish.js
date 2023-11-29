export const arabicToEnglish = text => {
    const map = [
        { ar: '٠', en: '0' },
        { ar: '١', en: '1' },
        { ar: '٢', en: '2' },
        { ar: '٣', en: '3' },
        { ar: '٤', en: '4' },
        { ar: '٥', en: '5' },
        { ar: '٦', en: '6' },
        { ar: '٧', en: '7' },
        { ar: '٨', en: '8' },
        { ar: '٩', en: '9' }
    ];

    for (let i = 0; i < map.length; i++) {
        const regex = new RegExp(map[i].ar, 'g');
        text = text.replace(regex, map[i].en);
    }
    return text;
};
