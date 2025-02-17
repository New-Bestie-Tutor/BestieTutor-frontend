import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setupMafiaGame } from "../api/mafiaApi";

const MafiaSetup = () => {
  const navigate = useNavigate();
  const [mafiaCount, setMafiaCount] = useState(1);
  const [roles, setRoles] = useState({ police: true, doctor: true });
  const [players, setPlayers] = useState([]);

  const handleStartGame = async () => {
    const playerNames = ["Player", "AI1", "AI2", "AI3", "AI4", "AI5", "AI6"];
    let rolesArray = Array(mafiaCount).fill("Mafia");
    rolesArray.push("Citizen");
    if (roles.police) rolesArray.push("Police");
    if (roles.doctor) rolesArray.push("Doctor");
    while (rolesArray.length < 7) rolesArray.push("Citizen");
    rolesArray = rolesArray.sort(() => Math.random() - 0.5);

    const newPlayers = playerNames.map((name, index) => ({
      name,
      role: rolesArray[index],
      isAlive: true,
    }));

    setPlayers(newPlayers);

    try {
      const data = await setupMafiaGame(mafiaCount, roles, newPlayers);
      console.log("게임 설정 성공:", data);
      navigate("/game", { state: { players: newPlayers } });
    } catch (error) {
      console.error("게임 설정 오류:", error);
    }
  };

  return (
    <div>
      <h2>마피아 게임 설정</h2>
      <button onClick={handleStartGame}>게임 시작</button>
    </div>
  );
};

export default MafiaSetup;