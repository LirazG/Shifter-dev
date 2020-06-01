export const FETCH_USER_DATA = 'FETCH_USER_DATA';

export const userDataReducer = (state, action) => {
    switch (action.type) {
        case FETCH_USER_DATA:
            return action.payload
        default:
            return state
    }
}