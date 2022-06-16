/** @format */
import React from "react";
import "./login.css";
import { Close, Room } from "@material-ui/icons";
import axios from "axios";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = React.useState(false);
  const nameRef = React.useRef();
  const passwordRef = React.useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        process.env.REACT_APP_LOGIN,
        user
      );
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="login_container">
      <form onSubmit={handleLogin}>
        <div className="logo">
          <Room />
          <h2>klvp Pin</h2>
        </div>
        <input type="text" placeholder="enter username" ref={nameRef} />
        <input type="password" placeholder="enter password" ref={passwordRef} />
        <button type="submit">Login</button>

        {error && <span className="error">Something went wrong</span>}
      </form>
      <Close className="register_close" onClick={() => setShowLogin(false)} />
    </div>
  );
}
