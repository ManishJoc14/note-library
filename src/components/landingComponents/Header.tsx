'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
    <nav className="relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <GraduationCap className="text-purple-400" size={32} />
            <span className="text-2xl font-bold text-white">Note-Library</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Notes</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Quizzes</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Progress</a>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isAuthenticated ? logout : onAuthClick}
              className="btn-primary"
            >
             { isAuthenticated ? "LogOut" : "Sign In"  }
            </motion.button>
          </motion.div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Header;