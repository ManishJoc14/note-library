"use client";

import React, { useState} from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Clock,
  Download,
  Eye,
  LayoutDashboard,
  BookText,
  Brain,
  MessageSquare,
  LogOut,
  ChevronRight,
  TrendingUp,
  Target,
} from "lucide-react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { getFileUrl } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

const Dashboard = () => {

    const [selectedSubject, setSelectedSubject] = useState('');
    const [notes, setNotes] = useState<any[]>([]);
    // const { user : userData }  = useAuth();
  
    // Dashboard stats
    const stats = [
      { 
        label: 'Completed Quizzes',
        value: 0,
        icon: Brain,
        color: 'text-purple-500 bg-purple-500/10'
      },
      { 
        label: 'Average Score',
        value: '85%',
        icon: Target,
        color: 'text-blue-500 bg-blue-500/10'
      },
      { 
        label: 'Study Hours',
        value: '24h',
        icon: Clock,
        color: 'text-green-500 bg-green-500/10'
      },
      { 
        label: 'Achievement Points',
        value: '1,250',
        icon: Award,
        color: 'text-yellow-500 bg-yellow-500/10'
      }
    ];
  
    // Recent activities
    const activities = [
      { type: 'quiz', title: 'Completed Physics Quiz', score: 90, date: '2h ago' },
      { type: 'note', title: 'Downloaded Chemistry Notes', date: '5h ago' },
      { type: 'achievement', title: 'Earned "Quick Learner" Badge', date: '1d ago' },
    ];
  
    // Upcoming quizzes
    const upcomingQuizzes = [
      { subject: 'Mathematics', topic: 'Calculus', date: 'Tomorrow, 10:00 AM' },
      { subject: 'Physics', topic: 'Mechanics', date: 'In 2 days' },
    ];
    
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div
              className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}
            >
              <stat.icon size={24} />
            </div>
            <h3 className="text-gray-400 text-sm">{stat.label}</h3>
            <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-white text-lg font-semibold mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === "quiz"
                        ? "bg-purple-500/20 text-purple-500"
                        : activity.type === "note"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {activity.type === "quiz" ? (
                      <Brain size={20} />
                    ) : activity.type === "note" ? (
                      <BookText size={20} />
                    ) : (
                      <Award size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">{activity.date}</p>
                  </div>
                </div>
                {activity.score && (
                  <span className="text-green-400 font-semibold">
                    {activity.score}%
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="glass-card p-6">
          <h3 className="text-white text-lg font-semibold mb-4">
            Upcoming Quizzes
          </h3>
          <div className="space-y-4">
            {upcomingQuizzes.map((quiz, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-medium">{quiz.subject}</h4>
                    <p className="text-gray-400 text-sm">{quiz.topic}</p>
                  </div>
                  <span className="text-purple-400 text-sm">{quiz.date}</span>
                </div>
                <button className="btn-primary !py-2 w-full mt-3">
                  Prepare Now
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
