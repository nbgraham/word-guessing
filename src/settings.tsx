import { Observable, useObservable } from "./observable";

export const $allowNonWordGuesses = new Observable(false);

export const Settings: React.FC = () => {
  const [allowNonWordGuesses, setAllowNonWordGuesses] =
    useObservable($allowNonWordGuesses);

  const wordBankId = 0;
  const answerId = 0;

  return (
    <div>
      <h2>Game Settings</h2>
      <div>
        Current Game ID {wordBankId}:{answerId}
      </div>
      <Checkbox
        label="Allow non-word guesses"
        checked={allowNonWordGuesses}
        onChange={setAllowNonWordGuesses}
      />
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
