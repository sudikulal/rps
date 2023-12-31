import React, { useState, useEffect } from "react";
import { image } from "../assets/Images";
import { useNavigate } from "react-router-dom";

const choices = ["rock", "paper", "scissor"];

function PlayWithComputer() {
  const [userDecision, setUserDecision] = useState("pending");
  const [computerDecision, setComputerDecision] = useState("pending");
  const [userPoint, setUserPoint] = useState(0);
  const [computerPoint, setComputerPoint] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  const CardData = ({ point, decision }) => (
    <div className="container-flex justify-content-center justify-item-center mt-4">
      <h2>POINT : {point}</h2>
      <div className="decision">
        <img
          src={image[decision]}
          alt={image["pending"]}
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          className="image"
        />
      </div>
    </div>
  );

  const handleGameResult = (userDecision, computerDecision) => {
    if (userDecision === computerDecision) {
      setGameResult("draw");
    } else if (
      (userDecision === "rock" && computerDecision === "scissor") ||
      (userDecision === "paper" && computerDecision === "rock") ||
      (userDecision === "scissor" && computerDecision === "paper")
    ) {
      setGameResult("win");
      setUserPoint(userPoint + 1);
    } else {
      setGameResult("lose");
      setComputerPoint(computerPoint + 1);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isGameEnded) {
      setShowModal(true); // Show modal when the game is ended
    }

    if (userPoint >= 3 || computerPoint >= 3) {
      setIsGameEnded(true);
    } else {
      if (gameResult)
        setTimeout(() => {
          setUserDecision("pending");
          setComputerDecision("pending");
          setGameResult(null);
        }, 2000);
    }
  }, [isGameEnded, userPoint, computerPoint, gameResult]);

  const handleClick = (decision) => {
    setUserDecision(decision);
    const randomIndex = Math.floor(Math.random() * 3);
    setComputerDecision(choices[randomIndex]);

    handleGameResult(decision, choices[randomIndex]);
  };

  const handleModalClose = (type) => {
    if (type === 1) navigate("/");
    else {
      window.location.reload(false);
    }
  };

  useEffect(() => {
    if (isGameEnded) {
      setShowModal(true);
    }
  }, [isGameEnded]);

  return (
    <div
      className="container-flex text-white"
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
      {gameResult && (
        <h2 className="text-center p-2">
          {gameResult === "win"
            ? "You won"
            : gameResult === "lose"
            ? "You lost"
            : "Draw"}
        </h2>
      )}
      <div className="row justify-content-around">
        <div className="col-md-4">
          <CardData decision={userDecision} point={userPoint} />
        </div>
        <div className="col-md-4">
          <CardData decision={computerDecision} point={computerPoint} />
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
              style={{ maxWidth: "200px", height: "auto" }}
            />
          ))}
        </div>
      )}
      {showModal && (
        <div className="card text-center">
          <div className="card-header">Game Ended</div>
          <div className="card-body">
            {userPoint > computerPoint ? (
              <p className="card-text">
                You won the match by {userPoint - computerPoint} points
              </p>
            ) : (
              <p className="card-text">
                You lost the match by {computerPoint - userPoint} points
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
}

export default PlayWithComputer;
