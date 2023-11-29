import { useEffect, useState } from 'react';

const useIubenda = ({ iubendaConfig }) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await fetch(iubendaConfig.url)
                .then(response => response.json())
                .then(response => {
                    if (response.success) {
                        setData(response.content);
                    } else {
                        setHasError(true);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setHasError(true);
                });
            setLoading(false);
        };
        loadData();
    }, [iubendaConfig]);

    return {
        content: data,
        loading,
        hasError
    };
};

export default useIubenda;
