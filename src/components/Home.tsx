import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../routes'
import { useAppSelector, useAppDispatch } from '../store'
import { pickNewAnswer } from '../store/gameSlice'
import { WordBank } from '../utilities/word-service'
import Spinner from './Spinner'

const Home: React.FC<{ wordBank: WordBank }> = ({ wordBank }) => {
  return (
    <div>
      Guess the 5-letter word! <br />
      Press Enter/Return to submit guess. After each guess:
      <ul>
        <li>Green means the letter is in the word, and in the right spot</li>
        <li>Yellow means the letter is in the word, but not in that spot</li>
        <li>No color means the letter is not in the word</li>
      </ul>
      <NewGame wordBank={wordBank} />
    </div>
  )
}

const NewGame: React.FC<{ wordBank: WordBank }> = ({ wordBank }) => {
  const newAnswerInfo = useAppSelector((state) => state.game.newAnswerInfo)
  const mustBeValidWord = useAppSelector(
    (state) => state.settings.guessesMustBeValidWords
  )

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(pickNewAnswer({ wordBank, mustBeValidWord }))
  }, [dispatch, wordBank, mustBeValidWord])

  if (newAnswerInfo.state === 'loading') {
    return (
      <div>
        Loading Game <Spinner size={15} />
      </div>
    )
  }
  if (newAnswerInfo.state === 'done' && newAnswerInfo.value) {
    return (
      <Link to={routes.playInstance(newAnswerInfo.value)}>Start New Game</Link>
    )
  }
  return <div>Error Loading Game</div>
}

export default Home
