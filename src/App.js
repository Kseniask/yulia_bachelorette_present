import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  ButtonGroup
} from 'react-bootstrap'
import { Answers } from './content/answers'

function App () {
  const storageKey = 'progressedWord'
  const [word, setWord] = useState(
    localStorage.getItem(storageKey) || Answers[0].word
  ) // The word to be guessed
  const [wordData, setWordData] = useState(
    Answers.find(answer => answer.word === word)
  )
  const [guessedLetters, setGuessedLetters] = useState(
    Array(word.length).fill('')
  ) // List to store the guessed letters
  const [truthfulValue, setTruthfulValue] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const inputsRef = useRef([]) // Ref for storing the input refs

  useEffect(() => {
    localStorage.setItem(storageKey, word)
  }, [word])

  const handleGuess = (index, letter) => {
    letter = letter.toLowerCase()
    const newGuessedLetters = [...guessedLetters]
    newGuessedLetters[index] = letter
    setGuessedLetters(newGuessedLetters)

    // Move focus to the next input box
    if (letter.length === 1 && index < inputsRef.current.length - 1) {
      const reference = inputsRef.current[index + 1]
      if (reference) {
        reference.focus()
      } else {
        inputsRef.current[index + 2].focus()
      }
    }
  }

  const checkAnswer = () => {
    const answer =
      word === 'false'
        ? truthfulValue
          ? setWrongAnswer(true)
          : 'false'
        : guessedLetters.join('')

    if (truthfulValue) return

    if (answer.toLowerCase() === word.replace(' ', '').toLowerCase()) {
      const oldWord = Answers.find(answer => answer.word === word)
      const index = Answers.indexOf(oldWord)
      localStorage.setItem(storageKey, Answers[index + 1].word)
      window.location.reload()
    }
  }

  const renderWordStatus = () => {
    if (word === 'false') {
      return (
        <ButtonGroup>
          <Button
            className='yes-button'
            variant='success'
            onClick={() => setTruthfulValue(true)}
          >
            Yes
          </Button>
          <Button
            className='no-button'
            variant='warning'
            onClick={() => setTruthfulValue(false)}
          >
            No
          </Button>
        </ButtonGroup>
      )
    }
    if (word === 'end') {
      return ''
    }
    return word
      .split('')
      .map((letter, index) => (
        <Col key={index}>
          {letter !== ' ' ? (
            <input
              type='text'
              maxLength='1'
              className={`letter-input ${
                guessedLetters[index] !== letter && guessedLetters[index] !== ''
                  ? 'incorrect'
                  : ''
              }`}
              value={guessedLetters[index]}
              onChange={e => handleGuess(index, e.target.value)}
              ref={ref => (inputsRef.current[index] = ref)}
            />
          ) : (
            ' '
          )}
        </Col>
      ))
  }

  const reset = () => {
    changeWord(Answers[0].word)
  }

  const changeWord = wordToSet => {
    setWordData(Answers.find(answer => answer.word === wordToSet))
    setWord(wordToSet)
    setGuessedLetters(Array(wordToSet.length).fill(''))
  }

  return word ? (
    <Container className='mt-5'>
      <h2>{wordData.question}</h2>
      <h3 className={wrongAnswer ? 'visible-error' : 'hide-element'}>NO</h3>
      <h1 className={word === 'end' ? 'visible-emoji' : 'hide-element'}>
        &#127814;
      </h1>
      <Row className='word-cubes'>{renderWordStatus()}</Row>
      <Container className='buttons-container'>
        <Button
          className={`submit-button${word === 'end' ? ' hide-element' : ''}`}
          variant='primary'
          disabled={
            word !== 'false'
              ? guessedLetters.join('').toLowerCase() !==
                word.replace(' ', '').toLowerCase()
              : false
          }
          onClick={checkAnswer}
        >
          Submit Answer
        </Button>
        <Button
          className='restart-button'
          variant='outline-secondary'
          onClick={reset}
        >
          Restart
        </Button>
      </Container>
    </Container>
  ) : (
    <Spinner animation='border' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  )
}

export default App
