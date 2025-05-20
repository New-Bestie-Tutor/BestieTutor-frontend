import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MafiaNight from "../images/MafiaNight.png";
import MafiaDay from "../images/MafiaDay.png";
import axios from "axios";
import Bambi from "../images/Bambi.png";
import Beary from "../images/Beary.png";
import Bettu from "../images/Bettu.png";
import Marin from "../images/Marin.png";
import Rabin from "../images/Rabin.png";
import Tiron from "../images/Tiron.png";
import player from "../images/player.png";

const MafiaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(location.state?.players || []);
  const [gameId, setGameId] = useState(location.state?.gameId || null);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState("day");
  const [round, setRound] = useState(1);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [voteResultModalOpen, setVoteResultModalOpen] = useState(false);
  const [voteResult, setVoteResult] = useState("");
  const [isNightModalOpen, setIsNightModalOpen] = useState(false);
  const [nightActionTarget, setNightActionTarget] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [voteInProgress, setVoteInProgress] = useState(true);
  const [executionPhase, setExecutionPhase] = useState(false);
  const [killedPlayer, setKilledPlayer] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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

  const handleLeaveGame = () => {
    if (window.confirm("게임을 나가시겠습니까?")) {
      navigate("/home");
    }
  };

  const avatarMap = {
    "Bambi.png": Bambi,
    "Beary.png": Beary,
    "Bettu.png": Bettu,
    "Marin.png": Marin,
    "Rabin.png": Rabin,
    "Tiron.png": Tiron,
    "player.png": player,
  };

  useEffect(() => {
    const user = players.find((p) => p.name === "Player");
    if (user) {
      setCurrentUser(user);
    }
  }, [players]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsVoteModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (phase === "night") {
      handleNightActions();
    }
  }, [phase]);

  useEffect(() => {
    if (!userRole && currentUser) {
      const foundPlayer = players.find((p) => p.name === currentUser.name);
      if (foundPlayer) {
        setUserRole(foundPlayer.role);
      }
    }
  }, [currentUser, players]);

  useEffect(() => {
    const theme = phase === "night" ? "dark" : "light";
    document.body.classList.toggle("bg-gray-900", theme === "dark");
    document.body.classList.toggle("text-white", theme === "dark");
    document.body.classList.toggle("bg-gray-100", theme === "light");
    document.body.classList.toggle("text-black", theme === "light");
  }, [phase]);

  // 🔹 AI가 게임을 진행하는 메시지 가져오기
  const fetchAINarration = async () => {
    try {
      const response = await axios.post("/mafia/game/aiNarration", { gameId });
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
          name: ai.name,
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

  const openVoteModal = () => {
    setIsVoteModalOpen(true);
    setSelectedPlayer(null); // 기존 선택 초기화
  };

  const handleVote = async (votedPlayer) => {
    if (!votedPlayer) return console.error("Error: 선택된 플레이어가 없습니다.");
    if (!gameId) return console.error("Error: gameId가 없습니다.");

    try {
      const response = await axios.post("/mafia/game/vote", {
        gameId,
        selectedPlayer: votedPlayer,
      });

      addLog(response.data.message);
      setVoteResult(`${votedPlayer}가 최다 득표를 받았습니다.`);
      setVoteResultModalOpen(true);

      setVoteInProgress(false);
      setExecutionPhase(true);
      setIsVoteModalOpen(false);
      setSelectedPlayer(null);
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

  const handleNightActions = () => {
    if (["Mafia", "Police", "Doctor"].includes(userRole)) {
      setIsNightModalOpen(true);
    } else {
      addLog("시민은 밤에 특별한 행동을 할 수 없습니다.");
    }
  };

  const selectTarget = async (target) => {
    try {
      if (!target) return;
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
      setIsNightModalOpen(false);
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
    <div
      className={`mafia-wrapper ${phase === "night" ? "text-white" : "text-black"}`}
      style={{
        backgroundImage: `url(${phase === "night" ? MafiaNight : MafiaDay})`,
      }}
    >
      {/* 상단바 */}
      <div className="top-bar">
        <button onClick={handleLeaveGame} className="exit-btn">⬅ 나가기</button>
        <div className="system-message">
          {phase === "night" ? "🌙" : "☀️"} {round}번째 {phase === "night" ? "밤" : "낮"}
        </div>
        <div className="role-info"
          style={{ color: phase === "night" ? "white" : "black" }}
        >
          내 직업 <br /><strong>{userRole}</strong>
        </div>
      </div>
      {/* 사회자 로그 */}
      <div className="moderator-log">
        <span>🗨️ {aiMessage} </span>
      </div>
      {/* 플레이어 리스트 */}
      <div className="player-list">
        <h3>Player List</h3>
        <div className="player-grid">
          {players.map((player) => {
            const isDead = !player.isAlive || player.name === killedPlayer;
            return (
              <div
                key={player.name}
                className={`player-item ${isDead ? "player-dead" : ""}`}
              >
                <span>●</span> {player.name}
              </div>
            );
          })}
        </div>
      </div>
      {/* 채팅창 */}
      <div className="chat-panel centered-chat-panel">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}>
              <strong>{msg.name === "user" ? "플레이어" : msg.name}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={playerMessage}
            onChange={(e) => setPlayerMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
          />
          <button className="send-btn" onClick={sendPlayerMessage} disabled={!playerMessage?.trim()}>
            전송
          </button>
        </div>
      </div>
      {phase === "day" && (
        <div className="vote-button">
          <button className="vote-btn" onClick={openVoteModal} disabled={!voteInProgress}>투표 진행</button>
        </div>
      )}
      {isVoteModalOpen && (
        <div className="mafia-modal-overlay" onClick={() => setIsVoteModalOpen(false)}>
          <div className="vote-modal" onClick={(e) => e.stopPropagation()}>
            <p className="vote-title">예상되는 마피아를 투표해주세요.</p>
            <div className="vote-characters">
              {players.filter(p => p.isAlive).map((p) => {
                return (
                  <div
                    key={p._id}
                    className={`character-icon ${selectedVote === p.name ? "selected" : ""}`}
                    onClick={() => setSelectedVote(p.name)}
                  >
                    <img src={avatarMap[p.avatar]} alt={p.name} />
                    <p>{p.name}</p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => handleVote(selectedVote)}
              disabled={!selectedVote}
              className="confirm-btn"
            >
              투표하기
            </button>
          </div>
        </div>
      )}
      {voteResultModalOpen && (
        <div className="modal-overlay" onClick={() => setVoteResultModalOpen(false)}>
          <div className="vote-modal" onClick={(e) => e.stopPropagation()}>
            <p className="vote-title">{voteResult}</p>
            <p className="vote-subtext">해당 플레이어를 처형하시겠습니까?</p>
            <div className="vote-actions">
              <button
                className="execute-btn"
                onClick={() => {
                  handleFinalDecision("execute");
                  setVoteResultModalOpen(false);
                }}
              >
                처형
              </button>
              <button
                className="spare-btn"
                onClick={() => {
                  handleFinalDecision("spare");
                  setVoteResultModalOpen(false);
                }}
              >
                살려주기
              </button>
            </div>
          </div>
        </div>
      )}
      {isNightModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNightModalOpen(false)}>
          <div className="vote-modal" onClick={(e) => e.stopPropagation()}>
            <p className="vote-title">
              {userRole === "Mafia" && "공격할 대상을 선택하세요"}
              {userRole === "Police" && "조사할 대상을 선택하세요"}
              {userRole === "Doctor" && "보호할 대상을 선택하세요"}
            </p>

            <div className="vote-characters">
              {players.filter(p => p.isAlive).map((p) => (
                <div
                  key={p.name}
                  className={`character-icon ${nightActionTarget === p.name ? "selected" : ""}`}
                  onClick={() => setNightActionTarget(p.name)}
                >
                  <img src={avatarMap[p.avatar]} alt={p.name} />
                  <p>{p.name}</p>
                </div>
              ))}
            </div>

            <button
              className="vote-button"
              disabled={!nightActionTarget}
              onClick={async () => {
                await selectTarget(nightActionTarget);
                setIsNightModalOpen(false);
              }}
            >
              선택 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MafiaGame;
