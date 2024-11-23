export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  grade: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  uploadDate: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  totalAttempts: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  grade: string;
  phone: string;
  role: 'student' | 'admin' ;
  completedQuizzes: string[];
  quizScores: Record<string, number>;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  date: string;
}