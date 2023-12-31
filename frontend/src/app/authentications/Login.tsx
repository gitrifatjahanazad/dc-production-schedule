import { PublicClientApplication } from "@azure/msal-browser";
import React, { useEffect, useState } from "react";
import userStorage from "../common/userStorage";
import { Navigate } from "react-router-dom";
import jwt from "jwt-decode";
import axios from "axios";
import { CircleLoader } from "react-spinners";
const { REACT_APP_API_BASE_URL, REACT_APP_CLIENT_ID, REACT_APP_TENANT_ID, REACT_APP_APP_BASE_URL } = process.env;

const Login = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const msalConfig = {
    auth: {
      clientId: REACT_APP_CLIENT_ID || "",
      redirectUri: REACT_APP_APP_BASE_URL,
      authority:
        `https://login.microsoftonline.com/${REACT_APP_TENANT_ID}`,
      scopes: ["user.read", "offline_access", "openid", "profile"],
    },
  };
  const pca = new PublicClientApplication(msalConfig);

  useEffect(() => {
    const initializeMsal = async () => {
      await pca.initialize(); // Initialize MSAL instance
    };
    initializeMsal();
    const authInfo = userStorage.getAuthInfo();
    setSuccess(!!authInfo?.accessToken);
  }, []);

  const login = async () => {
    try {
      const res = await pca.loginPopup({
        prompt: "select_account",
        scopes: ["user.read", "offline_access", "openid", "profile"],
      });
      const userInfo: any = jwt(res?.accessToken);
      // console.log(res);
      setIsLoading(true);
      const tokenRes: any = await axios.post(
        `${REACT_APP_API_BASE_URL}/token_microsoft`,
        null,
        { headers: { Authorization: `Bearer ${res.idToken}` } }
      );
      //console.log(tokenRes);
      userStorage.saveAuthInfo({
        accessToken: tokenRes?.data?.access_token,
        refreshToken: tokenRes?.data?.refresh_token,
        name: userInfo?.name,
      });
      setSuccess(true);
      setIsLoading(false);
      //   console.log(res);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <Navigate to="/home" />
      ) : (
        <div
          className="login-layout d-flex flex-column align-items-center justify-content-center position-relative"
        >
          <div
            className={
              isLoading
                ? "disabled d-flex flex-column justify-content-center align-items-center"
                : "d-flex flex-column justify-content-center align-items-center"
            }
          >
              <div className="d-flex flex-column justify-content-center align-items-center gap-3">
                <div className="login__logo">
                  <img src="./crusader-logo.svg" alt="" />
                </div>
                <h2 className="mb-3 text-center">Production Schedule System</h2>
                <button className="d-none d-md-block btn blue-btn font-lg" onClick={login}>
                  Login
                </button>
              </div>
            <CircleLoader
              loading={isLoading}
              color="#36d7b7"
              cssOverride={{
                display: "block",
                margin: "0 auto",
                borderColor: "#36d7b7",
              }}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
          <div className="d-flex d-md-none flex-column justify-content-end position-absolute" style={{width: '90%', bottom: '0'}}>
            <p className="text-center font-md" style={{color: '#A9A9A9'}}>A system To manage caravan production line schedules</p>
            <button className="btn blue-btn font-lg" onClick={login}>
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
