import { useEffect } from 'react';

import { useToasts } from '@app/hooks/useToasts';

export const useCommonToasts = props => {
    const { errorToastProps, loginToastProps, successToastProps } = props;

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (loginToastProps) {
            addToast({ ...loginToastProps });
        }
    }, [addToast, loginToastProps]);

    useEffect(() => {
        if (successToastProps) {
            addToast({ ...successToastProps });
        }
    }, [addToast, successToastProps]);

    useEffect(() => {
        if (errorToastProps) {
            addToast({ ...errorToastProps });
        }
    }, [addToast, errorToastProps]);
};
