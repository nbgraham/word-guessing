import { useEffect } from "react";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import { useAppSelector, useAppDispatch } from "../store";
import { pickNewAnswer } from "../store/gameSlice";
import Spinner from "./Spinner";

const NewGame: React.FC = () => {
  const newAnswerInfo = useNewAnswerInfo();

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

function useNewAnswerInfo() {
  const newAnswerInfo = useAppSelector((state) => state.game.newAnswerInfo);
  const mustBeValidWord = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  );
  const answerServiceVersion = useAppSelector(
    (state) => state.settings.answerServiceVersion
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(pickNewAnswer({ mustBeValidWord, answerServiceVersion }));
  }, [dispatch, mustBeValidWord, answerServiceVersion]);
  return newAnswerInfo;
}

export default NewGame;
