import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function App() {
  const ACCESS_URL = "http://127.0.0.1:5000/api/";
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();
  console.log(user)

  const onClickAccessPublic = async () => {
    const response = await axios
      .get(`${ACCESS_URL}public`)
      .then((res) => console.log(res.data));
  };

  const onClickAccessPrivate = async () => {
    const token = await getAccessTokenSilently({
      audience: `${process.env.REACT_APP_AUTH0_AUDIENCE_URL}`,
    });
    const response = await axios
      .get(`${ACCESS_URL}private`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => console.log(res.data));
  };

  const onClickAccessScoped = async () => {
    const token = await getAccessTokenWithPopup({
      audience: `${process.env.REACT_APP_AUTH0_AUDIENCE_URL}`,
      scope: "read:messages",
    });
    const response = await axios
      .get(`${ACCESS_URL}private-scoped`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => console.log(res.data));
  };

  return (
    <div className="App">
      <header className="App-header">
        {!isAuthenticated ? (
          <div>
            <p>いらっしゃい！</p>
            <button onClick={loginWithRedirect}>Log in</button>
          </div>
        ) : (
          <div>
            <p>ようこそ！</p>
            <button
              onClick={() => {
                logout({ returnTo: window.location.origin });
              }}
            >
              logout
            </button>

            <button onClick={onClickAccessPublic}>access public</button>
            <br />
            <button onClick={onClickAccessPrivate}>access private</button>
            <br />
            <button onClick={onClickAccessScoped}>access scoped</button>
          </div>
        )}
        <p>{user?.name}</p>
      </header>
    </div>
  );
}

export default App;
