// src/screens/HomeScreen.js
import React from "react";
import { COLORS, COMMON_STYLES } from "../constants";

const HomeScreen = ({ onStartGame, onShowRules }) => {
  return (
    <div style={COMMON_STYLES.container}>
      <div style={styles.homeCard}>
        {/* タイトルエリア */}
        <div style={styles.titleArea}>
          <div style={styles.stamp}>究極</div>
          <h1 style={styles.mainTitle}>
            {" "}
            <ruby>
              <rb>究極</rb>
              <rp>（</rp>
              <rt>アルティメット</rt>
              <rp>）</rp>
            </ruby>
            ○× ゲーム
          </h1>
          {/* <p style={styles.subTitle}>～ アルティメット・エイト ～</p> */}
        </div>

        {/* モード選択リスト */}
        <div style={styles.modeList}>
          {/* 1. 一人で遊ぶ */}
          <div style={styles.modeCard}>
            <div style={styles.modeHeader}> 一人で遊ぶ</div>
            <div style={styles.btnGroup}>
              <button style={styles.playBtn} onClick={() => alert("機巧（CPU）は開発中なり...")}>
                遊ぶ
              </button>
              <button style={styles.infoBtn} onClick={() => onShowRules("SOLO")}>
                ルール
              </button>
            </div>
          </div>

          {/* 2. 一人で遊ぶ（仙人） */}
          <div style={{ ...styles.modeCard, ...styles.hermitCard }}>
            <div style={{ ...styles.modeHeader, color: "#fff" }}>一人で遊ぶ　~仙人モード~</div>
            <div style={styles.btnGroup}>
              <button style={styles.hermitPlayBtn} onClick={() => alert("仙人は修行中なり...")}>
                挑む
              </button>
              <button style={styles.hermitInfoBtn} onClick={() => onShowRules("SOLO_HERMIT")}>
                ルール
              </button>
            </div>
          </div>

          {/* 3. 二人で遊ぶ */}
          <div style={styles.modeCard}>
            <div style={styles.modeHeader}>二人で遊ぶ</div>
            <div style={styles.btnGroup}>
              <button style={styles.playBtn} onClick={() => onStartGame(false)}>
                対局
              </button>
              <button style={styles.infoBtn} onClick={() => onShowRules("DUO")}>
                ルール
              </button>
            </div>
          </div>

          {/* 4. 二人で遊ぶ（仙人） */}
          <div style={{ ...styles.modeCard, ...styles.hermitCard }}>
            <div style={{ ...styles.modeHeader, color: "#fff" }}>二人で遊ぶ　~仙人モード~</div>
            <div style={styles.btnGroup}>
              <button style={styles.hermitPlayBtn} onClick={() => alert("仙人は修行中なり...")}>
                決戦
              </button>
              <button style={styles.hermitInfoBtn} onClick={() => onShowRules("DUO_HERMIT")}>
                ルール
              </button>
            </div>
          </div>
        </div>

        <div style={styles.footerText}>&copy; kota kanmachi, kazuma saiki</div>
      </div>
    </div>
  );
};

const styles = {
  homeCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "420px",
  },
  titleArea: {
    textAlign: "center",
    marginBottom: "30px",
    position: "relative",
    padding: "20px",
    borderBottom: `2px solid ${COLORS.border}`,
    width: "100%",
  },
  stamp: {
    position: "absolute",
    top: "0px",
    right: "20px",
    width: "40px",
    height: "40px",
    lineHeight: "46px",
    border: `3px solid ${COLORS.p1}`,
    borderRadius: "50%",
    color: COLORS.p1,
    fontSize: "16px",
    fontWeight: "bold",
    transform: "rotate(15deg)",
    opacity: 0.8,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  mainTitle: {
    fontSize: "42px",
    fontWeight: "900",
    margin: "0",
    color: COLORS.text,
    letterSpacing: "0.1em",
    textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
  },
  subTitle: { fontSize: "14px", color: "#666", marginTop: "10px", fontStyle: "italic" },

  modeList: { width: "100%", display: "flex", flexDirection: "column", gap: "20px" },
  modeCard: {
    backgroundColor: "#fff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "4px",
    padding: "12px 16px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hermitCard: {
    backgroundColor: COLORS.hermitBg,
    borderColor: COLORS.hermitAccent,
  },
  modeHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    borderLeft: `4px solid ${COLORS.p1}`,
    paddingLeft: "10px",
    color: COLORS.text,
  },
  btnGroup: { display: "flex", gap: "8px" },

  playBtn: {
    padding: "8px 16px",
    backgroundColor: COLORS.btnPrimary,
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  infoBtn: {
    padding: "8px 12px",
    backgroundColor: "transparent",
    color: COLORS.text,
    border: `1px solid ${COLORS.text}`,
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  hermitPlayBtn: {
    padding: "8px 16px",
    backgroundColor: COLORS.hermitAccent,
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "inherit",
  },
  hermitInfoBtn: {
    padding: "8px 12px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  footerText: { marginTop: "40px", fontSize: "12px", color: "#999", textAlign: "center" },
};

export default HomeScreen;
