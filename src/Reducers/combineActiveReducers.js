export const combineActiveReducers = (reducers, initialState) => {
    return (state = initialState, action) => {
        let currentState = state;
        reducers.forEach(reducer => {
            const newState = reducer(currentState, action);
            if (newState) {
                currentState = newState;
            }
        });
        return currentState;
    };
};