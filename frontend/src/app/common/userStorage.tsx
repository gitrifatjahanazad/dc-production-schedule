import orderStorage from "./orderStorage";
const AUTH_KEY = "order-auth-info";
const USER_KEY = "order-user-info";
const userStorage = {
  getAuthInfo() {
    return orderStorage.getJson(AUTH_KEY) || {};
  },
  saveAuthInfo(authInfo: any) {
    orderStorage.setJson(AUTH_KEY, {
      ...authInfo,
    });
  },
  updateAuthToken(authInfo: any) {
    orderStorage.setJson(AUTH_KEY, {
      ...authInfo,
    });
  },
  getUserInfo() {
    return orderStorage.getJson(USER_KEY) || {};
  },
  saveUserInfo(userInfo: any) {
    orderStorage.setJson(USER_KEY, { ...userInfo });
  },
  revoveAllInfo() {
    orderStorage.clear(AUTH_KEY);
    orderStorage.clear(USER_KEY);
  },
};

export default userStorage;
