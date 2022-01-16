import { useNavigate } from "react-router-dom";

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

export default Instructions;