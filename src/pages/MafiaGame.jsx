import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MafiaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(location.state?.players || []);
  const [log, setLog] = useState([]);
  const [discussionLog, setDiscussionLog] = useState([]);
  const [phase, setPhase] = useState("day");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [voteInProgress, setVoteInProgress] = useState(true);
  const [executionPhase, setExecutionPhase] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [mafiaTarget, setMafiaTarget] = useState(null);
  const [policeTarget, setPoliceTarget] = useState(null);
  const [doctorTarget, setDoctorTarget] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (players.length === 0) {
      navigate("/mafiagame-setup");
    }
  }, [players, navigate]);

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

  const handleVote = () => {
    if (!selectedPlayer) return;
    addLog(`${selectedPlayer}가 최다 득표자로 선정되었습니다.`);
    setVoteInProgress(false);
    setExecutionPhase(true);
  };

  const handleFinalDecision = (decision) => {
    if (decision === "execute") {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.name === selectedPlayer ? { ...player, isAlive: false } : player
        )
      );
      addLog(`${selectedPlayer}가 처형되었습니다.`);
    } else {
      addLog(`${selectedPlayer}가 살아남았습니다.`);
    }
    setExecutionPhase(false);
    setSelectedPlayer(null);
    setPhase("night");
  };

// 밤이 되면 유저의 직업에 따라 선택 UI를 표시
const handleNightActions = () => {
  addLog("밤이 되었습니다. 각 역할이 능력을 사용하세요.");

  if (userRole === "Mafia") {
    addLog("마피아는 공격할 대상을 선택하세요.");
    return; // 유저가 선택할 때까지 대기
  }

  if (userRole === "Police") {
    addLog("경찰은 조사할 대상을 선택하세요.");
    return; // 유저가 선택할 때까지 대기
  }

  if (userRole === "Doctor") {
    addLog("의사는 보호할 대상을 선택하세요.");
    return; // 유저가 선택할 때까지 대기
  }

  if (userRole === "Citizen") {
    addLog("시민은 밤에 특별한 행동을 할 수 없습니다.");
    processAITurns();
  }
};

// 유저가 선택한 후 밤을 진행하는 함수
const processNightActions = () => {
  setTimeout(() => {
    let newPlayers = [...players];

    // 경찰 조사
    if (policeTarget) {
      const role = newPlayers.find(p => p.name === policeTarget)?.role;
      addLog(`경찰이 ${policeTarget}의 직업을 확인했습니다: ${role}`);
    }

    // 의사 보호
    let protectedPlayer = doctorTarget;
    if (protectedPlayer) {
      addLog(`의사가 ${protectedPlayer}을(를) 보호했습니다.`);
    }

    // 마피아 공격
    if (mafiaTarget && mafiaTarget !== protectedPlayer) {
      newPlayers = newPlayers.map((player) =>
        player.name === mafiaTarget ? { ...player, isAlive: false } : player
      );
      addLog(`마피아가 ${mafiaTarget}을(를) 공격했습니다.`);
    } else if (mafiaTarget === protectedPlayer) {
      addLog(`의사가 ${mafiaTarget}을(를) 보호하여 마피아의 공격을 막았습니다.`);
    }

    // 상태 업데이트
    setPlayers(newPlayers);
    setMafiaTarget(null);
    setPoliceTarget(null);
    setDoctorTarget(null);

    setTimeout(() => {
      setPhase("day");
      setVoteInProgress(true);
    }, 1000);
  }, 3000);
};

// 유저가 대상 선택 시 실행
const selectTarget = (target) => {
  if (userRole === "Mafia") {
    setMafiaTarget(target);
  }
  if (userRole === "Police") {
    setPoliceTarget(target);
  }
  if (userRole === "Doctor") {
    setDoctorTarget(target);
  }

  addLog(`${userRole}가 ${target}을(를) 선택했습니다.`);

  // 모든 선택이 완료되었는지 확인 후 진행
  if (mafiaTarget && policeTarget && doctorTarget) {
    processNightActions();
  }
};

