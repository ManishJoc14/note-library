"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, TrendingUp, Users, Brain,
  BookOpen, Award, Clock, Target
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts';

const Dashboard = () => {
  // Mock data for charts
  const studentActivity = [
    { name: 'Week 1', active: 120, new: 45 },
    { name: 'Week 2', active: 150, new: 35 },
    { name: 'Week 3', active: 180, new: 50 },
    { name: 'Week 4', active: 220, new: 40 }
  ];

  const subjectDistribution = [
    { name: 'Mathematics', value: 30 },
    { name: 'Physics', value: 25 },
    { name: 'Chemistry', value: 20 },
    { name: 'Biology', value: 15 },
    { name: 'Computer Science', value: 10 }
  ];

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '2,543', change: '+12%', icon: Users, color: 'purple' },
          { label: 'Quiz Completion Rate', value: '78%', change: '+5%', icon: Brain, color: 'blue' },
          { label: 'Average Score', value: '85%', change: '+3%', icon: Target, color: 'green' },
          { label: 'Study Time', value: '45h', change: '+8%', icon: Clock, color: 'yellow' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
              <stat.icon className={`text-${stat.color}-500`} size={24} />
            </div>
            <h3 className="text-gray-400 text-sm">{stat.label}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <span className={`text-${stat.color}-400 text-sm`}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-white text-lg font-semibold mb-6">Student Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentActivity}>
              <defs>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ccc",
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#activeGradient)"
                name="Active Students"
              />
              <Area
                type="monotone"
                dataKey="new"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#newGradient)"
                name="New Students"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-white text-lg font-semibold mb-6">Subject Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {subjectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-white text-lg font-semibold mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Average Quiz Score', value: '85%', icon: Brain },
            { label: 'Completion Rate', value: '92%', icon: Target },
            { label: 'Study Materials Used', value: '1,234', icon: BookOpen },
            { label: 'Active Time', value: '45h', icon: Clock }
          ].map((metric, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <metric.icon className="text-purple-500" size={20} />
                <span className="text-gray-400">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;