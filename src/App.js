import React from "react"
import Question from "./components/Question"
import { nanoid } from 'nanoid'
import he from 'he' // decoder for &#1337; or smth

export default function App() {
  // * state that starts the game
  const [start, setStart] = React.useState(false)
  
  // * state that shows the results 
  const [check, setCheck] = React.useState(false)

  // * state that contains all the neaded data
  const [quiz, setQuiz] = React.useState([])

  // * data fetching from api > calling function that sets data from api into state
  function getNewQuiz() {
    fetch("https://opentdb.com/api.php?amount=5")
      .then(res => res.json())
      .then(data => (allNewQuiz(data.results)))

    // * function that sets data from api into state 
    function allNewQuiz(apiData) {
      apiData.map(data => {
        setQuiz(prevQuiz => [
          ...prevQuiz, {
            id: nanoid(),
            question: he.decode(data.question),
            correctAnswer: he.decode(data.correct_answer),
            // * allAnswers is an array of objects containing all answers for one question and boolean data if this answer is clicked
            allAnswers: shufleArray(
              data.incorrect_answers.map(incorrectAnswer => ({
                answer: he.decode(incorrectAnswer),
                isClicked: false
              })).concat({
                answer: he.decode(data.correct_answer),
                isClicked: false
              })),
            isCorrect: false
          }
        ])
      })
    }
  }

  // * function that shufles the array (of all answers)
  function shufleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }

  // * check/reset function
  function checkAnswersOrResetQuiz() {
    if (check) {
      setQuiz([])
      setCheck(prevCheck => !prevCheck)
    } else {
      setCheck(prevCheck => !prevCheck)
    }
  }

  // * function that changes the value isClicked of clicked answer from allAnswers to clicked
  function handleAnswerClick(event) {
    const {name, value} = event.target
    setQuiz(prevQuiz => prevQuiz.map(quizElement => {
      return quizElement.id === name ? 
      {...quizElement,
        allAnswers: quizElement.allAnswers.map(answer => {
          return answer.answer === value ?
          {...answer, 
            isClicked: !answer.isClicked} :
          {...answer, isClicked: false}
        }),
        isCorrect: quizElement.correctAnswer === value ? true : false
      } :
      quizElement
    }))
  }
  
  // * rendering questions and answers into app
  const quizElements = quiz.map(quizElement => (
    <Question
      key={quizElement.id}
      data={quizElement}
      check={check}
      handleAnswerClick={handleAnswerClick}
    />
  ))

  // * app rendering happens here 
  return (
    start ?
      (quiz.length ?
        <main>
          <div className="questions">{quizElements}</div>
          <div className="main">
            {check && <h4 className="main--score">You scored {quiz.filter(quizElement => quizElement.isCorrect).length}/5 correct answers</h4>}
            <button onClick={() => {checkAnswersOrResetQuiz(); check && getNewQuiz()}} className="main--button default-button">{check ? "Play again" : "Check answers"}</button>
          </div>
        </main> :
        <main className="loading">
          <div className="spinner-box">
            <div className="pulse-container"> 
              <div className="pulse-bubble pulse-bubble-1"></div>
              <div className="pulse-bubble pulse-bubble-2"></div>
              <div className="pulse-bubble pulse-bubble-3"></div>
            </div>
          </div>
        </main>) : (
      <main className="start">
        <h1 className="start--title">Quizzical</h1>
        <h3 className="start--text">Answer 5 questions to get an opportunity to win nothing!</h3>
        <button onClick={() => {setStart(true); getNewQuiz()}} className="start--button default-button">Start quiz</button>
      </main>)
  )
}