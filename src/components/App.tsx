import React, { useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { routes } from "../routes";
import { actions, useAppDispatch, useAppSelector } from "../store";
import { getWordBank } from "../utilities/word-service";
import Instructions from "./Instructions";
import Settings from "./Settings";
import Spinner from "./Spinner";
import { Play, PlayNew } from "./Play";

const wordBankPromise = getWordBank();
function useWordBank() {
  const wordBank = useAppSelector((state) => state.wordBank);
  const dispatch = useAppDispatch();
  useEffect(() => {
    wordBankPromise.then((_wordBank) =>
      dispatch(actions.setWordBank(_wordBank))
    );
  }, [dispatch]);
  return wordBank;
}

const App: React.FC = () => {
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
        <Link to={routes.playNew}>Play New Game</Link> |&nbsp;
        <Link to={routes.instructions}>Instructions</Link> |&nbsp;
        <Link to={routes.settings}>Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate replace to={routes.playNew} />} />
        <Route path={routes.instructions} element={<Instructions />} />
        <Route path={routes.settings} element={<Settings />} />
        <Route
          path={routes.playNew}
          element={<PlayNew wordBank={wordBank} />}
        />
        <Route path={routes.play} element={<Play wordBank={wordBank} />} />
      </Routes>
    </div>
  );
};

export default App;
