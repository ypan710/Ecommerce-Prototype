const INITIAL_STATE = () => ({
    update: "",
    message: "",
    inquiries: []
});

const inquiryReducer = (state = INITIAL_STATE(), action) => {
    switch(action.type) {
        case 'SET_UPDAtE':
            return {
                ...state,
                update: action.update
            };
        case 'SET_MESSAGE':
            return {
                ...state,
                message: action.message
            };
        case 'LOAD_INQUIRIES':
            return {
                ...state,
                inquiries: action.inquiries,
            };
        default:
            return state;
    }
};

export default inquiryReducer;