"use client";

import React, { useState, useEffect } from "react";
import { Quiz, ReviewQuestion } from "../../../../../types";
import { useAuth } from "../../../../../context/AuthContext";
import { Clock } from "lucide-react";
import { fetchQuizById, saveQuizSummary } from "../../../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { decryptAnswer } from "../../../../../lib/encrypt_decrypt";
import { v4 as uuidv4 } from "uuid";

// TODO - add skeletons for all when fetching
const QuizPlayer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { id } = params as { id: string };

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQuizById(id);
        if (data) {
          setQuiz(data);
          setTimeLeft(data.duration * 60); // Duration in seconds
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

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

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
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="text-gray-500 text-center mt-10">Loading quiz...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-10">
        No quiz available for this ID.
      </div>
    );
  }

  if (isCompleted && quiz && user) {
    const correctCount = selectedAnswers.reduce((count, answer, index) => {
      const decryptedCorrectAnswer = decryptAnswer(
        quiz.questions[index].correctAnswer as string
      ); // Decrypt the correct answer
      return answer === parseInt(decryptedCorrectAnswer) ? count + 1 : count;
    }, 0);

    const skippedCount =
      quiz.questions.length -
      selectedAnswers.filter((ans) => ans !== undefined && ans !== -1).length;

    const missedCount = quiz.questions.length - correctCount - skippedCount;

    const score = (correctCount / quiz.questions.length) * 100;

    // Prepare questions review data
    const questionsReview: ReviewQuestion[] = quiz.questions.map((q, index) => {
      const userAnswer = selectedAnswers[index];
      let status: "correct" | "missed" | "skipped" = "skipped";
      const decryptedCorrectAnswer = decryptAnswer(q.correctAnswer as string); // Decrypt the correct answer

      if (userAnswer !== undefined && userAnswer !== -1) {
        if (userAnswer === parseInt(decryptedCorrectAnswer)) {
          status = "correct";
        } else {
          status = "missed";
        }
      }
      return {
        id: q.id,
        text: q.text,
        status,
        options: q.options,
        userAnswer,
        correctAnswer: parseInt(decryptedCorrectAnswer),
      };
    });

    const quizSummaryData = {
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      grade: quiz.grade,
      score,
      correctCount,
      missedCount,
      skippedCount,
      questionsReview,
      completedAt: new Date().toISOString(),
    };

    const updatedQuizData = [
      ...user.quizData?.filter((q) => q.id !== quiz.id),
      quizSummaryData,
    ];

    user.quizData = [...updatedQuizData];

    async function save() {
      if (user) {
        await saveQuizSummary(user.id, quizSummaryData);
        router.push(`/student/quizzes/summary/${quizSummaryData.id}`);
      }
    }
    save();
  }

  const question = quiz.questions[currentQuestion];

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm p-6  mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
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
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Complete Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizPlayer;
