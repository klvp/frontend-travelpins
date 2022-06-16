/** @format */
import React from "react";
import "./register.css";
import { Close, Room } from "@material-ui/icons";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await fetch(process.env.REACT_APP_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      setError(false);
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="register_container">
      <form onSubmit={handleSubmit}>
        <div className="logo">
          <Room />
          <h2>klvp Pin</h2>
        </div>
        <input type="text" placeholder="enter username" ref={nameRef} />
        <input type="email" placeholder="enter email" ref={emailRef} />
        <input type="password" placeholder="enter password" ref={passwordRef} />
        <button type="submit">Register</button>
        {success && (
          <span className="success">Successful You can login now !</span>
        )}
        {error && <span className="error">Something went wrong</span>}
      </form>
      <Close
        className="register_close"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
