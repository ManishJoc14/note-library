"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";
import { useGrade } from "../../../../../context/GradeContext";
import { QuizSummaryProps } from "../../../../../types";
import { capitalizeFirstLetter } from "../../../../../lib/helperfuntions";

const CompletedQuizzes: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-gray-500 text-center mt-10">
        Loading completed quizzes...
      </div>
    );
  }
  if (!user?.quizData.length) {
    return (
      <div className="text-gray-500 text-center mt-10">
        No completed quizzes...
      </div>
    );
  }

  const quizzes: QuizSummaryProps[] = user?.quizData;

  const navigateToSummary = (id: string) => {
    router.push(`/student/quizzes/summary/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <h1 className="text-2xl font-bold text-white mb-6">Completed Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-lg cursor-pointer"
            onClick={() => navigateToSummary(quiz.id)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {capitalizeFirstLetter(quiz.title)} - {quiz.subject}{" "}
              </h2>
              <CheckCircle className="text-green-400 w-6 h-6" />
            </div>
            <p className="text-xs text-gray-400 flex mt-1">
              <Calendar className="h-4 w-4" /> &nbsp;
              {new Date(quiz.completedAt).toDateString()}
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-white font-bold text-lg">
                Score: <span className="text-green-400">{quiz.score}%</span>
              </div>
              <ChevronRight className="text-gray-300 w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CompletedQuizzes;
