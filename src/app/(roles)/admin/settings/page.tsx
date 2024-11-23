"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Bell, Lock, User, Mail, 
  Shield, Globe, Palette, Moon, Sun 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'en'
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Notifications */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Bell size={20} />
          Notification Settings
        </h3>
        <div className="space-y-4">
          {[
            { id: 'email', label: 'Email Notifications' },
            { id: 'push', label: 'Push Notifications' },
            { id: 'updates', label: 'System Updates' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <label className="text-gray-300">{item.label}</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.id as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    [item.id]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Palette size={20} />
          Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Theme</label>
            <div className="flex gap-4">
              <button
                onClick={() => setAppearance(prev => ({ ...prev, theme: 'light' }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  appearance.theme === 'light'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => setAppearance(prev => ({ ...prev, theme: 'dark' }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  appearance.theme === 'dark'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Language</label>
            <select
              value={appearance.language}
              onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Shield size={20} />
          Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Two-Factor Authentication</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={(e) => setSecurity(prev => ({
                  ...prev,
                  twoFactor: e.target.checked
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Session Timeout (minutes)</label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="fixed bottom-8 right-8 btn-primary"
      >
        <Save size={20} className="mr-2" />
        Save Changes
      </button>
    </motion.div>
  );
};

export default AdminSettings;