import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Gameplay from "./Gameplay";

const Matchmaking = () => {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL);

    const handleMatchFound = (roomData) => {
      setIsLoading(false);
      setRoom(Object.keys(roomData)[0]);
    };

    newSocket.on("connect", async () => {
      setIsLoading(true);
      setSocket(newSocket);
      newSocket.emit("join queue");
    });

    newSocket.on("match found", handleMatchFound);

    newSocket.on("error", (err) => {
      console.log(err);
    });

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  return (
    <div
      className="game"
      id="game"
      style={{
        background:
          "linear-gradient(to right, rgb(173, 83, 137), rgb(60, 16, 83))",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {isLoading ? (
        <div className="d-flex align-item-center justify-content-center pt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Gameplay socket={socket} room={room} />
      )}
    </div>
  );
};

export default Matchmaking;
