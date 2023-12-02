import { NavLink, Outlet, useNavigate } from "react-router-dom";
import userStorage from "./userStorage";
import { useEffect, useState } from "react";

const Layout = () => {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const info = userStorage.getAuthInfo();
    setAuthInfo(info);
  }, []);
  const logout = () => {
    userStorage.revoveAllInfo();
    navigate("/");
  };
  return (
    <main className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            <a href="/home" className="logo" >
              <img src="./crusader-logo.svg" alt="Logo" />
            </a>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {authInfo?.accessToken && (
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link active">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/ScheduleGrid" className="nav-link">
                    Schedule Grid
                  </NavLink>
                </li>
              </ul>
              <div className="d-flex">
                <div className="d-flex align-items-center">
                  <h6 style={{ margin: 0 }}>{authInfo?.name}</h6>
                </div>
                <button className="btn btn-sm" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="container-fluid main-container">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
