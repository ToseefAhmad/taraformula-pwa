export const createActions = (actions, dispatch) => {
    const dispatchers = Object.keys(actions).map(key => {
        return {
            [key]: payload => {
                dispatch({ type: actions[key], payload: payload });
            }
        };
    });

    return Object.assign({}, ...dispatchers);
};
