'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Brain } from 'lucide-react';

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden"
    >
      <div className="absolute inset-0 pattern-dots pattern-blue-500 pattern-bg-white pattern-size-4 pattern-opacity-10" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex flex-col items-center text-center p-8"
      >
        <div className="flex gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg"
          >
            <BookOpen size={32} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg"
          >
            <GraduationCap size={32} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-purple-600 text-white rounded-lg flex items-center justify-center shadow-lg"
          >
            <Brain size={32} />
          </motion.div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Interactive Learning Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-md">
          Engage with our dynamic educational content designed to help you excel
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Hero;