import { useNavigate } from "react-router-dom";
import { Observable, useObservable } from "./observable";

export const $allowNonWordGuesses = new Observable(false);

export const Settings: React.FC = () => {
  const navigate = useNavigate();

  const [allowNonWordGuesses, setAllowNonWordGuesses] =
    useObservable($allowNonWordGuesses);

  return (
    <div>
      <h2>Game Settings</h2>
      <Checkbox
        label="Allow non-word guesses"
        checked={allowNonWordGuesses}
        onChange={setAllowNonWordGuesses}
      />
      <button onClick={() => navigate(-1)}>Back to game</button>
    </div>
  );
};

const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => {
  const toggle = () => onChange(!checked);
  return (
    <div>
      <label onClick={toggle}>{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
};
