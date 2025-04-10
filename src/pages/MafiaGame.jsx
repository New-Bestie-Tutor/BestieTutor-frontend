import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MafiaNight from "../images/MafiaNight.png";
import MafiaDay from "../images/MafiaNight.png";
import axios from "axios";

const MafiaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [gameId, setGameId] = useState(location.state?.gameId || null);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState("day");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [voteInProgress, setVoteInProgress] = useState(true);
  const [executionPhase, setExecutionPhase] = useState(false);
  const [killedPlayer, setKilledPlayer] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [aiMessage, setAiMessage] = useState(" ");
  const [messages, setMessages] = useState([]);
  const [playerMessage, setPlayerMessage] = useState(" ");

  useEffect(() => {
    if (!gameId) {
      navigate("/mafia/game/setup");
      return;
    }

    const fetchGameState = async () => {
      try {
        const response = await axios.get(`/mafia/game/${gameId}`);
        console.log("프론트엔드에서 받아온 players 데이터:", response.data.players);
        if (response.data && response.data.players) {
          setPlayers(response.data.players);
        } else {
          navigate("/mafia/game/setup");
        }
      } catch (error) {
        console.error("게임 데이터를 불러오는 중 오류 발생:", error);
        navigate("/mafia/game/setup");
      }
    };

    fetchGameState();
  }, [gameId, navigate]);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${phase === "night" ? MafiaNight : MafiaDay})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
    };
  }, [phase]);

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
    const theme = phase === "night" ? "dark" : "light";
    console.log("현재 theme 상태:", phase, "→", theme);

    document.body.classList.toggle("bg-gray-900", theme === "dark");
    document.body.classList.toggle("text-white", theme === "dark");
    document.body.classList.toggle("bg-gray-100", theme === "light");
    document.body.classList.toggle("text-black", theme === "light");
  }, [phase]);

  // 🔹 AI가 게임을 진행하는 메시지 가져오기
  const fetchAINarration = async () => {
    console.log("Fetching AI narration for gameId:", gameId);
    try {
      const response = await axios.post("/mafia/game/aiNarration", { gameId });
      console.log("AI Narration Response:", response.data);
      setAiMessage(response.data.message);
    } catch (error) {
      console.error("AI 내러티브 오류:", error.response?.data || error.message);
    }
  };

  // 🔹 플레이어가 입력한 메시지를 AI에게 전달
  const sendPlayerMessage = async () => {
    if (!playerMessage.trim()) return; // 빈 메시지 방지
    try {
      const response = await axios.post("/mafia/game/playerResponse", { gameId, playerMessage });
      const aiResponses = response.data.message; // AI 응답

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: playerMessage }, // 플레이어 메시지 추가
        ...aiResponses.map((ai) => ({
          role: ai.role,
          content: ai.message,
        })), // AI 응답들 추가
      ]);

      setPlayerMessage(""); // 입력 필드 초기화
    } catch (error) {
      console.error("AI 반응 오류:", error);
    }
  };

  useEffect(() => {
    fetchAINarration(); // AI 메세지 페이즈마다 업데이트
  }, [phase]);

  const nextPhase = async () => {
    try {
      const response = await axios.post(`/mafia/game/nextPhase`, { gameId });
      if (!response.data) {
        console.error("Error: 서버에서 응답이 없음!");
        return;
      }

      if (!("gameOver" in response.data)) {
        console.error("Error: gameOver 키가 응답에 없음!", response.data);
        return;
      }

      setPhase(response.data.status);

      if (response.data.gameOver === true) {
        console.log("gameOver 상태 업데이트 전:", response.data.gameOver);
        setGameOver(true);
        setWinner(response.data.winner);
      }
    } catch (error) {
      console.error("페이즈 전환 오류:", error.response?.data || error.message);
    }
  };

  const addLog = (message) => {
    setLog((prevLog) => [...prevLog, `사회자: ${message}`]);
  };

  const handleVote = async () => {
    if (!selectedPlayer) return console.error("Error: 선택된 플레이어가 없습니다.");
    if (!gameId) return console.error("Error: gameId가 없습니다.");

    try {
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

      const response = await axios.post("/mafia/game/decision", {
        gameId,
        decision
      });

      addLog(response.data.message);

      const updatedGame = await axios.get(`/mafia/game/${gameId}`);
      setPlayers(updatedGame.data.players);

      setExecutionPhase(false);
      setSelectedPlayer(null);
      nextPhase();
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
        if (response.data.message.includes("의사의 보호로 살아남았습니다")) {
          addLog(`마피아가 ${response.data.mafiaTarget}을(를) 공격했지만, 의사의 보호로 살아남았습니다.`);
          setKilledPlayer(null);
        } else {
          addLog(`마피아가 ${response.data.mafiaTarget}을(를) 공격했습니다.`);
          setKilledPlayer(response.data.mafiaTarget);
        }
      } else {
        setKilledPlayer(null);
      }

      setVoteInProgress(true);
      nextPhase();
    } catch (error) {
      console.error("밤 처리 중 오류:", error);
    }
  };

  return (
    <div className="mafia-wrapper">
      <div
        className={`mafia-wrapper transition-all duration-500 ${phase === "night" ? "text-white" : "text-black"}`}
        style={{
          '--background-image': `url(${phase === "night" ? MafiaNight : MafiaDay})`,
        }}
      >
        <h2 className="text-2xl font-bold mb-4">마피아 게임 진행</h2>
        {gameOver ? (
          <div className="w-full max-w-lg bg-white p-4 rounded shadow text-center">
            <h3 className="text-xl font-bold mb-2">게임 종료</h3>
            <p className="text-lg font-semibold">{winner} 승리</p>
          </div>
        ) : (
          <>
            <div className="mb-4 w-full max-w-lg bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">사회자 로그</h3>
              <ul>{log.map((entry, index) => <li key={index}>{entry}</li>)}</ul>
            </div>
            <div className="chat-log">
              <h3 className="text-lg font-bold">대화 로그</h3>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role === "user" ? "player" : "ai"}`}>
                  <strong>{msg.role === "user" ? "플레이어" : msg.role}:</strong> {msg.content}
                </div>
              ))}
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

            <div className="mb-4 w-full max-w-lg bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">플레이어 메시지</h3>
              <input
                type="text"
                value={playerMessage}
                onChange={(e) => setPlayerMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="w-full p-2 border rounded"
              />
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
                onClick={sendPlayerMessage}
                disabled={!playerMessage?.trim()} // Optional chaining으로 오류 방지
              >
                메시지 전송
              </button>
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
                          className={`px-4 py-2 rounded m-1 ${selectedTarget === player.name ? "bg-green-500" : "bg-blue-500"} text-white`}
                          onClick={() => {
                            selectTarget(player.name);
                            handleNightActions(player.name);
                          }}
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

            {phase === "day" && (
              <>
                <div className="flex justify-center gap-4 mt-4">
                  <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleVote} disabled={!voteInProgress}>
                    투표 진행
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleFinalDecision("execute")} disabled={!executionPhase || !selectedPlayer}>
                    처형
                  </button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => handleFinalDecision("spare")} disabled={!executionPhase || !selectedPlayer}>
                    살려주기
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MafiaGame;
