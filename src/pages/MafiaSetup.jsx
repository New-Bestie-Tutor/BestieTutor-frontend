import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MafiaNight from "../images/MafiaNight.png";
import axios from "axios";

const MafiaSetup = () => {
  const navigate = useNavigate();
  const [mafiaCount, setMafiaCount] = useState(1);
  const [voteResultModalOpen, setVoteResultModalOpen] = useState(true);
  const [roles, setRoles] = useState({ police: true, doctor: true });

  const handleMafiaChange = (e) => {
    let count = parseInt(e.target.value, 10);
    if (count < 1) count = 1;
    if (count > 3) count = 3;
    setMafiaCount(count);
  };

  const handleRoleChange = (role) => {
    setRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const handleStartGame = async () => {
    const playerNames = ["Player", "Bettu", "Rabin", "Bambi", "Beary", "Tiron", "Marin"];

    let rolesArray = Array(mafiaCount).fill("Mafia");
    if (roles.police) rolesArray.push("Police");
    if (roles.doctor) rolesArray.push("Doctor");
    while (rolesArray.length < playerNames.length) rolesArray.push("Citizen");
    rolesArray = rolesArray.sort(() => Math.random() - 0.5);

    const newPlayers = playerNames.map((name, index) => ({
      name,
      role: rolesArray[index],
      isAlive: true,
      avatar:
        name === "Player"
          ? "player.png"
          : `${name}.png`,
    }));
    console.log("newPlayers:", newPlayers);
    try {
      const response = await axios.post("/mafia/game/setup", {
        mafiaCount,
        roles,
        players: newPlayers,
      });

      if (response.data.gameId) {
        navigate("/mafiagame", {
          state: {
            gameId: response.data.gameId,
            players: newPlayers,
          },
        });
      }
    } catch (error) {
      console.error("게임 시작 중 오류 발생:", error);
    }
  };

  return (
    <div
      className="mafia-wrapper"
      style={{
        backgroundImage: `url(${MafiaNight})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      {voteResultModalOpen && (
        <div className="mafia-modal-overlay">
          <div className="vote-modal">
            <h2>마피아 게임 설정</h2>

            <label>
              마피아 수:
              <input
                type="number"
                value={mafiaCount}
                onChange={handleMafiaChange}
                min="1"
                max="3"
              />
            </label>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={roles.police}
                  onChange={() => handleRoleChange("police")}
                />
                경찰 포함
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={roles.doctor}
                  onChange={() => handleRoleChange("doctor")}
                />
                의사 포함
              </label>
            </div>

            <button onClick={handleStartGame}>게임 시작</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MafiaSetup;