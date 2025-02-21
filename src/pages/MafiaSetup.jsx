import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MafiaSetup = () => {
  const navigate = useNavigate();
  const [mafiaCount, setMafiaCount] = useState(1);
  const [roles, setRoles] = useState({ police: true, doctor: true });

  // 마피아 인원 설정 핸들러
  const handleMafiaChange = (e) => {
    let count = parseInt(e.target.value, 10);
    if (count < 1) count = 1; // 최소 1명
    if (count > 3) count = 3; // 최대 3명
    setMafiaCount(count);
  };

  // 직업 포함 여부 설정 핸들러
  const handleRoleChange = (role) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [role]: !prevRoles[role],
    }));
  };

  const handleStartGame = () => {
    const playerNames = ["Player", "AI1", "AI2", "AI3", "AI4", "AI5", "AI6"];
    let rolesArray = Array(mafiaCount).fill("Mafia");

    if (roles.police) rolesArray.push("Police");
    if (roles.doctor) rolesArray.push("Doctor");

    // 남은 자리를 시민으로 채우기
    while (rolesArray.length < playerNames.length) {
      rolesArray.push("Citizen");
    }

    // 역할을 랜덤하게 섞기
    rolesArray = rolesArray.sort(() => Math.random() - 0.5);

    // 플레이어 객체 생성
    const newPlayers = playerNames.map((name, index) => ({
      name,
      role: rolesArray[index],
      isAlive: true,
    }));

    navigate("/mafiagame", { state: { players: newPlayers } });
  };

  return (
    <div>
      <h2>마피아 게임 설정</h2>

      {/* 마피아 인원 선택 */}
      <label>
        마피아 수:
        <input 
          type="number" 
          value={mafiaCount} 
          onChange={handleMafiaChange} 
          min="1" 
          max="2" 
        />
      </label>

      {/* 시민 직업 선택 */}
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
  );
};

export default MafiaSetup;