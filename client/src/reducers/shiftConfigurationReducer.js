export const SET_SHIFTS = 'SET_SHIFTS';

export const shiftConfigurationReducer = (state, action) => {
    switch (action.type) {
        case SET_SHIFTS:
            return action.payload
        default:
            return state
    }
}