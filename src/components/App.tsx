import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { routes } from "../routes";
import { Instructions } from "./Instructions";
import { Play, PlayNew } from "./Play";
import { Settings } from "./Settings";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Guess the Word!</h1>
      <nav>
        <Link to={routes.playNew}>Play New Game</Link> |&nbsp;
        <Link to={routes.instructions}>Instructions</Link> |&nbsp;
        <Link to={routes.settings}>Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate replace to={routes.playNew} />} />
        <Route path={routes.instructions} element={<Instructions />} />
        <Route path={routes.settings} element={<Settings />} />
        <Route path={routes.playNew} element={<PlayNew />} />
        <Route path={routes.play} element={<Play />} />
      </Routes>
    </div>
  );
};

export default App;
