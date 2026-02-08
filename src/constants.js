// src/constants.js

export const BOARD_SIZE = 8;
export const PLAYERS = { FIRST: '○', SECOND: '×' };

export const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];

// 和風カラーパレット & 共通設定
export const COLORS = {
  bg: '#fcfaf2',       // 和紙のような生成り色
  text: '#2b2b2b',     // 墨色
  boardBg: '#ffffff',
  border: '#8e8e8e',   // 鈍色
  
  // プレイヤーカラー
  p1: '#bf242a',       // 茜色（先攻）
  p2: '#1a4472',       // 藍色（後攻）
  
  // 状態カラー
  locked: '#d4af37',   // 金色（確定）
  candidate: '#7db962',// 萌黄色（候補）
  selected: '#e95295', // 撫子色（選択中）
  disabled: '#e6e6e6', 
  
  // UIカラー
  btnPrimary: '#2b2b2b',
  btnText: '#ffffff',
  modalBg: 'rgba(43, 43, 43, 0.85)',
  
  // 仙人モード
  hermitBg: '#1e2a36', // 鉄御納戸
  hermitAccent: '#b8860b', // 金色
  hermitText: '#f0f0f0',
};

// 共通のコンテナスタイル
export const COMMON_STYLES = {
  container: {
    fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    color: COLORS.text,
  }
};