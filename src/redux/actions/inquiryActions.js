import axios from 'axios';

export const setUpdate = update => {
    return {
        type: 'SET_UPDAtE',
        update,
    };
};

export const setMessage = message => {
    return {
        type: 'SET_MESSAGE',
        message,
    };
};

export const getInquiries = (listingId) => (dispatch) => {
    axios.get('/inquiry/getAll/' + listingId)
        .then((res) => {
            dispatch({
                type: 'LOAD_INQUIRIES',
                inquiries: res.data,
            });
        })
        .catch(console.log);
};

export const inquireOnListing = (listingId) => (dispatch, getState) => {
    const body = {
      message: getState().inquiryReducer.message,
    }
    axios.post('/inquiry/send/' + listingId, body)
      .then(() => {
      })
      .catch((e) => {console.log(e)});
    
    dispatch(setMessage(""));
  };
