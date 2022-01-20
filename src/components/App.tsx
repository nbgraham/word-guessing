import React, { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchWordBank } from "../store/gameSlice";
import Home from "./Home";
import Play from "./Play";
import Settings from "./Settings";
import Spinner from "./Spinner";

function useWordBank() {
  const wordBank = useAppSelector((state) => state.game.wordBank);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchWordBank());
  }, [dispatch]);
  return wordBank;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const wordBank = useWordBank();

  if (!wordBank) {
    return (
      <div>
        Loading word bank
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Guess the Word!</h1>
      <nav>
        <Link to={routes.home}>Home</Link> |&nbsp;
        <Link to={routes.settings}>Settings</Link> |&nbsp;
        <button onClick={() => navigate(-1)}>Back</button>
      </nav>
      <Routes>
        <Route path={routes.home} element={<Home wordBank={wordBank} />} />
        <Route path={routes.settings} element={<Settings />} />
        <Route path={routes.play} element={<Play />} />
      </Routes>
    </div>
  );
};

export default App;
