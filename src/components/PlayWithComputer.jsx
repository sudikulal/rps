import React, { useState, useEffect } from "react";
import { image } from "../assets/Images";

const choices = ["rock", "paper", "scissor"];

function PlayWithComputer() {
  const [userDecision, setUserDecision] = useState("pending");
  const [computerDecision, setComputerDecision] = useState("pending");
  const [userPoint, setUserPoint] = useState(0);
  const [computerPoint, setComputerPoint] = useState(0);
  const [gameResult, setGameResult] = useState(null);

  const CardData = ({ point, decision }) => (
    <div className="container-flex justify-content-center justify-item-center mt-4">
      <span>POINT : {point}</span>
      <div className="decision">
        <img src={image[decision]} alt={image["pending"]} className="image" />
      </div>
    </div>
  );

  const handleGameResult = (decision, computerDecision) => {
    if (decision === computerDecision) {
      setGameResult("draw");
    } else if (
      (decision === "rock" && computerDecision === "scissor") ||
      (decision === "paper" && computerDecision === "rock") ||
      (decision === "scissor" && computerDecision === "paper")
    ) {
      setGameResult("win");
      setUserPoint(userPoint + 1);
    } else {
      setGameResult("lose");
      setComputerPoint(computerPoint + 1);
    }
  };

  const handleClick = (decision) => {
    setUserDecision(decision);
    const randomIndex = Math.floor(Math.random() * 3);
    setComputerDecision(choices[randomIndex]);

    handleGameResult(decision, choices[randomIndex]);

    setTimeout(() => {
      setUserDecision("pending");
      setComputerDecision("pending");
      setGameResult(null);
    }, 2000);
  };

  return (
    <div className="container-flex wh-100">
      {gameResult && (
        <h2 className="text-center mt-4 p-2">
          {gameResult === "win"
            ? "You won"
            : gameResult === "lose"
            ? "You lost"
            : "Draw"}
        </h2>
      )}
      <div className="row justify-content-around">
        <div className="col-4">
          <CardData decision={userDecision} point={userPoint} />
        </div>
        <div className="col-4">
          <CardData decision={computerDecision} point={computerPoint} />
        </div>
      </div>
      {!gameResult && (
        <div className="selector d-flex justify-content-center mt-5">
          {choices.map((choice) => (
            <img
              key={choice}
              className="rounded mx-2 p-4"
              src={image[choice]}
              onClick={() => handleClick(choice)}
              alt={choice}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayWithComputer;
