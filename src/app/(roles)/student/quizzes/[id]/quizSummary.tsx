"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CheckCircle, XCircle, SkipForward, TrendingUp } from "lucide-react";

interface Question {
  question: string;
  status: "correct" | "missed" | "skipped";
  options: string[];
  correctAnswer: string | number;
  userAnswer?: number;
}

interface QuizSummaryProps {
  score: number;
  correctCount: number;
  missedCount: number;
  skippedCount: number;
  questionsReview: Question[];
}

const COLORS = ['#10B981', '#EF4444', "#D1D5DB"]; // Green, Red, Gray

const QuizSummary: React.FC<QuizSummaryProps> = ({
  score,
  correctCount,
  missedCount,
  skippedCount,
  questionsReview,
}) => {

  const performanceData = [
    { name: "Correct", value: correctCount },
    { name: "Missed", value: missedCount },
    { name: "Skipped", value: skippedCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-6 "
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Correct",
            value: correctCount,
            color: "bg-green-500/20",
            icon: <CheckCircle className="text-green-400" />,
          },
          {
            label: "Missed",
            value: missedCount,
            color: "bg-red-500/20",
            icon: <XCircle className="text-red-400" />,
          },
          {
            label: "Skipped",
            value: skippedCount,
            color: "bg-gray-500/20",
            icon: <SkipForward className="text-gray-400" />,
          },
          {
            label: "Improvement",
            value: `${score.toFixed(2)}%`,
            color: score > 0 ? "bg-green-500/20" : "bg-red-500/20",
            icon: <TrendingUp className={score > 0 ? "text-green-400" : "text-red-400"} />,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`glass-card p-4 flex items-center gap-4 ${stat.color}`}
          >
            {stat.icon}
            <div>
              <h3 className="text-sm text-gray-400">{stat.label}</h3>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl shadow-md"
      >
        <h3 className="text-white text-lg font-semibold mb-6">
          Performance Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {performanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Questions Review Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl shadow-md"
      >
        <h3 className="text-white text-lg font-semibold mb-6">
          Questions Review ({questionsReview.length})
        </h3>
        {questionsReview.length > 0 ? (
          <div className="space-y-6">
            {questionsReview.map((question, idx) => {
              const [isExpanded, setIsExpanded] = useState(false);
              const contentRef = useRef<HTMLDivElement>(null);

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-lg ${
                    question.status === "correct"
                      ? "bg-green-400/20 text-green-200"
                      : question.status === "missed"
                      ? "bg-red-400/20 text-red-200"
                      : "bg-gray-400/20 text-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-md">
                      {idx + 1}. {question.question}
                    </p>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-sm font-medium underline text-blue-400"
                    >
                      {isExpanded ? "Hide Options" : "Show Options"}
                    </button>
                  </div>

                  <div
                    ref={contentRef}
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isExpanded
                        ? `${contentRef.current?.scrollHeight}px`
                        : "0px",
                    }}
                  >
                    <ul className="mt-6 text-md space-y-2">
                      {question.options.map((option, optIdx) => (
                        <li
                          key={optIdx}
                          className={`p-2 rounded border ${
                            optIdx === question.correctAnswer
                              ? "bg-green-500/60 text-green-200 border-green-500"
                              : optIdx === question.userAnswer
                              ? "bg-red-500/60 text-red-200 border-red-500"
                              : "text-gray-200 border-gray-400"
                          }`}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No review available.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuizSummary;
