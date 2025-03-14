import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MafiaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [gameId, setGameId] = useState(location.state?.gameId || null);
  const [log, setLog] = useState([]);
  const [discussionLog, setDiscussionLog] = useState([]);
  const [phase, setPhase] = useState("day");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [voteInProgress, setVoteInProgress] = useState(true);
  const [executionPhase, setExecutionPhase] = useState(false);
  const [killedPlayer, setKilledPlayer] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [mafiaTarget, setMafiaTarget] = useState(null);
  const [policeTarget, setPoliceTarget] = useState(null);
  const [doctorTarget, setDoctorTarget] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (!gameId) {
      navigate("/game/setup");
      return;
    }

    const fetchGameState = async () => {
      try {
        const response = await axios.get(`/mafia/game/${gameId}`);
        console.log("프론트엔드에서 받아온 players 데이터:", response.data.players);
        if (response.data && response.data.players) {
          setPlayers(response.data.players);
          checkGameOver(response.data.players);
        } else {
          navigate("/game/setup");
        }
      } catch (error) {
        console.error("게임 데이터를 불러오는 중 오류 발생:", error);
        navigate("/game/setup");
      }
    };

    fetchGameState();
  }, [gameId, navigate]);

  useEffect(() => {
    const user = players.find((p) => p.name === "Player");
    if (user) {
      setCurrentUser(user);
    }
  }, [players]);

  useEffect(() => {
    if (!userRole && currentUser) {
      const foundPlayer = players.find((p) => p.name === currentUser.name);
      if (foundPlayer) {
        setUserRole(foundPlayer.role);
      }
    }
  }, [currentUser, players]);

  useEffect(() => {
    console.log("현재 역할:", userRole);
    console.log("현재 게임 상태:", phase);
  }, [userRole, phase]);

  useEffect(() => {
    if (players.length === 0) return;
    checkGameOver();
  }, [players]);

  useEffect(() => {
    setTheme(phase === "night" ? "dark" : "light");
  }, [phase]);

  const addLog = (message) => {
    setLog((prevLog) => [...prevLog, `사회자: ${message}`]);
  };

  const addDiscussionLog = (message) => {
    setDiscussionLog((prevLog) => [...prevLog, message]);
  };

  const handleVote = async () => {
    if (!selectedPlayer) return console.error("❌ Error: 선택된 플레이어가 없습니다.");
    if (!gameId) return console.error("❌ Error: gameId가 없습니다.");

    try {
      console.log("🗳️ Sending vote request:", { gameId, selectedPlayer });

      const response = await axios.post("/mafia/game/vote", {
        gameId,
        selectedPlayer
      });

      addLog(response.data.message);
      setVoteInProgress(false);
      setExecutionPhase(true);
    } catch (error) {
      console.error("투표 오류:", error.response?.data?.message || error.message);
    }
  };

  const handleFinalDecision = async (decision) => {
    if (!gameId) {
      console.error("게임 ID가 없습니다.");
      return;
    }

    try {
      // 투표 이후 바로 결정 요청하지 않고 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`🛠️ 최종 결정 요청: ${decision}, 게임 ID: ${gameId}`);

      const response = await axios.post("/mafia/game/decision", {
        gameId,
        decision
      });

      addLog(response.data.message);

      if (decision === "execute" && selectedPlayer) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.name === selectedPlayer ? { ...player, isAlive: false } : player
          )
        );
      }
      setExecutionPhase(false);
      setSelectedPlayer(null);
      setPhase("night");
    } catch (error) {
      console.error("최종 결정 오류:", error.response?.data?.message || error.message);
    }
  };

  const handleNightActions = async () => {
    addLog("밤이 되었습니다. 각 역할이 능력을 사용하세요.");

    if (userRole === "Mafia") {
      addLog("마피아는 공격할 대상을 선택하세요.");
      return;
    }

    if (userRole === "Police") {
      addLog("경찰은 조사할 대상을 선택하세요.");
      return;
    }

    if (userRole === "Doctor") {
      addLog("의사는 보호할 대상을 선택하세요.");
      return;
    }

    if (userRole === "Citizen") {
      addLog("시민은 밤에 특별한 행동을 할 수 없습니다.");
      await checkNightProgress();
    }
  };

  const selectTarget = async (target) => {
    try {
      if (userRole === "Mafia") {
        await axios.post("/mafia/game/mafia", { gameId, mafiaTarget: target });
      }
      if (userRole === "Police") {
        await axios.post("/mafia/game/police", { gameId, policeTarget: target });
      }
      if (userRole === "Doctor") {
        await axios.post("/mafia/game/doctor", { gameId, doctorTarget: target });
      }
      console.log(`🔹 ${userRole}가 선택한 대상:`, target);
      addLog(`${userRole}가 ${target}을(를) 선택했습니다.`);
      checkNightProgress();
    } catch (error) {
      console.error("선택 오류:", error);
    }
  };

  const checkNightProgress = async () => {
    try {
      const response = await axios.post("/mafia/game/process", { gameId });
      addLog(response.data.message);

      if (response.data.policeResult) {
        addLog(`경찰이 조사한 결과: ${response.data.policeResult}`);
      }

      if (response.data.mafiaTarget) {
        addLog(`마피아가 ${response.data.mafiaTarget}을(를) 공격했습니다.`);
        setKilledPlayer(response.data.mafiaTarget); // 죽은 플레이어 저장
      }

      setPhase("day");
      setVoteInProgress(true);
    } catch (error) {
      console.error("밤 처리 중 오류:", error);
    }
  };

  const checkGameOver = (playersData = players) => {
    if (!playersData || playersData.length === 0) return;

    const mafiaCount = playersData.filter((p) => p.role === "Mafia" && p.isAlive).length;
    const citizenCount = playersData.filter((p) => p.role !== "Mafia" && p.isAlive).length;

    if (mafiaCount === 0) {
      setGameOver(true);
      setWinner("시민 승리!");
    } else if (mafiaCount >= citizenCount) {
      setGameOver(true);
      setWinner("마피아 승리!");
    }
  };

  return (
    <div className={`p-6 min-h-screen flex flex-col items-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h2 className="text-2xl font-bold mb-4">마피아 게임 진행</h2>
      {gameOver ? (
        <div className="w-full max-w-lg bg-white p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold mb-2">게임 종료</h3>
          <p className="text-lg font-semibold">{winner}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 w-full max-w-lg bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">사회자 로그</h3>
            <ul>{log.map((entry, index) => <li key={index}>{entry}</li>)}</ul>
          </div>
          <div className="mb-4 w-full max-w-lg bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">플레이어 목록</h3>
            <ul>
              {players.map((player) => {
                const isDead = !player.isAlive || player.name === killedPlayer;

                return (
                  <li key={player.name} className={isDead ? "text-gray-500 line-through" : "text-black"}>
                    <input
                      type="radio"
                      name="playerSelect"
                      onChange={() => setSelectedPlayer(player.name)}
                      disabled={isDead || phase !== "day" || executionPhase}
                    />
                    {player.name} ({player.role})
                  </li>
                );
              })}
            </ul>
          </div>
          {phase === "night" && userRole !== "Citizen" && (
            <div className="mb-4 w-full max-w-lg bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">{userRole} 능력 사용</h3>
              <ul>
                {players
                  .filter((p) => p.isAlive && (userRole === "Doctor" || p.name !== currentUser.name))
                  .map((player) => (
                    <li key={player.name}>
                      <button
                        className={`px-4 py-2 rounded m-1 ${selectedTarget === player.name ? "bg-green-500" : "bg-blue-500"
                          } text-white`}
                        onClick={() => selectTarget(player.name)}
                        disabled={!player.isAlive}
                      >
                        {player.name} 선택
                      </button>
                    </li>
                  ))}
              </ul>
              {selectedTarget && <p className="mt-2">선택된 대상: {selectedTarget}</p>}
            </div>
          )}
          {phase === "day" ? (
            <>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleVote} disabled={!voteInProgress}>
                투표 진행
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleFinalDecision("execute")}
                disabled={!executionPhase || !selectedPlayer}
              >
                처형
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => handleFinalDecision("spare")}
                disabled={!executionPhase || !selectedPlayer}
              >
                살려주기
              </button>
            </>
          ) : (
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNightActions}>
              밤 진행
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MafiaGame;
