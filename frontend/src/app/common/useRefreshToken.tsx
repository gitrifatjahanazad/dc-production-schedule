import userStorage from "../common/userStorage";
import axios from "axios";
const { REACT_APP_API_BASE_URL } = process.env;

const useRefreshToken = () => {
  const refresh = async () => {
    const authInfo: any = userStorage.getAuthInfo();
    let formData = new FormData();
    formData.append("refresh_token", authInfo?.refreshToken);
    const response = await axios({
      method: "post",
      url: `${REACT_APP_API_BASE_URL}/refresh_token`,
      data: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    userStorage.updateAuthToken({
      accessToken: response?.data?.access_token,
      refreshToken: response?.data?.refresh_token,
      name: authInfo?.name,
    });
    return response.data;
  };
  return refresh;
};

export default useRefreshToken;
