import settingsSlice from '../store/settingsSlice'
import { useAppDispatch, useAppSelector } from '../store'

const Settings: React.FC = () => {
  const dispatch = useAppDispatch()

  const settings = useAppSelector((state) => state.settings)
  const { guessesMustBeValidWords, playOffline } = settings

  return (
    <div>
      <h2>Game Settings</h2>
      <Checkbox
        label="Play offline"
        checked={playOffline}
        onChange={(checked) =>
          dispatch(settingsSlice.actions.setPlayOffline(checked))
        }
      />
      <Checkbox
        label="Allow non-word guesses (Don't validate guesses)"
        disabled={playOffline}
        checked={!guessesMustBeValidWords}
        onChange={(checked) =>
          dispatch(settingsSlice.actions.setGuessesMustBeValidWords(!checked))
        }
      />
    </div>
  )
}

const Checkbox: React.FC<{
  disabled?: boolean
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ label, checked, onChange, disabled }) => {
  const toggle = () => onChange(!checked)
  return (
    <div
      style={
        disabled ? { opacity: 0.5, textDecoration: 'line-through' } : undefined
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
  )
}

export default Settings
