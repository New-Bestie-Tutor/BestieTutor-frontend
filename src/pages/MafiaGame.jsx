import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MafiaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(location.state?.players || []);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState("night");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (players.length === 0) {
      navigate("/mafiagame-setup");
    }
  }, [players, navigate]);

  const addLog = (message) => {
    setLog((prevLog) => [...prevLog, message]);
  };

  const handleAction = () => {
    if (!selectedPlayer) return;

    if (phase === "night") {
      addLog(`마피아가 ${selectedPlayer}을(를) 공격했습니다.`);
    } else {
      addLog(`${selectedPlayer}에게 투표가 집중되고 있습니다.`);
    }
    setSelectedPlayer(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">마피아 게임 진행</h2>
      <div className="w-full max-w-lg bg-white p-4 mb-4 rounded shadow">
        <h3 className="font-semibold mb-2">게임 로그</h3>
        <div className="h-40 overflow-auto border p-2">
          {log.map((entry, index) => (
            <p key={index} className="text-sm">{entry}</p>
          ))}
        </div>
      </div>
      <div className="w-full max-w-lg bg-white p-4 mb-4 rounded shadow">
        <h3 className="font-semibold mb-2">플레이어 목록</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index} className="flex justify-between p-2 border-b">
              <span>{player.name} ({player.role})</span>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => setSelectedPlayer(player.name)}
              >
                선택
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setPhase(phase === "night" ? "day" : "night")}
      >
        {phase === "night" ? "낮으로 전환" : "밤으로 전환"}
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleAction}
        disabled={!selectedPlayer}
      >
        {phase === "night" ? "마피아 공격" : "투표 진행"}
      </button>
    </div>
  );
};

export default MafiaGame;