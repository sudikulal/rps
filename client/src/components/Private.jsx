import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Gameplay from "./Gameplay";

const joinType = {
  CREATE: 1,
  JOIN: 2,
};

function Private() {
  const [room, setRoom] = useState(null);
  const [matchFound, setMatchFound] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL);

    newSocket.on("connect", async () => {
      setSocket(newSocket);
    });

    newSocket.on("error", (err) => {
      console.log(err);
    });

    newSocket.on("room created", (roomData) => {
      setRoom(roomData?.roomName);
      const privateRoom = document.querySelector(".privateType");
      privateRoom.innerHTML = "";
      const card = document.createElement("div");
      card.className = "card bg-dark text-white m-4 p-4";
      card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Room</h5>
        <label for="roomCode" class="form-label">Room code</label>
        <input class="form-control mb-3" type="text" id="roomCode" placeholder="Room code" aria-label="Room name" value=${roomData?.roomName} readOnly>
      </div>`;
      privateRoom.appendChild(card);
    });

    newSocket.on("match found", (roomData) => {
      console.log("match found",roomData);
      setRoom(Object.keys(roomData)[0]);
      setMatchFound(true);
    });

    newSocket.on("invalid room", () => {
      alert("invalid room name");
    });

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  function joinRoom() {
    console.log("Join Room button clicked");
    const roomName = document.getElementById("roomCode")?.value;

    // Check if the form is valid
    const joinRoomForm = document.getElementById("joinRoomForm");
    if (joinRoomForm.checkValidity()) {
      socket.emit("join room", roomName);
    } else {
      alert("Please enter a valid room code.");
    }
  }

  const handleJoinType = (type) => {
    const privateRoom = document.querySelector(".privateType");
    privateRoom.innerHTML = "";
    const card = document.createElement("div");
    card.className = "card bg-dark text-white m-4 p-4";

    if (type === joinType.CREATE) {
      if (socket) {
        socket.emit("create room");
      }
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Room</h5>
          <label for="roomCode" class="form-label">Room code</label>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>`;
      privateRoom.appendChild(card);
    } else {
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Join Room</h5>
          <form id="joinRoomForm">
            <label for="roomCode" class="form-label">Room code</label>
            <input class="form-control mb-3" type="text" id="roomCode" placeholder="Room code" aria-label="Room name" required>
            <button type="button" id="joinButton" className="btn btn-primary">
              Join
            </button>
          </form>
        </div>`;
      privateRoom.appendChild(card);
      card.querySelector("#joinButton").addEventListener("click", joinRoom);
    }
  };

  return (
    <>
      {matchFound ? (
        <Gameplay socket={socket} room={room} />
      ) : (
        <div
          className="d-flex justify-content-center align-items-center vh-100"
          style={{
            backgroundImage:
              "linear-gradient(230deg, rgba(13, 13, 13, 0.02) 0%, rgba(13, 13, 13, 0.02) 50%,rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.02) 100%),linear-gradient(44deg, rgba(191, 191, 191, 0.03) 0%, rgba(191, 191, 191, 0.03) 50%,rgba(20, 20, 20, 0.03) 50%, rgba(20, 20, 20, 0.03) 100%),linear-gradient(197deg, rgba(229, 229, 229, 0.03) 0%, rgba(229, 229, 229, 0.03) 50%,rgba(39, 39, 39, 0.03) 50%, rgba(39, 39, 39, 0.03) 100%),linear-gradient(352deg, rgba(160, 160, 160, 0.01) 0%, rgba(160, 160, 160, 0.01) 50%,rgba(98, 98, 98, 0.01) 50%, rgba(98, 98, 98, 0.01) 100%),linear-gradient(75deg, rgba(36, 36, 36, 0.03) 0%, rgba(36, 36, 36, 0.03) 50%,rgba(238, 238, 238, 0.03) 50%, rgba(238, 238, 238, 0.03) 100%),linear-gradient(188deg, rgba(59, 59, 59, 0.03) 0%, rgba(59, 59, 59, 0.03) 50%,rgba(163, 163, 163, 0.03) 50%, rgba(163, 163, 163, 0.03) 100%),linear-gradient(208deg, rgba(33, 33, 33, 0.03) 0%, rgba(33, 33, 33, 0.03) 50%,rgba(160, 160, 160, 0.03) 50%, rgba(160, 160, 160, 0.03) 100%),linear-gradient(331deg, rgba(92, 92, 92, 0.02) 0%, rgba(92, 92, 92, 0.02) 50%,rgba(6, 6, 6, 0.02) 50%, rgba(6, 6, 6, 0.02) 100%),linear-gradient(290deg, rgba(16, 16, 16, 0.02) 0%, rgba(16, 16, 16, 0.02) 50%,rgba(163, 163, 163, 0.02) 50%, rgba(163, 163, 163, 0.02) 100%),linear-gradient(90deg, rgb(76, 21, 98),rgb(166, 10, 148))",
          }}
        >
          <div className="privateType text-center">
            <button
              className="btn btn-outline-primary p-4 m-4"
              onClick={() => handleJoinType(joinType.CREATE)}
            >
              Create Room
            </button>
            <button
              className="btn btn-outline-success p-4 m-4"
              onClick={() => handleJoinType(joinType.JOIN)}
            >
              Join Room
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Private;
