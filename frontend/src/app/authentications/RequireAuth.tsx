import { useLocation, Navigate, Outlet } from "react-router-dom";
import userStorage from "../common/userStorage";

const RequireAuth = ({ allowedRoles }: any) => {
  const authInfo = userStorage.getAuthInfo();
  const location = useLocation();

  return authInfo?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
