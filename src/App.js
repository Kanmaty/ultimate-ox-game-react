// src/App.js
import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import RuleModal from './components/RuleModal';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [isHermitMode, setIsHermitMode] = useState(false);
  const [activeRuleMode, setActiveRuleMode] = useState(null);

  const handleStartGame = (hermitMode) => {
    setIsHermitMode(hermitMode);
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
          onBackToHome={() => setCurrentScreen('HOME')} 
        />
      )}
    </>
  );
};

export default App;