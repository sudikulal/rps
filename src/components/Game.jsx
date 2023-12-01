import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Game = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Replace with your server URL
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleChoice = (choice) => {
    if (socket) {
      socket.emit('playerChoice', choice);
    }
  };

  return (
    <div>
      <h1>Rock, Paper, Scissors Game</h1>
      {/* Add game state display and result handling */}
    </div>
  );
};

export default Game;
