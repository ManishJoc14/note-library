"use client";

import React, { useEffect, useState } from "react";
import { Brain, Clock, Users, Trophy, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useGrade } from "../../context/GradeContext";
import { usePathname } from "next/navigation";
import { fetchAllQuiz } from "../../lib/supabase";
import Link from "next/link"; 

const QuizSection = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { grade, setGrade } = useGrade();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const fetchedQuizzes = await fetchAllQuiz(grade);
        setQuizzes(fetchedQuizzes || []);
      } catch (err: any) {
        console.error("Failed to fetch quizzes:", err.message);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (grade) loadQuizzes();
  }, [grade]);

  return (
    <section
      className={`${isHomePage ? "py-20" : ""} relative overflow-hidden`}
    >
      {isHomePage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-purple-900/50 to-slate-900/50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </>
      )}

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Quizzes
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Challenge yourself with our interactive quizzes and track your
            progress
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => setGrade("11")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                grade === "11"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Grade 11
            </button>
            <button
              onClick={() => setGrade("12")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                grade === "12"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Grade 12
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-300">Loading quizzes...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : quizzes.length === 0 ? (
          <div className="text-center text-gray-300">
            No quizzes available for this grade.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-card group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="relative h-48 rounded-t-2xl overflow-hidden">
                  <img
                    src={quiz.image}
                    alt={quiz.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">
                      {quiz.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Brain size={18} className="text-purple-400" />
                      <span>{quiz.questions.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock size={18} className="text-purple-400" />
                      <span>{quiz.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users size={18} className="text-purple-400" />
                      <span>{quiz.participants.toLocaleString()} Taken</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Trophy size={18} className="text-purple-400" />
                      <span>{quiz.avg_score}% Avg</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        quiz.difficulty === "Easy"
                          ? "bg-green-400/20 text-green-400"
                          : quiz.difficulty === "Medium"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-red-400/20 text-red-400"
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                    <Link href={`/student/quizzes/${quiz.id}`} passHref>
                    <button className="btn-primary !py-2 !px-4 group-hover:scale-105">
                      <span>Start Quiz</span>
                      <ArrowRight
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                        </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-secondary group">
            <span>View All Quizzes</span>
            <ArrowRight
              size={20}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizSection;
