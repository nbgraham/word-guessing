import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import Home from "./Home";
import Play from "./Play";
import Settings from "./Settings";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>Guess the Word!</h1>
      <nav>
        <Link to={routes.home}>Home</Link> |&nbsp;
        <Link to={routes.settings}>Settings</Link> |&nbsp;
        <button onClick={() => navigate(-1)}>Back</button>
      </nav>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.settings} element={<Settings />} />
        <Route path={routes.play} element={<Play />} />
      </Routes>
    </div>
  );
};

export default App;
