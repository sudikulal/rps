const waitingUsers = [];
const roomData = new Map();
const users = new Map();

const parosi = {
  rock: 1,
  paper: 2,
  scissor: 3,
};

function decideWinner(userDecision, opponentDecision) {
  if (userDecision === opponentDecision) return 0;

  switch (userDecision) {
    case parosi.rock:
      return opponentDecision === parosi.paper ? 2 : 1;
    case parosi.paper:
      return opponentDecision === parosi.scissor ? 2 : 1;
    case parosi.scissor:
      return opponentDecision === parosi.rock ? 2 : 1;
    default:
      return 0;
  }
}

function generateRoom() {
  let roomName;
  do {
    roomName = Math.random().toString(36).slice(2, 7);
  } while (roomData.has(roomName));
  return roomName;
}

module.exports = (io) => {
  return io.on("connection", (socket) => {
    try {
      console.log("A user connected");

      users.set(socket.id, {});

      socket.on("join queue", () => {
        try {
          console.log("comming here");
          waitingUsers.push(socket.id);

          while (waitingUsers.length >= 2) {
            const user1 = waitingUsers.shift();
            const user2 = waitingUsers.shift();
            const roomName = generateRoom();
            io.sockets.sockets.get(user1).join(roomName);
            io.sockets.sockets.get(user2).join(roomName);
            roomData.set(roomName, {
              [user1]: {},
              [user2]: {},
            });
            users.set([user1.id, { roomName }], [user2.id, { roomName }]);
            socket
              .in(roomName)
              .emit("match found", { roomName: roomData.get(roomName) });
            socket.emit("match found", { roomName: roomData.get(roomName) });
          }
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("make decision", ({ roomName, decision }) => {
        try {
          if (!Object.values(parosi).includes(decision)) {
            return socket.emit("invalid decision");
          }

          const roomDetail = roomData.get(roomName);

          if (!roomDetail) {
            return socket.emit("invalid room");
          }

          const user = roomDetail[socket.id];

          if (!user) return socket.emit("invalid user");

          user.decision = decision;

          const opponentSocketId = Object.keys(roomDetail).find(
            (userId) => userId !== socket.id
          );

          if (opponentSocketId) {
            const opponent = roomDetail[opponentSocketId];

            if (opponent.decision) {
              const winner = decideWinner(user.decision, opponent.decision);
              user.decision = opponent.decision = 0;

              if (winner) {
                socket.emit("game result", {
                  status: winner === 1 ? "you won" : "you lost",
                  opponent_descision: opponent.decision,
                });
                socket.to(opponentSocketId).emit("game result", {
                  status: winner === 2 ? "you won" : "you lost",
                  opponent_descision: user.decision,
                });
              } else {
                socket.in(roomName).emit("game result", {
                  status: "draw",
                  opponent_descision: user.decision,
                });
                socket.emit("game draw", {
                  status: "draw",
                  opponent_descision: user.decision,
                });
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("create room", () => {
        try {
          const roomName = generateRoom();
          socket.join(roomName);
          users.set(socket.id, { roomName });
          roomData.set(
            roomData.set(roomName, {
              [socket.id]: {},
            })
          );
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("join room", (roomName) => {
        try {
          const roomDetail = roomData.get(roomName);

          if (!roomDetail) return socket.emit("invalid room");

          socket.join(roomName);

          roomDetail[socket.id] = {};

          roomData.set(roomName, roomDetail);

          socket.in(roomName).emit("match found", { roomName: roomDetail });
          socket.emit("match found", { roomName: roomDetail });
        } catch (error) {
          console.error(error);
        }
      });

      function leaveGame() {
        try {
          const user = users.get(socket.id);

          if (user) {
            if (user.roomName) {
              socket.broadcast
                .to(user.roomName)
                .emit("opponent disconnected", {});
              roomData.delete(user.roomName);
            } else {
              const index = waitingUsers.indexOf(socket.id);
              if (index !== -1) {
                waitingUsers.splice(index, 1);
              }
            }
            users.delete(socket.id);
          }
        } catch (error) {
          console.log(error);
        }
      }

      socket.on("leave game", () => {
        leaveGame();
      });

      socket.on("disconnect", () => {
        leaveGame();
      });
    } catch (error) {
      console.log(error);
      return;
    }
  });
};
