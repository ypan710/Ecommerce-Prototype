export const setUserId = userId => {
  return {
    type: 'SET_USERID',
    userId,
  };
};

export const setUsername = username => {
  return {
    type: 'SET_USERNAME',
    username,
  };
};

export const setAdminStatus = admin => {
  return {
    type: 'SET_ADMIN_STATUS',
    admin,
  };
};

export const setLoggedinStatus = loggedIn => {
  return {
    type: 'SET_LOGIN_STATUS',
    loggedIn,
  };
};

export const setUserInformation = userInfo => {
  return {
    type: 'SET_USER_INFORMATION',
    userInfo,
  };
};