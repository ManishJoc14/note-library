"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Brain, FileText, MessageSquare, X } from 'lucide-react';
import { format } from 'date-fns';

const notifications = [
  {
    id: 1,
    type: 'user',
    message: 'New student registration',
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false
  },
  {
    id: 2,
    type: 'quiz',
    message: 'Quiz completion rate increased by 15%',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false
  },
  {
    id: 3,
    type: 'note',
    message: 'New study material uploaded',
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true
  },
  {
    id: 4,
    type: 'feedback',
    message: 'New feedback received',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'user':
      return User;
    case 'quiz':
      return Brain;
    case 'note':
      return FileText;
    case 'feedback':
      return MessageSquare;
    default:
      return Bell;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'user':
      return 'text-purple-500 bg-purple-500/20';
    case 'quiz':
      return 'text-blue-500 bg-blue-500/20';
    case 'note':
      return 'text-green-500 bg-green-500/20';
    case 'feedback':
      return 'text-yellow-500 bg-yellow-500/20';
    default:
      return 'text-gray-500 bg-gray-500/20';
  }
};

interface NotificationsProps {
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-16 right-0 w-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden z-50"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="divide-y divide-white/10 max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.map((notification, index) => {
          const Icon = getIcon(notification.type);
          const iconColor = getIconColor(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                !notification.read ? 'bg-white/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(notification.time, 'MMM d, h:mm a')}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
};

export default Notifications;