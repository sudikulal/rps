import React, { useState, useEffect, useCallback } from "react";
import { image } from "../assets/Images";
import { useNavigate } from "react-router-dom";

const choices = ["rock", "paper", "scissor"];
const choiceObj = {
  rock: 1,
  paper: 2,
  scissor: 3,
  1: "rock",
  2: "paper",
  3: "scissor",
};

const Gameplay = ({socket,room}) => {
  console.log(socket);
  const [userDecision, setUserDecision] = useState("pending");
  const [opponentDecision, setOpponentDecision] = useState("pending");
  const [userPoint, setUserPoint] = useState(0);
  const [opponentPoint, setOpponentPoint] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleModalClose = useCallback(
    (type) => {
      if (socket) {
        if (type === 1) {
          socket.emit("leave game", () => {});
          navigate("/");
        }
        if (type === 2) {
          setUserDecision("pending");
          setOpponentDecision("pending");
          setGameResult(null);
          setUserPoint(0);
          setOpponentPoint(0);
          setIsGameEnded(false);
          setShowModal(false);
        }
      }
    },
    [socket, navigate]
  );

  const handleClick = useCallback(
    (decision) => {
      setUserDecision(decision);
      socket.emit("make decision", {
        roomName: room,
        decision: choiceObj[decision],
      });
    },
    [socket, room]
  );

  useEffect(() => {
    const handleGameResult = (result) => {
      console.log(result);
      setOpponentDecision(choiceObj[result.opponent_decision]);
      setGameResult(result.status);
      switch (result.status) {
        case "you won":
          setUserPoint((prev) => prev + 1);
          break;
        case "you lost":
          setOpponentPoint((prev) => prev + 1);
          break;
        default:
          break;
      }
    };

    const handleLeave = () => {
      const userResponse = window.confirm(
        "opponent left,do you want to find other?"
      );
      if (userResponse) window.location.reload(false);
      else navigate("/");
    };

    socket.on("game result", handleGameResult);
    socket.on("opponent left", handleLeave);

    socket.on("error", (err) => {
      console.log(err);
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isGameEnded) {
      setShowModal(true);
    }

    if (userPoint >= 3 || opponentPoint >= 3) {
      setIsGameEnded(true);
    } else {
      if (gameResult)
        setTimeout(() => {
          setUserDecision("pending");
          setOpponentDecision("pending");
          setGameResult(null);
        }, 2000);
    }
  }, [isGameEnded, userPoint, opponentPoint, gameResult]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage = "Are you sure you want to leave?";
      event.returnValue = confirmationMessage;
      if (confirmationMessage) {
        socket.emit("leave game", () => {});
        navigate("/");
      }
      return confirmationMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, navigate]);

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
      {gameResult && <h2 className="text-center p-2">{gameResult}</h2>}
      <div className="row justify-content-around">
        <div className="col-4">
          <CardData decision={userDecision} point={userPoint} />
        </div>
        <div className="col-4">
          <CardData decision={opponentDecision} point={opponentPoint} />
        </div>
      </div>
      {!gameResult && (
        <div className="selector d-flex justify-content-center mt-5">
          {choices.map((choice) => (
            <img
              key={choice}
              className="rounded mx-2"
              src={image[choice]}
              onClick={() => handleClick(choice)}
              alt={choice}
              style={{ maxWidth: "200px", height: "200px" }}
            />
          ))}
        </div>
      )}
      {showModal && (
        <div className="card text-center position-absolute top-50 start-50 translate-middle">
          <div className="card-header">Game Ended</div>
          <div className="card-body">
            {userPoint > opponentPoint ? (
              <p className="card-text">
                You won the match by {userPoint - opponentPoint} points
              </p>
            ) : (
              <p className="card-text">
                You lost the match by {opponentPoint - userPoint} points
              </p>
            )}
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => handleModalClose(1)}
            >
              Home
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleModalClose(2)}
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CardData = ({ point, decision }) => (
  <div className="container-flex justify-content-center justify-item-center mt-4">
    <h2>POINT : {point}</h2>
    <div className="decision">
      <img
        src={image[decision]}
        alt={image["pending"]}
        style={{ width: "500px", height: "500px" }}
        className="image"
      />
    </div>
  </div>
);

export default Gameplay;
