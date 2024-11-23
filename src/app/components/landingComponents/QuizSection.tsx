'use client';

import React from 'react';
import { Brain, Clock, Users, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizSectionProps {
  grade: 11 | 12;
}

const QuizSection: React.FC<QuizSectionProps> = ({ grade }) => {
  const quizzes = [
    {
      title: `Grade ${grade} Mathematics Quiz`,
      questions: 20,
      duration: '30 mins',
      difficulty: 'Medium',
      participants: 1234,
      avgScore: 85,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: `Grade ${grade} Physics Quiz`,
      questions: 15,
      duration: '25 mins',
      difficulty: 'Hard',
      participants: 987,
      avgScore: 78,
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: `Grade ${grade} Chemistry Quiz`,
      questions: 25,
      duration: '35 mins',
      difficulty: 'Easy',
      participants: 1567,
      avgScore: 92,
      image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-purple-900/50 to-slate-900/50" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Quizzes</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Challenge yourself with our interactive quizzes and track your progress
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={index}
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
                  <h3 className="text-white font-semibold text-lg">{quiz.title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Brain size={18} className="text-purple-400" />
                    <span>{quiz.questions} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={18} className="text-purple-400" />
                    <span>{quiz.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users size={18} className="text-purple-400" />
                    <span>{quiz.participants.toLocaleString()} Taken</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Trophy size={18} className="text-purple-400" />
                    <span>{quiz.avgScore}% Avg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    quiz.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                    quiz.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {quiz.difficulty}
                  </span>
                  <button className="btn-primary !py-2 !px-4 group-hover:scale-105">
                    <span>Start Quiz</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-secondary group">
            <span>View All Quizzes</span>
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default QuizSection;