import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Play, PlayNew } from "./play";

const App: React.FC = () => {
  return (
    <div className="App">
      <nav>
        <Link to="/play/new">Play New Game</Link>&nbsp;|&nbsp;
        <Link to="/instructions">Instructions</Link>
      </nav>
      <h1>Guess the Word!</h1>
      <Routes>
        <Route path="/" element={<Navigate replace to="/play/new" />} />
        <Route path="instructions" element={<Instructions />} />
        <Route path="play/new" element={<PlayNew />} />
        <Route path="play/:wordBankId/:answerId" element={<Play />} />
      </Routes>
    </div>
  );
};

const Instructions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      Guess the 5-letter word! <br />
      Press Enter/Return to submit guess. After each guess:
      <ul>
        <li>Green means the letter is in the word, and in the right spot</li>
        <li>Yellow means the letter is in the word, but not in that spot</li>
        <li>No color means the letter is not in the word</li>
      </ul>
      <button onClick={() => navigate(-1)}>Back to game</button>
    </div>
  );
};

export default App;
