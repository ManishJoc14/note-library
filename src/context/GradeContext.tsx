"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GradeContextType {
  grade: "11" | "12"; 
  setGrade: (grade: "11" | "12") => void; 
}

// Create the context with a default value
const GradeContext = createContext<GradeContextType | undefined>(undefined);

interface GradeProviderProps {
    children: ReactNode;
}

// Provider Component
export const GradeProvider: React.FC<GradeProviderProps> = ({ children }) => {
  const [grade, setGrade] = useState<"11" | "12">("11"); 

  return (
    <GradeContext.Provider value={{ grade, setGrade }}>
      {children}
    </GradeContext.Provider>
  );
};

// Custom Hook to use GradeContext
export const useGrade = (): GradeContextType => {
  const context = useContext(GradeContext);
  if (!context) {
    throw new Error("useGrade must be used within a GradeProvider");
  }
  return context;
};
