

const messengerState = {
    friends : []
}

export const messengerReducer = (state = messengerState, action) => {
    const {type, payload} = action;

    return state;
}