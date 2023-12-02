import { useEffect } from "react";
import userStorage from "../common/userStorage";
import orderAxiosPrivate from "./orderAxiosPrivate";
import useRefreshToken from "./useRefreshToken";
import axios from "axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  useEffect(() => {
    const requestIntercept = orderAxiosPrivate.interceptors.request.use(
      (config: any) => {
        const userInfo = userStorage.getAuthInfo();
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${userInfo?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = orderAxiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 401 ||
            error?.response?.status === 403) &&
          !prevRequest?.sent
        ) {
          const data = await refresh();
          return axios({
            ...prevRequest,
            headers: { Authorization: `Bearer ${data.access_token}` },
            sent: true,
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      orderAxiosPrivate.interceptors.request.eject(requestIntercept);
      orderAxiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return orderAxiosPrivate;
};

export default useAxiosPrivate;