// AI 자동 선택 처리
const processAITurns = () => {
  let updated = false;
  const alivePlayers = players.filter((p) => p.isAlive);

  // 마피아가 아직 공격 대상을 정하지 않았다면 랜덤 선택
  if (!mafiaTarget) {
    const target = alivePlayers.filter(p => p.role !== "Mafia");
    if (target.length > 0) {
      setMafiaTarget(target[Math.floor(Math.random() * target.length)].name);
      updated = true;
    }
  }

  // 의사가 아직 보호 대상을 정하지 않았다면 랜덤 선택 (자기 자신도 가능)
  if (!doctorTarget) {
    if (alivePlayers.length > 0) {
      setDoctorTarget(alivePlayers[Math.floor(Math.random() * alivePlayers.length)].name);
      updated = true;
    }
  }

  // 경찰이 아직 조사 대상을 정하지 않았다면 랜덤 선택 (자기 자신 제외)
  if (!policeTarget) {
    const target = alivePlayers.filter(p => p.role !== "Police");
    if (target.length > 0) {
      setPoliceTarget(target[Math.floor(Math.random() * target.length)].name);
      updated = true;
    }
  }
};

useEffect(() => {
  console.log("현재 선택 상태:", { mafiaTarget, policeTarget, doctorTarget });

  // 유저가 마피아/경찰/의사라면, 유저가 선택을 완료할 때까지 AI는 대기
  if (phase === "night" && userRole !== "Citizen") {
    if (!mafiaTarget && userRole === "Mafia") return;
    if (!policeTarget && userRole === "Police") return;
    if (!doctorTarget && userRole === "Doctor") return;
  }

  // AI의 선택이 필요한 경우 AI 행동 수행
  if (phase === "night") {
    processAITurns();
  }
}, [phase, mafiaTarget, policeTarget, doctorTarget]);

useEffect(() => {
  console.log("유저 및 AI 선택 완료 여부:", { mafiaTarget, policeTarget, doctorTarget });

  // 모든 역할의 선택이 완료된 경우에만 밤의 행동 진행
  if (phase === "night" && mafiaTarget && policeTarget && doctorTarget) {
    processNightActions();
  }
}, [mafiaTarget, policeTarget, doctorTarget]);

const logAdded = useRef(false);

useEffect(() => {
  console.log("useEffect 실행됨"); // 디버깅용

  if (phase === "day" && !logAdded.current) {
    addLog("아침이 밝았습니다! 투표를 진행하세요.");
    logAdded.current = true; // 중복 실행 방지
  }
}, [phase]);

  const checkGameOver = () => {
    const mafiaCount = players.filter((p) => p.role === "Mafia" && p.isAlive).length;
    const citizenCount = players.filter((p) => p.role !== "Mafia" && p.isAlive).length;

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
              {players.map((player) => (
                <li key={player.name} className={player.isAlive ? "text-black" : "text-gray-500 line-through"}>
                  <input type="radio" name="playerSelect" onChange={() => setSelectedPlayer(player.name)} disabled={!player.isAlive} />
                  {player.name} ({player.role})
                </li>
              ))}
            </ul>
          </div>

          {/* 유저가 능력을 사용하는 UI 추가 */}
          {phase === "night" && userRole != "Citizen" && (
            <div className="mb-4 w-full max-w-lg bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">{userRole} 능력 사용</h3>
              <ul>
                {players
                  .filter((p) => p.isAlive && (userRole === "Doctor" || p.name !== currentUser.name)) // 본인 제외, 살아있는 플레이어만 선택 가능
                  .map((player) => (
                    <li key={player.name}>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded m-1"
                        onClick={() => selectTarget(player.name)}
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
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleVote} disabled={!voteInProgress}>투표 진행</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleFinalDecision("execute")} disabled={!executionPhase}>처형</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => handleFinalDecision("spare")} disabled={!executionPhase}>살려주기</button>
            </>
          ) : (
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNightActions}>밤 진행</button>
          )}
        </>
      )}
    </div>
  );
};

export default MafiaGame;
