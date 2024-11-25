'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, TrendingUp } from 'lucide-react';

const goals = [
  {
    icon: Target,
    title: 'Academic Excellence',
    description: 'Achieve top grades and master your subjects with our comprehensive study materials.'
  },
  {
    icon: Award,
    title: 'Skill Development',
    description: 'Build critical thinking and problem-solving skills essential for your future.'
  },
  {
    icon: TrendingUp,
    title: 'Continuous Growth',
    description: 'Track your progress and improve consistently with our adaptive learning system.'
  }
];

export default function Goals() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Goals</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to helping you achieve your academic goals and prepare for a successful future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-md">
                <goal.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{goal.title}</h3>
              <p className="text-gray-600">{goal.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}