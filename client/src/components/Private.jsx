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
              "linear-gradient(230deg, rgba(13, 13, 13, 0.02) 0%)",
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
