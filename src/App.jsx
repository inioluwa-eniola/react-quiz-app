import { useState } from "react"
// import { useEffect } from "react"
import he from "he"
import "./App.css"

export default function App () {
  const [startQuiz, setStartQuiz] = useState(false)
  const [answerArray, setAnswerArray] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [displayAnswersWithFeedback, setDisplayAnswerWithFeedback] = useState(false)


    function handleGameStart() {
      setStartQuiz(true)
    }

   
    function getTriviaQuestion() {
      fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
        .then(response => response.json())
        .then(data => {
          data.results.forEach(questionObj => {
            // console.log("Question:")
            // console.log(he.decode(questionObj.question))
            // console.log("Correct answer:")
            // console.log(questionObj.correct_answer)
            // console.log("Incorrect answers:")
            // console.log(questionObj.incorrect_answers)
            const answerObj = getAnswersObj(questionObj.correct_answer, questionObj.incorrect_answers, questionObj.question)
            // console.log(answerObj)
            setAnswerArray(prev => [...prev, answerObj])
          })
        })
    }
    
    // useEffect(() => {
    //   console.log(answerArray)
    // }, [answerArray])

    function getAnswersObj(correctAnswer, incorrectAnswer, question) {
      const randomIndex = Math.floor(Math.random() * 4)
      const rawAnswers = [...incorrectAnswer]

      rawAnswers.splice (randomIndex, 0, correctAnswer)

      return {
        question: he.decode(question),
        cleanedAnswers: rawAnswers.map(item => he.decode(item)),
        correctAnswerIndex: randomIndex
      }
    }


    function handleSelectedAnswer(questionIndex, answerIndex){
      console.log(questionIndex)
      console.log(answerIndex)

      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
      }))
    }

    function handleCheckAnswers () {

      let score = 0

      answerArray.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswerIndex){
          score += 1
        }
      })
    setCorrectAnswers(score)
    }
    const questionAndAnswer =  
      <main className="answer-container">
        {answerArray.map((item, qIndex) => <section className="question" key={qIndex}>
          <p>{item.question}</p>
          <div className="answers-section">
            {item.cleanedAnswers.map((answer, aIndex) => 
            <label 
              key={aIndex}
              className={selectedAnswers[qIndex] === aIndex ? "selected" : ""}
            ><input 
              type="radio" 
              name={`question ${qIndex + 1}`} 
              onChange={() => handleSelectedAnswer(qIndex, aIndex)} 
              checked={selectedAnswers[qIndex] === aIndex}
              disabled={displayAnswersWithFeedback}  
            ></input>{answer}
            </label>
          )}
          </div>
        </section>)}
        <button 
          className="check-answers-btn"
          onClick={() => {
            console.log("clicked")
            handleCheckAnswers()
            setDisplayAnswerWithFeedback(true)
          }}
        >Check answers</button>
      </main>
    
    const questionAndAnswerWithFeedback = 
    <main className="answer-container">
        {answerArray.map((item, qIndex) => <section className="question" key={qIndex}>
          <p>{item.question}</p>
          <div className="answers-section">
            {item.cleanedAnswers.map((answer, aIndex) => 
            <label 
              key={aIndex}
              className={selectedAnswers[qIndex] === aIndex ? aIndex === item.correctAnswerIndex ? "correct": "wrong": null}
            ><input 
              type="radio" 
              name={`question ${qIndex + 1}`} 
              ></input>{answer}
            </label>
          )}
          </div>
        </section>)}
        <div className="score-display-section">
          <p>{`You scored ${correctAnswers}/${answerArray.length} correct answers`}</p>
          <button 
            className="play-again-btn" 
            onClick={() => {
              setStartQuiz(false)
              setAnswerArray([])
              setSelectedAnswers({})
              setCorrectAnswers(0)
              setDisplayAnswerWithFeedback(false)
            }}
            >Play Again
          </button>
        </div>
      </main>

    

    return (
    startQuiz ? 
     displayAnswersWithFeedback ? (questionAndAnswerWithFeedback) : (questionAndAnswer)

    : <main className="container">
      <header>
        <h1>Quizzical</h1>
        <p>Some description if needed</p>
      </header>
      <button 
        onClick={() => {
          getTriviaQuestion()
          handleGameStart()
        }} 
        className="start-btn"
      >
          Start quiz
      </button>
        
    </main>
    

      // later another condition would be evaluated to check which page would be rendered - 
      // the questions page or the questions page after the questions have been


    // Map through the cleanedAnswers array in the ansswerObj and render the page 
  )
}