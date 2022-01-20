import React, { Reducer, useEffect, useMemo, useState, useReducer } from 'react'
import { fetchDefinition } from '../store/definitionsSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { WordStatus } from '../utilities/types'
import { WordResult } from '../utilities/word-service'

const canShare = typeof navigator.share === 'function'

function useDefinition(word: string) {
  const dispatch = useAppDispatch()
  const playOffline = useAppSelector((state) => state.settings.playOffline)
  const definition = useAppSelector((state) =>
    state.definition[word]?.state === 'done'
      ? state.definition[word]?.value
      : undefined
  )
  useEffect(() => {
    if (!playOffline) {
      dispatch(fetchDefinition(word))
    }
  }, [playOffline, word, dispatch])
  return definition
}

const Victory: React.FC<{
  guesses: WordStatus[]
  answer: string
}> = ({ guesses, answer }) => {
  const guessSummary = useMemo(
    () =>
      guesses
        .map((guess) =>
          guess
            .map((letter) => {
              if (letter.inPosition && letter.inWord) return '🟩'
              if (letter.inWord) return '🟨'
              return '⬛️'
            })
            .join('')
        )
        .join('\n'),
    [guesses]
  )
  const shareText = useMemo(
    () => `I won in ${guesses.length} guesses!\n` + guessSummary,
    [guessSummary, guesses.length]
  )

  const [copied, setCopied] = useState(false)
  const copyShareText = async () => {
    await navigator.clipboard.writeText(
      shareText + `\nTry for yourself at ${window.location.href}`
    )
    setCopied(true)
  }

  const share = () => {
    navigator.share({
      text: shareText,
      title: 'Word Guessing Game',
      url: window.location.href,
    })
  }

  const definition = useDefinition(answer)

  return (
    <div>
      <p>You won!</p>
      <pre>{guessSummary}</pre>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {canShare && <button onClick={share}>Share</button>}
        <button onClick={copyShareText}>Copy Share Text</button>
        {copied && <div>Copied!</div>}
        {definition && <Definition definition={definition} />}
      </div>
    </div>
  )
}

const Definition: React.FC<{ definition: WordResult[] }> = ({ definition }) => {
  const [show, toggle] = useReducer<Reducer<boolean, void>>(
    (state) => !state,
    false
  )

  const meanings = useMemo(() => definition[0].meanings, [definition])

  return (
    <div>
      <button onClick={toggle}>{show ? 'Hide' : 'Show'} Definition</button>
      {show && (
        <div>
          {meanings.map((meaning) => (
            <div>
              <h4>{meaning.partOfSpeech}</h4>
              <ul>
                {meaning.definitions.map((definition) => (
                  <li>{definition.definition}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Victory
