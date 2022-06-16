/** @format */

import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./app.css";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

export default function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = React.useState(
    myStorage.getItem("user")
  );
  const [viewState, setViewState] = React.useState({
    longitude: 77.59,
    latitude: 12.97,
    zoom: 3.5,
  });
  const [pins, setPins] = React.useState(null);
  const [currentPlace, setCurrentPlace] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [des, setDes] = React.useState(null);
  const [rating, setRating] = React.useState(0);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const getData = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_PINS);
      const data = await res.json();
      setPins(data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      des,
      rating,
      lat: newPlace.latitude,
      lon: newPlace.longitude,
    };
    try {
      const data = await fetch(process.env.REACT_APP_CREATE_PINS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPin),
      });
      console.log(data);
      getData();
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };
  return (
    <div>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={(e) => {
          setNewPlace({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
        }}
        transitionDuration="500"
      >
        {pins?.map((pin) => {
          return (
            <React.Fragment key={pin._id}>
              <Marker longitude={pin.lon} latitude={pin.lat} anchor="bottom">
                <Room
                  style={{
                    fontSize: viewState.zoom * 7,
                    color:
                      pin.username === currentUser ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setCurrentPlace(pin._id);
                    setViewState({
                      latitude: pin.lat,
                      longitude: pin.lon,
                      // zoom: 5,
                    });
                  }}
                />
              </Marker>
              ;
              {currentPlace === pin._id && (
                <Popup
                  longitude={pin.lon}
                  latitude={pin.lat}
                  anchor="left"
                  onClose={() => {
                    setCurrentPlace(null);
                  }}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4>{pin.title}</h4>
                    <label>Review</label>
                    <p style={{ maxWidth: "25ch" }}>{pin.des}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(pin.rating).fill(<Star />)}
                    </div>
                    <label>Information </label>
                    <span className="username">
                      Created by <b>{pin.username}</b>{" "}
                    </span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                </Popup>
              )}
              {newPlace && (
                <Popup
                  longitude={newPlace.longitude}
                  latitude={newPlace.latitude}
                  anchor="left"
                  onClose={() => {
                    setNewPlace(null);
                  }}
                  maxWidth="500px"
                >
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="">Title</label>
                      <input
                        placeholder="enter a title"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <label htmlFor="">Review</label>
                      <textarea
                        placeholder="say something about this place"
                        onChange={(e) => setDes(e.target.value)}
                      />
                      <label htmlFor="">Rating</label>
                      <select onChange={(e) => setRating(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button className="button submitButton" type="submit">
                        Add Pin
                      </button>
                    </form>
                  </div>
                </Popup>
              )}
            </React.Fragment>
          );
        })}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  );
}
