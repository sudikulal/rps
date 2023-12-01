const waitingUsers = [];
const roomData = {};

const parosi = {
  rock: 1,
  paper: 2,
  scissor: 3,
};

module.exports = (io) => {
  const joinRoom = (socket) => {
    waitingUsers.push(socket);

    while (waitingUsers.length >= 2) {
      const user1 = waitingUsers.shift();
      const user2 = waitingUsers.shift();
      const roomName = `room-${Date.now()}`;
      user1.join(roomName);
      user2.join(roomName);
      roomData[roomName] = {
        [user1.id]: {},
        [user2.id]: {},
      };
      user1.emit("matchFound", roomName);
      user2.emit("matchFound", roomName);
    }
  };

  const makeDecision = (roomName, socket, decision) => {
    if (Object.values(parosi).includes(decision))
      return socket.emit("invalid decision");

    const roomDetail = roomData[roomName];

    if (!roomDetail) return socket.emit("invalid room");

    const user = roomDetail[socket.id];

    if (!user) return socket.emit("invalid user");

    user.decision = decision;

    const opponentSocket = Object.keys(roomDetail).filter(
      (user) => user.id != socket.id
    )[0];

    const opponent = roomDetail[opponentSocket.id];

    if (opponent.decision) {
      let winner = decideWinner(user.decision, opponent.decision);
      user.decision, (opponent.decision = 0);
      if (winner) {
        if (winner == 1) {
          socket.emit("youWon");
          opponentSocket.emit("youLost");
        } else {
          socket.emit("youLost");
          opponentSocket.emit("youWon");
        }
      } else {
        //   io.to(roomName).emit("GameDraw");
        socket.emit("GameDraw");
        opponentSocket.emit("GameDraw");
      }
    }
  };

  const leaveRoom = (socket) => {
    const index = waitingUsers.indexOf(socket);
    if (index !== -1) {
      waitingUsers.splice(index, 1);
    }
  };

  return {joinRoom,makeDecision,leaveRoom}
};

function decideWinner(userDecision, opponentDesion) {
  if (userDecision == opponentDesion) return 0;

  switch (userDecision) {
    case parosi.rock: {
      if (opponentDesion == parosi.paper) return 2;
      else return 1;
    }
    case parosi.paper: {
      if (opponentDesion == parosi.scissor) return 2;
      else return 1;
    }
    case parosi.scissor: {
      if (opponentDesion == parosi.rock) return 2;
      else return 1;
    }
    default:
      return 0;
  }
}
