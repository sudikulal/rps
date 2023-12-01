import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const style = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(https://cdn1.vectorstock.com/i/1000x1000/11/45/rock-paper-scissors-pattern-background-vector-4521145.jpg)`,
    backgroundSize: "100% 140%",
    backgroundPosition: "center",
    height: "95vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundOpacity: 0.5,
  };

  const navigate = useNavigate();

  const handleOnClick = (gameType) => {
    switch (gameType) {
      case 1:
        navigate("/private");
        break;
      case 2:
        navigate("/cpu");
        break;
      case 3:
        navigate("/matchmaking");
        break;
    }
  };

  return (
    <div style={style}>
      <h1>Welcome to the Home Screen</h1>

      <div className="row g-2">
        <div className="col col-auto">
          <button className="btn btn-primary" onClick={() => handleOnClick(1)}>
            play with friend
          </button>
        </div>
        <div className="col col-auto">
          <button
            className="btn btn-secondary"
            onClick={() => handleOnClick(2)}
          >
            play with computer
          </button>
        </div>
        <div className="col col-auto">
          <button className="btn btn-success" onClick={() => handleOnClick(3)}>
            play online
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
