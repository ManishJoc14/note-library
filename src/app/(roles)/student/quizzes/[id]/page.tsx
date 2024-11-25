"use client";

import React, { useState, useEffect } from "react";
import { Quiz } from "../../../../../types";
import { Clock } from "lucide-react";
import { fetchQuizById } from "../../../../../lib/supabase"; 
import { useParams } from "next/navigation";

const QuizPlayer: React.FC = () => {
  const params = useParams();
  const { id } = params as { id: string };

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQuizById(id);
        if (data) {
          setQuiz(data);
          setTimeLeft(data.duration * 60); // Initialize timer here
        } else {
          setError("Quiz not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch quiz.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchQuiz();
  }, [id]);
  

  useEffect(() => {
    // Start the timer only if the quiz is not completed and time is remaining
    if (timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // When time is up, trigger completion
            clearInterval(timer);
            handleComplete();
            return 0; // Ensure time doesn't go negative
          }
          return prev - 1;
        });
      }, 1000);
  
      // Clear timer on cleanup
      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted]);
  

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      const score = calculateScore();
      console.log("Quiz Completed. Your Score:", score);
    }
  };
  

  const calculateScore = () => {
    let correct = 0;
    if (quiz) {
      selectedAnswers.forEach((answer, index) => {
        if (answer === quiz.questions[index].correctAnswer) {
          correct++;
        }
      });
      return (correct / quiz.questions.length) * 100;
    }
    return 0;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Loading and error states
  if (isLoading) {
    return <div className="text-white">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!quiz || quiz.questions.length === 0) {
    return <div className="text-white">No quiz available for this ID.</div>;
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{quiz.title}</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
            {quiz.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-medium mb-4">{question.text}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border transition ${
                selectedAnswers[currentQuestion] === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleComplete}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Complete Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
