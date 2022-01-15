import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Play, PlayNew } from "./play";
import { Settings } from "./settings";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>Guess the Word!</h1>
      <nav>
        <Link to="/play/new">Play New Game</Link> |&nbsp;
        <Link to="/instructions">Instructions</Link> |&nbsp;
        <Link to="/settings">Settings</Link> |&nbsp;
        <button onClick={() => navigate(-1)}>Back to game</button>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate replace to="/play/new" />} />
        <Route path="instructions" element={<Instructions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="play/new" element={<PlayNew />} />
        <Route path="play/:wordBankId/:answerId" element={<Play />} />
      </Routes>
    </div>
  );
};

const Instructions: React.FC = () => {
  return (
    <div>
      Guess the 5-letter word! <br />
      Press Enter/Return to submit guess. After each guess:
      <ul>
        <li>Green means the letter is in the word, and in the right spot</li>
        <li>Yellow means the letter is in the word, but not in that spot</li>
        <li>No color means the letter is not in the word</li>
      </ul>
    </div>
  );
};

export default App;
