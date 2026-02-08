// src/screens/GameScreen.js
import React, { useState } from "react";
import { BOARD_SIZE, PLAYERS, COLORS, DIRECTIONS, COMMON_STYLES } from "../constants";
import RuleModal from "../components/RuleModal";

const STATUS = {
  PLAYING: "PLAYING",
  SELECTING: "SELECTING",
  DRAW: "DRAW",
  WIN: "WIN",
};

const GameScreen = ({ isHermitMode, onBackToHome }) => {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
  );
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.FIRST);
  const [gameStatus, setGameStatus] = useState(STATUS.PLAYING);
  const [winner, setWinner] = useState(null);

  const [turnCount, setTurnCount] = useState(1);
  const [movesInCurrentTurn, setMovesInCurrentTurn] = useState(0);
  const [firstMoveCoords, setFirstMoveCoords] = useState(null);

  const [lockedSets, setLockedSets] = useState([]);
  const [winningSets, setWinningSets] = useState([]);

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const [pendingCoords, setPendingCoords] = useState(null);

  const [history, setHistory] = useState([]);
  const [showInGameRules, setShowInGameRules] = useState(false);

  // --- Helpers ---
  const isValidPos = (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
  const isAdjacent = (r1, c1, r2, c2) => Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
  const isBoardFull = (bd) => bd.every((row) => row.every((cell) => cell !== null));

  // --- Logic ---
  const saveHistory = () => {
    const currentState = {
      board: JSON.parse(JSON.stringify(board)),
      currentPlayer,
      gameStatus,
      winner,
      turnCount,
      movesInCurrentTurn,
      firstMoveCoords: firstMoveCoords ? [...firstMoveCoords] : null,
      lockedSets: JSON.parse(JSON.stringify(lockedSets)),
      winningSets: JSON.parse(JSON.stringify(winningSets)),
      candidates: JSON.parse(JSON.stringify(candidates)),
      selectedCandidateIndex,
      pendingCoords: pendingCoords ? [...pendingCoords] : null,
    };
    setHistory((prev) => [...prev, currentState]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    setBoard(previousState.board);
    setCurrentPlayer(previousState.currentPlayer);
    setGameStatus(previousState.gameStatus);
    setWinner(previousState.winner);
    setTurnCount(previousState.turnCount);
    setMovesInCurrentTurn(previousState.movesInCurrentTurn);
    setFirstMoveCoords(previousState.firstMoveCoords);
    setLockedSets(previousState.lockedSets);
    setWinningSets(previousState.winningSets);
    setCandidates(previousState.candidates);
    setSelectedCandidateIndex(previousState.selectedCandidateIndex);
    setPendingCoords(previousState.pendingCoords);
    setHistory(newHistory);
  };

  const validateCandidate = (newCandidate, player, currentLockedSets) => {
    const mySets = currentLockedSets.filter((s) => s.player === player);
    const isExactMatch = mySets.some((set) => JSON.stringify(set.cells.sort()) === JSON.stringify(newCandidate.cells.sort()));
    if (isExactMatch) return false;

    const allCells = [];
    mySets.forEach((s) => allCells.push(...s.cells));
    allCells.push(...newCandidate.cells);

    const counts = {};
    allCells.forEach((c) => {
      counts[c] = (counts[c] || 0) + 1;
    });

    let sharedSpots = 0;
    let tripleOverlap = false;

    Object.values(counts).forEach((count) => {
      if (count > 1) sharedSpots++;
      if (count > 2) tripleOverlap = true;
    });

    if (tripleOverlap) return false;
    if (sharedSpots > 1) return false;

    return true;
  };

  const findValidCandidates = (currentBoard, player, currentLockedSets) => {
    const foundLines = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] !== player) continue;
        DIRECTIONS.forEach(([dr, dc]) => {
          if (!isValidPos(r + dr * 3, c + dc * 3)) return;
          if (
            currentBoard[r + dr * 1][c + dc * 1] === player &&
            currentBoard[r + dr * 2][c + dc * 2] === player &&
            currentBoard[r + dr * 3][c + dc * 3] === player
          ) {
            const lineCells = [`${r},${c}`, `${r + dr * 1},${c + dc * 1}`, `${r + dr * 2},${c + dc * 2}`, `${r + dr * 3},${c + dc * 3}`].sort();
            const candidate = { player, cells: lineCells };
            if (validateCandidate(candidate, player, currentLockedSets)) {
              foundLines.push(candidate);
            }
          }
        });
      }
    }
    return foundLines;
  };

  const checkVictory = (player, sets) => {
    const mySets = sets.filter((s) => s.player === player);
    if (mySets.length < 3) return null;

    for (let i = 0; i < mySets.length - 2; i++) {
      for (let j = i + 1; j < mySets.length - 1; j++) {
        for (let k = j + 1; k < mySets.length; k++) {
          const uniqueCells = new Set([...mySets[i].cells, ...mySets[j].cells, ...mySets[k].cells]);
          if (uniqueCells.size >= 11) {
            return [mySets[i], mySets[j], mySets[k]];
          }
        }
      }
    }
    return null;
  };

  const proceedTurn = (r, c) => {
    const nextMoves = movesInCurrentTurn + 1;
    let turnEnds = false;
    if (turnCount === 1) turnEnds = true;
    else if (nextMoves >= 2) turnEnds = true;

    if (turnEnds) {
      setMovesInCurrentTurn(0);
      setFirstMoveCoords(null);
      setTurnCount(turnCount + 1);
      setCurrentPlayer(currentPlayer === PLAYERS.FIRST ? PLAYERS.SECOND : PLAYERS.FIRST);
    } else {
      setMovesInCurrentTurn(nextMoves);
      setFirstMoveCoords([r, c]);
    }
  };

  const handleCellClick = (r, c) => {
    if (gameStatus !== STATUS.PLAYING || board[r][c] !== null) return;
    if (movesInCurrentTurn === 1 && firstMoveCoords) {
      const [fr, fc] = firstMoveCoords;
      if (isAdjacent(fr, fc, r, c)) {
        alert("【禁手】隣り合うマスには打てませぬ。");
        return;
      }
    }

    saveHistory(); // 履歴保存

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = currentPlayer;
    setBoard(newBoard);

    const validCandidates = findValidCandidates(newBoard, currentPlayer, lockedSets);

    if (validCandidates.length === 0) {
      if (isBoardFull(newBoard)) setGameStatus(STATUS.DRAW);
      else proceedTurn(r, c);
    } else if (validCandidates.length === 1) {
      confirmLock(validCandidates[0], newBoard, r, c);
    } else {
      setCandidates(validCandidates);
      setSelectedCandidateIndex(0);
      setPendingCoords([r, c]);
      setGameStatus(STATUS.SELECTING);
    }
  };

  const handleConfirmClick = () => {
    saveHistory(); // 履歴保存
    confirmLock(candidates[selectedCandidateIndex], board, pendingCoords[0], pendingCoords[1]);
  };

  const confirmLock = (candidate, currentBoard, r, c) => {
    const newLockedSets = [...lockedSets, { ...candidate, id: Date.now() + Math.random() }];

    const winningCombo = checkVictory(currentPlayer, newLockedSets);
    if (winningCombo) {
      setLockedSets(newLockedSets);
      setWinner(currentPlayer);
      setGameStatus(STATUS.WIN);
      setWinningSets(winningCombo);
      return;
    }

    const remainingCandidates = findValidCandidates(currentBoard, currentPlayer, newLockedSets);

    if (remainingCandidates.length > 0) {
      setLockedSets(newLockedSets);

      if (remainingCandidates.length === 1) {
        confirmLock(remainingCandidates[0], currentBoard, r, c);
      } else {
        setCandidates(remainingCandidates);
        setSelectedCandidateIndex(0);
        setPendingCoords([r, c]);
        setGameStatus(STATUS.SELECTING);
      }
    } else {
      setLockedSets(newLockedSets);
      setCandidates([]);
      setSelectedCandidateIndex(0);

      if (isBoardFull(currentBoard)) {
        setGameStatus(STATUS.DRAW);
        return;
      }

      setGameStatus(STATUS.PLAYING);
      proceedTurn(r, c);
    }
  };

  // --- UI ---
  const getCellStyles = (r, c, cellValue) => {
    const coord = `${r},${c}`;
    let style = { ...styles.cell };
    let markStyle = { ...styles.mark };

    if (cellValue === PLAYERS.FIRST) markStyle.color = COLORS.p1;
    if (cellValue === PLAYERS.SECOND) markStyle.color = COLORS.p2;

    if (winningSets.some((s) => s.cells.includes(coord))) {
      style.backgroundColor = COLORS.locked;
      style.borderColor = "#f39c12";
      markStyle.color = "#fff";
      return { style, markStyle };
    }

    if (gameStatus === STATUS.SELECTING) {
      const activeCandidate = candidates[selectedCandidateIndex];
      if (activeCandidate && activeCandidate.cells.includes(coord)) {
        style.backgroundColor = COLORS.selected;
        markStyle.color = "#fff";
        style.transform = "scale(0.95)";
        style.borderRadius = "50%";
        style.zIndex = 10;
        return { style, markStyle };
      }
      if (candidates.some((cand) => cand.cells.includes(coord))) {
        style.backgroundColor = "#e8f8f5";
        style.boxShadow = `inset 0 0 0 2px ${COLORS.candidate}`;
      }
    }

    const lockedSet = lockedSets.find((s) => s.cells.includes(coord));
    if (lockedSet) {
      style.background = "linear-gradient(135deg, #fff 25%, #fff9c4 50%, #fff 75%)";
      style.backgroundSize = "200% 100%";
      style.animation = "shimmer 3s infinite linear";
      style.borderColor = "#f7dc6f";
    }

    if (gameStatus === STATUS.PLAYING && movesInCurrentTurn === 1 && firstMoveCoords) {
      if (isAdjacent(firstMoveCoords[0], firstMoveCoords[1], r, c) && cellValue === null) {
        style.backgroundColor = COLORS.disabled;
        style.cursor = "not-allowed";
      }
    }

    return { style, markStyle };
  };

  const currentMode = isHermitMode ? "DUO_HERMIT" : "DUO";

  return (
    <div style={COMMON_STYLES.container}>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>

      {showInGameRules && <RuleModal mode={currentMode} onClose={() => setShowInGameRules(false)} />}

      <div
        style={{
          ...styles.gameCard,
          border: isHermitMode ? `4px solid ${COLORS.hermitAccent}` : `1px solid ${COLORS.border}`,
          backgroundColor: isHermitMode ? COLORS.hermitBg : "#fff",
        }}
      >
        <div style={styles.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* タイトルロゴエリア */}
            <div style={{ textAlign: "left" }}>
              <h1
                style={{
                  ...styles.title,
                  color: isHermitMode ? COLORS.hermitText : COLORS.text,
                  fontSize: "24px", // 少し大きく
                  marginBottom: "0",
                  lineHeight: "1.2", // ルビのために高さを確保
                }}
              >
                <ruby style={{ marginRight: "4px" }}>
                  究極
                  <rp>（</rp>
                  <rt style={{ fontSize: "10px", opacity: 0.8 }}>アルティメット</rt>
                  <rp>）</rp>
                </ruby>
                ○×ゲーム
              </h1>
              {/* サブタイトル（モード名） */}
              <span
                style={{
                  fontSize: "20px",
                  color: isHermitMode ? "#ccc" : "#666",
                  display: "block",
                  marginTop: "2px",
                }}
              >
                {isHermitMode ? "二人で遊ぶ　~仙人モード" : "二人で遊ぶ"}
              </span>
            </div>

            <button onClick={onBackToHome} style={styles.homeBtn}>
              ⌂ 戻る
            </button>
          </div>

          <div style={styles.infoRow}>
            <div style={{ ...styles.playerBadge, backgroundColor: COLORS.p1, opacity: currentPlayer === PLAYERS.FIRST ? 1 : 0.4 }}>
              先 (○) <span style={styles.score}>{lockedSets.filter((s) => s.player === PLAYERS.FIRST).length}</span>
            </div>
            <div style={{ ...styles.turnIndicator, color: isHermitMode ? "#ccc" : "#7f8c8d" }}>{turnCount} 手目</div>
            <div style={{ ...styles.playerBadge, backgroundColor: COLORS.p2, opacity: currentPlayer === PLAYERS.SECOND ? 1 : 0.4 }}>
              後 (×) <span style={styles.score}>{lockedSets.filter((s) => s.player === PLAYERS.SECOND).length}</span>
            </div>
          </div>
          <div style={styles.subInfo}>
            {gameStatus === STATUS.WIN ? (
              <span style={{ color: "#27ae60", fontWeight: "bold", fontSize: "20px" }}>{winner} 勝利！</span>
            ) : gameStatus === STATUS.SELECTING ? (
              <span style={{ color: COLORS.selected, fontWeight: "bold" }}>確定中...</span>
            ) : (
              <span style={{ color: isHermitMode ? "#ccc" : COLORS.text }}>残り手: {turnCount === 1 ? 1 : 2 - movesInCurrentTurn}</span>
            )}
          </div>
        </div>

        <div style={styles.boardWrapper}>
          <div style={styles.board}>
            {board.map((row, r) => (
              <div key={r} style={styles.row}>
                {row.map((cell, c) => {
                  const { style, markStyle } = getCellStyles(r, c, cell);
                  const isDisabled = style.cursor === "not-allowed";
                  return (
                    <div key={`${r},${c}`} style={style} onClick={() => !isDisabled && handleCellClick(r, c)}>
                      <span style={markStyle}>{cell}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.controls}>
          {gameStatus === STATUS.SELECTING ? (
            <div style={styles.selectionUI}>
              <div style={styles.selectionMsg}>{candidates.length > 1 ? `選択せよ (${selectedCandidateIndex + 1}/${candidates.length})` : "確定中..."}</div>
              {candidates.length > 1 && (
                <div style={styles.selectionButtons}>
                  {candidates.map((_, idx) => (
                    <button
                      key={idx}
                      style={{
                        ...styles.optionBtn,
                        backgroundColor: idx === selectedCandidateIndex ? COLORS.selected : "#ddd",
                        color: idx === selectedCandidateIndex ? "#fff" : "#333",
                      }}
                      onClick={() => setSelectedCandidateIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
              <button style={styles.confirmBtn} onClick={handleConfirmClick}>
                {candidates.length > 1 ? "此れで確定" : "確定"}
              </button>
            </div>
          ) : (
            <div style={styles.bottomButtons}>
              <button onClick={handleUndo} disabled={history.length === 0} style={{ ...styles.undoButton, opacity: history.length === 0 ? 0.5 : 1, flex: 1 }}>
                ↺ 待った
              </button>
              <button onClick={() => setShowInGameRules(true)} style={{ ...styles.ruleBtn, flex: 1 }}>
                ? ルール
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  gameCard: {
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "420px",
    padding: "15px 10px",
    position: "relative",
  },
  header: { width: "100%", textAlign: "center", marginBottom: "10px" },
  title: { fontSize: "20px", margin: "0", fontWeight: "bold" },
  homeBtn: {
    padding: "5px 12px",
    fontSize: "12px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px", marginTop: "10px" },
  playerBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
    minWidth: "60px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  score: {
    display: "inline-block",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    lineHeight: "18px",
    fontSize: "11px",
    marginLeft: "4px",
  },
  turnIndicator: { fontSize: "16px", fontWeight: "bold" },
  subInfo: { marginTop: "5px", fontSize: "14px", height: "20px" },
  boardWrapper: { width: "100%", aspectRatio: "1 / 1", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" },
  board: { display: "flex", flexDirection: "column", border: `2px solid ${COLORS.text}`, backgroundColor: "#fff", width: "100%", height: "100%" },
  row: { display: "flex", flex: 1 },
  cell: {
    flex: 1,
    // バグ回避のためのロングハンドプロパティ
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    touchAction: "manipulation",
  },
  mark: { fontSize: "min(5vw, 24px)", lineHeight: "1", fontWeight: "bold", zIndex: 2, pointerEvents: "none", fontFamily: "sans-serif" },
  controls: { width: "100%", minHeight: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  selectionUI: { width: "100%", backgroundColor: "#fff", borderRadius: "8px", padding: "10px", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)", textAlign: "center" },
  selectionMsg: { fontSize: "14px", marginBottom: "10px", fontWeight: "bold", color: COLORS.selected },
  selectionButtons: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" },
  optionBtn: { width: "40px", height: "40px", borderRadius: "50%", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
  confirmBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: COLORS.selected,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  bottomButtons: { display: "flex", gap: "10px", width: "100%" },
  undoButton: {
    padding: "12px",
    fontSize: "14px",
    backgroundColor: "#555",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  ruleBtn: {
    padding: "12px",
    fontSize: "14px",
    backgroundColor: COLORS.text,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

export default GameScreen;
