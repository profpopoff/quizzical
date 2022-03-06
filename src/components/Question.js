import React from "react"

export default function Question(props) {

   // * function that sets color to radio buttons
   function getColor(answer) {
      if (props.check) {
         if (answer.answer === props.data.correctAnswer) {
            return " correct"
         } else if (answer.isClicked && answer.answer !== props.data.correctAnswer) {
            return " wrong"
         } else {return " not-chosen"}
      } else if (answer.isClicked) {
         return " chosen"
      } else {return ""}
   }

   // * rendering radio buttons into Question
   const answerButtons = props.data.allAnswers.map((answer, index) => (
      <label 
         key={index}
         className={"answer" + getColor(answer)}
      >
         <input 
            type="radio"
            id={(answer.answer)}
            name={props.data.id}
            value={(answer.answer)}
            onClick={props.handleAnswerClick}
            className="answer--input"
         />
         {(answer.answer)}
      </label>
   ))

   // * rendering the Question
   return (
      <div className="question">
         <h2 className="question--text">{props.data.question}</h2>
         <div className="question__answers">{answerButtons}</div>
      </div>
   )
}