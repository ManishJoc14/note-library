'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  name: string;
  icon: string;
  path: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ name, icon, path }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-3xl mb-4 block filter drop-shadow-lg">{icon}</span>
          <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
          <p className="text-sm text-gray-300 mb-4">
            Comprehensive study materials and practice questions
          </p>
        </div>
        <ArrowRight className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300 transform group-hover:translate-x-1" />
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <span className="text-sm text-gray-400">12 Chapters</span>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-400">4 Quizzes</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
}

export default SubjectCard;