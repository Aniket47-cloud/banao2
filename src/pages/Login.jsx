import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((result) => {
        console.log(result);
        console.log(result);
        if (result.data === "Success") {
          navigate("/dashboard");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-100 h-100  d-flex flex-column mt-5 align-items-center justify-content-center">
      <h2>Login </h2>
      <div className="d-flex border rounded-lg mt-5 shadow-lg w-75 h-100 justify-content-between gap-32">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <br></br>
        <Link to="/forgot-password">Forgot password</Link>
      </form>
      <img style={{width:"400px"}}src="/images/form.svg"/>
      </div>
    </div>
  );
};

export default Login;
