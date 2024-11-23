"use client";

import React, { useState } from "react";
import {
  Book,
  GraduationCap,
  BrainCircuit,
  ChevronRight,
  Search,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import AuthModal from "./(auth)/login/AuthModal";
import Navbar from "./components/landingComponents/Header";
import SubjectCard from "./components/landingComponents/SubjectCard";
import QuizSection from "./components/landingComponents/QuizSection";
import Features from "./components/landingComponents/Features";
import Goals from "./components/landingComponents/Goals";
import Testimonials from "./components/landingComponents/Testimonials";
import Contact from "./components/landingComponents/Contact";
import Footer from "./components/landingComponents/Footer";
import Hero3D from "./components/landingComponents/Hero";

export default function Landing() {
  const [selectedGrade, setSelectedGrade] = useState<11 | 12>(11);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const subjects = {
    11: [
      { name: "Mathematics", icon: "📐", path: "/grade-11/math" },
      { name: "Physics", icon: "⚡", path: "/grade-11/physics" },
      { name: "Chemistry", icon: "🧪", path: "/grade-11/chemistry" },
      { name: "Biology", icon: "🧬", path: "/grade-11/biology" },
    ],
    12: [
      { name: "Advanced Mathematics", icon: "📊", path: "/grade-12/math" },
      { name: "Advanced Physics", icon: "🔭", path: "/grade-12/physics" },
      { name: "Advanced Chemistry", icon: "⚗️", path: "/grade-12/chemistry" },
      { name: "Advanced Biology", icon: "🔬", path: "/grade-12/biology" },
    ],
  };

  const filteredSubjects = subjects[selectedGrade].filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />

        <main className="relative">
          {/* Hero Section */}
          <section className="py-20 sm:py-32 lg:pb-32 xl:pb-36">
            <div className="container mx-auto px-4">
              <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
                <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-4xl font-medium tracking-tight text-white sm:text-7xl">
                      Learn Smarter,
                      <span className="relative whitespace-nowrap">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 418 42"
                          className="absolute left-0 top-2/3 h-[0.58em] w-full fill-purple-300/70"
                          preserveAspectRatio="none"
                        >
                          <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                        </svg>
                        <span className="relative text-purple-300">
                          Achieve More
                        </span>
                      </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-300">
                      Experience a revolutionary way of learning with our
                      interactive platform. Access comprehensive study
                      materials, take engaging quizzes, and track your progress.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAuthModalOpen(true)}
                        className="btn-primary"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                      <button className="btn-secondary group">
                        Learn More
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </div>
                <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
                  <Hero3D />
                </div>
              </div>
            </div>
          </section>

          {/* Study Materials Section */}
          <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-slate-900/50" />
            <div className="container mx-auto px-4 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Study Materials
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Access comprehensive study materials tailored to your grade
                  level
                </p>
              </motion.div>

              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="flex space-x-4 mb-4 md:mb-0">
                  <button
                    onClick={() => setSelectedGrade(11)}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      selectedGrade === 11
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    Grade 11
                  </button>
                  <button
                    onClick={() => setSelectedGrade(12)}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      selectedGrade === 12
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    Grade 12
                  </button>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SubjectCard {...subject} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <Features />
          <QuizSection grade={selectedGrade} />
          <Goals />
          <Testimonials />
          <Contact />
        </main>

        <Footer />

        <AnimatePresence>
          {isAuthModalOpen && (
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
