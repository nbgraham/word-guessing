import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Instructions } from "./Instructions";
import { Play, PlayNew } from "./Play";
import { Settings } from "./Settings";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Guess the Word!</h1>
      <nav>
        <Link to="/play/new">Play New Game</Link> |&nbsp;
        <Link to="/instructions">Instructions</Link> |&nbsp;
        <Link to="/settings">Settings</Link>
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


export default App;
