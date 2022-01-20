import { useEffect } from "react";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import { useAppSelector, useAppDispatch } from "../store";
import { fetchWordBank, pickNewAnswer } from "../store/gameSlice";
import type { WordBank } from "../utilities/word-service";
import Spinner from "./Spinner";

const NewGame: React.FC = () => {
  const wordBank = useWordBank();
  const newAnswerInfo = useNewAnswerInfo(wordBank);

  if (newAnswerInfo.state === "loading") {
    return (
      <div>
        Loading Game <Spinner size={15} />
      </div>
    );
  }
  if (newAnswerInfo.state === "done" && newAnswerInfo.value) {
    return (
      <Link to={routes.playInstance(newAnswerInfo.value)}>Start New Game</Link>
    );
  }
  return <div>Unable to load new game</div>;
};

function useNewAnswerInfo(wordBank: WordBank | undefined) {
  const newAnswerInfo = useAppSelector((state) => state.game.newAnswerInfo);
  const mustBeValidWord = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    wordBank && dispatch(pickNewAnswer({ wordBank, mustBeValidWord }));
  }, [dispatch, wordBank, mustBeValidWord]);
  return newAnswerInfo;
}

function useWordBank() {
  const wordBank = useAppSelector((state) => state.game.wordBank);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchWordBank());
  }, [dispatch]);
  return wordBank;
}

export default NewGame;
