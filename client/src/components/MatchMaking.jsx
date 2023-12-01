import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Navigate } from "react-router-dom";

const Matchmaking = () => {
  const [socket, setSocket] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io("https://cfc2-2409-40f3-1018-f8ee-65dd-4c46-4f4e-b697.ngrok-free.app");

    newSocket.on("connect", () => {
      setSocket(newSocket);
      newSocket.emit("joinQueue");
      setIsLoading(false);
    });

    newSocket.on("error", (err) => {
      setError(err);
    });

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("matchFound", (roomName) => {
        setIsMatched(true);
      });
    }
  }, [socket]);

  return (
    <div>
      {isLoading && !error && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {isMatched && <Navigate to="/game" />}
      {!isLoading && !isMatched && !error && <div>No match found</div>}
    </div>
  );
};

export default Matchmaking;


