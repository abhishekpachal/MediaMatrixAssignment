import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, isLoggedIn } from "../service/AuthUtil";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/Auth";

const NavBar = () => {
  const { user, loggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAuth();
    dispatch(logout());
    navigate("/", { replace: true });
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <h3>Blog</h3>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse d-flex justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {loggedIn && (
              <>
                <li className="nav-item">
                  <span className="me-3 mt-3">
                    <button className="btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
