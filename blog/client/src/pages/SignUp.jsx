import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail } from "../service/Util";
import { toast } from "react-toastify";
import { postSignIn, postSignUp } from "../slices/Auth";

const SignUp = () => {
  const { signUpResp } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prevState = useRef({
    signUpResp,
  });

  useEffect(() => {
    if (prevState.current.signUpResp !== signUpResp) {
      if (signUpResp) {
        var message = signUpResp.msg;
        if (signUpResp.status) {
          if (signUpResp.response.success) {
            toast.success(message);
            navigate("/login");
          }
        } else {
          toast.error(message);
        }
      }
    }

    // Update previous state after checks
    prevState.current = {
      signUpResp,
    };
  }, [signUpResp]);

  const handleSignUp = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    } else if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    } else {
      dispatch(postSignUp({ data: formData, params: {} }));
    }
  };

  return (
    <>
      <div className="container">
        <div className="col-md-4 offset-md-4 mt-5 card card-body">
          <h3 className="text-center">Sign Up</h3>
          <form className="form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="d-grid mb-3">
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
            <div className="text-center mb-3">
              Already a User? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
