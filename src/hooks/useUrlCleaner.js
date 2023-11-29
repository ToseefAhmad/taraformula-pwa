export const useUrlCleaner = () => {
    if (window.location.href.slice(-1) === '/') {
        window.history.pushState({}, '', window.location.href.slice(0, -1));
    }
};

export default useUrlCleaner;
