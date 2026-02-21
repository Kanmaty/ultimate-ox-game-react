// src/components/RuleModal.js
import React from "react";
import { COLORS } from "../constants";

const RuleModal = ({ mode, onClose }) => {
  const getRuleContent = (modeType) => {
    const commonRules = (
      <>
        <li>盤面は八×八、先手(○)後手(×)にて争う</li>
        <li>一手につき二石を打つ（先手初手のみ一石）</li>
        {/* <li>同時完成せば、連鎖して確定す</li> */}
      </>
    );

    switch (modeType) {
      case "SOLO":
        return {
          title: "一人打ち",
          desc: "CPUを相手に腕を磨くべし。",
          rules: (
            <>
              {commonRules}
              <li>
                縦横斜め、四つ並びを<strong>三組</strong>揃えし者が勝者なり
              </li>
              <li>
                三組の内、重なり（共有）は<strong>一箇所</strong>のみ許される
              </li>
              <li>隣り合う場所（八方）には打てぬ</li>
            </>
          ),
          note: "",
        };
      case "SOLO_HERMIT":
        return {
          title: "一人打ち ~仙人モード~",
          desc: "己の勝利を捨て、盤面を完全に御すべし。",
          rules: (
            <>
              {commonRules}
              <li style={{ color: "#e74c3c", fontWeight: "bold" }}>【仙人掟】自らが三組揃えてしまえば「敗北」となる。</li>
              <li style={{ color: "#27ae60", fontWeight: "bold" }}>【仙人掟】CPUに三組揃えさせるか、引き分けに持ち込めば「勝利」なり。</li>
              <li style={{ color: "#e74c3c", fontWeight: "bold" }}>【仙人掟】自らの番は三秒以内に打ち切るべし。過ぎれば即敗北。</li>
              <li style={{ color: "#e74c3c", fontWeight: "bold" }}>【仙人掟】禁手（隣接マス）に打てば即座に反則負け。</li>
            </>
          ),
          note: "※CPUはランダムに石を配置してくる。",
        };
      case "DUO":
        return {
          title: "二人打ち",
          desc: "一端末を囲み、友と知略を競うべし。",
          rules: (
            <>
              {commonRules}
              <li>
                縦横斜め、四つ並びを<strong>三組</strong>揃えし者が勝者なり
              </li>
              <li>
                三組の内、重なり（共有）は<strong>一箇所</strong>のみ許される
              </li>
              <li>隣り合う場所（八方）には打てぬ</li>
            </>
          ),
          note: "",
        };
      case "DUO_HERMIT":
        return {
          title: "二人打ち ~仙人モード~",
          desc: "一歩も引けぬ真剣勝負。思考の猶予は十秒のみ。",
          rules: (
            <>
              {commonRules}
              <li>
                縦横斜め、四つ並びを<strong>三組</strong>揃えし者が勝者なり
              </li>
              <li>
                三組の内、重なり（共有）は<strong>一箇所</strong>のみ許される
              </li>
              <li style={{ color: "#e74c3c", fontWeight: "bold" }}>【仙人掟】自らの番は十秒以内に打ち切るべし。過ぎれば即敗北。</li>
              <li style={{ color: "#e74c3c", fontWeight: "bold" }}>【仙人掟】禁手（隣接マス）にも打てるが、打てば即座に反則負けとなる。</li>
            </>
          ),
          note: "",
        };
      default:
        return { title: "", desc: "", rules: null };
    }
  };

  const content = getRuleContent(mode);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalInnerBorder}>
          <h2 style={styles.modalTitle}>❖ {content.title} ❖</h2>
          <p style={styles.modalDesc}>{content.desc}</p>
          <div style={styles.separator}></div>
          <ul style={styles.ruleList}>{content.rules}</ul>
          {content.note && <p style={styles.modalNote}>{content.note}</p>}
          <button style={styles.closeBtn} onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.modalBg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "5px",
    borderRadius: "4px",
    width: "90%",
    maxWidth: "400px",
  },
  modalInnerBorder: {
    border: `2px solid ${COLORS.text}`,
    padding: "20px",
    borderRadius: "2px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "20px",
    margin: "0 0 10px 0",
    borderBottom: `1px solid ${COLORS.p1}`,
    display: "inline-block",
    paddingBottom: "5px",
    color: COLORS.text,
  },
  modalDesc: { fontSize: "14px", color: "#555", marginBottom: "15px" },
  separator: { width: "100%", height: "1px", backgroundColor: "#ddd", marginBottom: "15px" },
  ruleList: { textAlign: "left", paddingLeft: "20px", fontSize: "13px", lineHeight: "1.8", color: "#333" },
  modalNote: { fontSize: "12px", color: COLORS.p1, marginTop: "10px" },
  closeBtn: {
    marginTop: "20px",
    padding: "8px 24px",
    backgroundColor: COLORS.text,
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    width: "100%",
  },
};

export default RuleModal;
