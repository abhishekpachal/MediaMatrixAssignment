import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, postSignIn } from "../slices/Auth";
import { setAuthState, setRefreshToken } from "../service/AuthUtil";

const Login = () => {
  const { signInResp } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prevState = useRef({
    signInResp,
  });

  useEffect(() => {
    if (prevState.current.signInResp !== signInResp) {
      if (signInResp) {
        var message = signInResp.msg;

        if (signInResp.status && signInResp.response.user) {
          const token = signInResp.response.access_token;
          const refresh_token = signInResp.response.refresh_token;
          const user = signInResp.response.user;
          dispatch(login(signInResp.response));
          setAuthState({ token, user });
          setRefreshToken(refresh_token);
          toast.success(message);
          navigate("/home", { replace: true });
        } else {
          toast.error(message);
        }
      }
    }

    // Update previous state after checks
    prevState.current = {
      signInResp,
    };
  }, [signInResp]);
  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    } else {
      dispatch(postSignIn({ data: formData, params: {} }));
    }
  };
  return (
    <>
      <div className="container">
        <div className="col-md-4 offset-md-4 mt-5 card card-body">
          <h3 className="text-center">Login</h3>
          <form className="form">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                className="form-control"
                id="password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
              />
            </div>
            <div className="d-grid mb-3">
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div className="text-center mb-3">
              Not a User? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
