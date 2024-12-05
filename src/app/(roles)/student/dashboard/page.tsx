"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  BookText,
  Brain,
  ChevronRight,
  Target,
  User,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  fetchUserActivities,
  getUpcomingQuizes,
} from "../../../../lib/supabase";
import { formatCustomDate, timeAgo } from "../../../../lib/helperfuntions";
import Link from "next/link";
import { useGrade } from "../../../../context/GradeContext";

interface Activity {
  type: string;
  title: string;
  score?: number;
  date: string;
}
interface UpcomingQuiz {
  id: string;
  subject: string;
  topic: string;
  date: string;
}

const Dashboard = () => {
  const { user: userData } = useAuth();
  const { grade } = useGrade();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<UpcomingQuiz[]>([]);

  useEffect(() => {
    if (userData) {
      const fetchQuizData = async () => {
        try {
          const data: Activity[] =
            (await fetchUserActivities(userData?.id)) || [];
          setActivities(data);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchUpcomingQuizzes = async () => {
        try {
          const data: UpcomingQuiz[] = (await getUpcomingQuizes()) || [];
          setUpcomingQuizzes(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchQuizData();
      fetchUpcomingQuizzes();
    }
  }, [userData]);

  if (!userData) return <p className="text-white">Loading...</p>;

  // Dashboard stats
  const stats = [
    {
      label: "Completed Quizzes",
      value: userData?.quizData.length,
      icon: Brain,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Average Score",
      value:
        Math.floor(
          userData?.quizData.reduce((sum, item) => sum + item.score, 0) /
            userData?.quizData.length
        ) || 0,
      icon: Target,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Study Hours",
      value: "24h",
      icon: Clock,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Achievement Points",
      value: "1,250",
      icon: Award,
      color: "text-yellow-500 bg-yellow-500/10",
    },
  ];

  // Recent activities
  // const activities = [

  // FIXME - Add achievements in database ( from where to add it)
  //   {
  //     type: "achievement",
  //     title: 'Earned "Quick Learner" Badge',
  //     date: "1d ago",
  //   },
  // ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <Brain size={20} />;
      case "note":
        return <BookText size={20} />;
      case "account":
        return <User size={20} />;
      default:
        return <Award size={20} />;
    }
  };

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
            onClick={() =>
              stat.label === "Completed Quizzes"
                ? router.push("/student/quizzes/completed")
                : ""
            }
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
            {activities.length > 0 ? (
              activities.map((activity, index) => (
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
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-sm">
                        {timeAgo(activity.date)}
                      </p>
                    </div>
                  </div>
                  {activity.score && (
                    <span className="text-green-400 font-semibold">
                      {activity.score}%
                    </span>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-white">No activities found</p>
            )}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="glass-card p-6">
          <h3 className="text-white text-lg font-semibold mb-4">
            Upcoming Quizzes
          </h3>
          <div className="space-y-4">
            {upcomingQuizzes.length > 0 ? (
              upcomingQuizzes.map((quiz, index) => (
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
                    <span className="text-purple-400 text-sm">
                      {formatCustomDate(quiz.date)}
                    </span>
                  </div>
                  <Link
                    href={`/student/notes/${grade}/${quiz.subject.toLowerCase()}`}
                    passHref
                  >
                    <button className="btn-primary !py-2 w-full mt-3">
                      Prepare Now
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="text-white">No upcoming quizzes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
