"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import AuthModal from "./(auth)/login/AuthModal";
import Header from "../components/landingComponents/Header";
import QuizSection from "../components/landingComponents/QuizSection";
import Features from "../components/landingComponents/Features";
import Goals from "../components/landingComponents/Goals";
import Testimonials from "../components/landingComponents/Testimonials";
import Contact from "../components/landingComponents/Contact";
import Footer from "../components/landingComponents/Footer";
import Hero3D from "../components/landingComponents/Hero";
import StudyMaterials from "../components/landingComponents/StudyMaterials";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation"; 

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const {isAuthenticated , isAdmin} = useAuth();
  const router = useRouter();
  
  const handleClick = () => {
      const role = isAdmin ? "admin" : "student";
      isAuthenticated ? router.push(`/${role}/dashboard`) : setIsAuthModalOpen(true) ;
  } 
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <Header onAuthClick={() => setIsAuthModalOpen(true)} />

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
                        onClick={handleClick}
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

          <StudyMaterials />
          <Features />
          <QuizSection />
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
