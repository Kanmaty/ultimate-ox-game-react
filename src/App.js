import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import RuleModal from './components/RuleModal';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [isHermitMode, setIsHermitMode] = useState(false);
  const [isSoloMode, setIsSoloMode] = useState(false); // 追加: ソロモード判定
  const [activeRuleMode, setActiveRuleMode] = useState(null);

  // 引数を追加 (hermitMode: 仙人か, soloMode: 1人用か)
  const handleStartGame = (hermitMode, soloMode = false) => {
    setIsHermitMode(hermitMode);
    setIsSoloMode(soloMode);
    setCurrentScreen('GAME');
  };

  return (
    <>
      {activeRuleMode && (
        <RuleModal 
          mode={activeRuleMode} 
          onClose={() => setActiveRuleMode(null)} 
        />
      )}

      {currentScreen === 'HOME' ? (
        <HomeScreen 
          onStartGame={handleStartGame} 
          onShowRules={(mode) => setActiveRuleMode(mode)} 
        />
      ) : (
        <GameScreen 
          isHermitMode={isHermitMode} 
          isSoloMode={isSoloMode} 
          onBackToHome={() => setCurrentScreen('HOME')} 
        />
      )}
    </>
  );
};

export default App;