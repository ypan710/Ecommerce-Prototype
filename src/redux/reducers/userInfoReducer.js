const INITIAL_STATE = {
  userId: '',
  username: '',
  loggedIn: false,
  admin: false
};

const userInfoReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USERID':
      return {
        ...state,
        userId: action.userId
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.username
      };
    case 'SET_ADMIN_STATUS':
      return {
        ...state,
        admin: action.admin
      };
    case 'SET_LOGIN_STATUS':
      return {
        ...state,
        loggedIn: action.loggedIn
      };
    case 'SET_USER_INFORMATION':
      return {
        ...state,
        userId: action.userInfo.userId,
        username: action.userInfo.username,
        loggedIn: action.userInfo.loggedIn,
        admin: action.userInfo.admin
      };
    default:
      return state;
  }
};

export default userInfoReducer;