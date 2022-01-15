import { useNavigate } from "react-router-dom";
import { Observable, useObservable } from "../utilities/observable";

export const $allowNonWordGuesses = new Observable(false);
export const $offlineMode = new Observable(!navigator.onLine);

export const Settings: React.FC = () => {
  const navigate = useNavigate();

  const [allowNonWordGuesses, setAllowNonWordGuesses] =
    useObservable($allowNonWordGuesses);
  const [offlineMode, setofflineMode] = useObservable($offlineMode);

  return (
    <div>
      <h2>Game Settings</h2>
      <Checkbox
        label="Play offline"
        checked={offlineMode}
        onChange={setofflineMode}
      />
      <Checkbox
        label="Allow non-word guesses"
        disabled={offlineMode}
        checked={offlineMode || allowNonWordGuesses}
        onChange={setAllowNonWordGuesses}
      />
      <button onClick={() => navigate(-1)}>Back to game</button>
    </div>
  );
};

const Checkbox: React.FC<{
  disabled?: boolean;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange, disabled }) => {
  const toggle = () => onChange(!checked);
  return (
    <div
      style={
        disabled ? { opacity: 0.5, textDecoration: "line-through" } : undefined
      }
    >
      <label onClick={toggle}>{label}</label>
      <input
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
};
