import { NavLink, Outlet, useNavigate } from "react-router-dom";
import userStorage from "./userStorage";
import { useEffect, useState } from "react";
import './Layout.css';

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
      <nav className="navbar nav navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="d-flex flex-row-reverse flex-lg-row align-items-center gap-2">
            <h1 className="m-0 d-flex justify-content-center align-items-center">
              <NavLink to="/home" className="logo navbar-brand p-0 m-0 d-flex justify-content-center align-items-center">
                <img src="./crusader-logo.svg" alt="Logo" />
              </NavLink>
            </h1>
            <div className="nav__search-box position-relative">
                <input className="rounded-0 form-control" placeholder="Free Text Search" type="text"/>
                <span className="nav__search-box__icon d-flex align-items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="MagnifyingGlass">
                            <path id="Vector" d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z" stroke="#1D2026" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path id="Vector_2" d="M16.4431 16.4438L20.9994 21.0002" stroke="#1D2026" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                    </svg>
                </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-4">
          <div className="nav-item dropdown d-block d-lg-none">
            <span className="dropdown-toggle bell-icon position-relative d-flex align-items-center" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="./Bell.svg" alt="" />
            </span>
            <ul className="dropdown-menu notification-menu p-2">
              <li>hello</li>
            </ul>
          </div>
          <button
            className="navbar-toggler border-0 text-black p-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          </div>
          {authInfo?.accessToken && (
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto align-items-start align-items-lg-center mt-2 mt-lg-0">
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/ScheduleGrid" className="nav-link">
                    Schedule Grid
                  </NavLink>
                </li>
                <li className="nav-item dropdown d-none d-lg-block">
                  <span className="dropdown-toggle bell-icon position-relative d-flex align-items-center" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="./Bell.svg" alt="" />
                  </span>
                  <ul className="dropdown-menu notification-menu p-2">
                    <li>hello</li>
                  </ul>
                </li>
                <li className="nav-item">
                  <button className="nav-btn btn blue-btn font-lg d-flex justify-content-center align-items-center gap-2 p-2 border-0" onClick={logout}>
                    <span className="user-info position-relative d-flex justify-content-center align-items-center">
                      <span className="m-0 text-white user-info__tooltip font-md">{authInfo?.name}</span>
                      <img className="button__image" src="./avatar.jpeg" alt="" />
                    </span>
                    <p className="m-0">Logout</p>
                </button>
                </li>
              </ul>
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
