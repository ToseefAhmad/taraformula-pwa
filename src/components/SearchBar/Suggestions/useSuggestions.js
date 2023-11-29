/**
 * Returns props necessary to render a Suggestions component.
 *
 * @param {Boolean} showSuggestions
 * @param {Object} filters - filters applied to the search
 * @param {Function} toggleSearch
 */
export const useSuggestions = ({ showSuggestions, filters }) => {
    let categories = null;

    // Find categories, but only if the component is going to render
    if (showSuggestions) {
        const categoryFilter = filters.find(({ label }) => label === 'Category') || {};
        categories = categoryFilter.options || [];
    }

    return {
        categories
    };
};
