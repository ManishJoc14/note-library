"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; 
import { useGrade } from "../../../../context/GradeContext"; 
import { subjects11, subjects12 } from "../../../../data/subjects";
import SubjectCard from "../../../../components/landingComponents/SubjectCard";

export default function StudyMaterials() {
  const { grade, setGrade } = useGrade(); 
  const [searchQuery, setSearchQuery] = useState("");

  const subjects = grade === "11" ? subjects11 : subjects12;

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative">
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
            Access comprehensive study materials tailored to your grade level
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => setGrade("11")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                grade === "11"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Grade 11
            </button>
            <button
              onClick={() => setGrade("12")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                grade === "12"
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
              <Link href={`/student/notes/${grade}/${subject.id}`} passHref>
                <SubjectCard {...subject} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
