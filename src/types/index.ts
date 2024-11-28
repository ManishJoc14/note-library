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
  description: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_size: string;
  upload_date: string;
  downloads: number;
  likes: number;
  views: number;
  isLiked?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: Question[];
  participants: number;
  avg_score: number;
  created_at: string;
  image: string;
  taken_by: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number | string;
}

export interface ReviewQuestion {
  id: string;
  text: string;
  status: "correct" | "missed" | "skipped";
  options: string[];
  userAnswer: number;
  correctAnswer: number;
}

export interface QuizSummaryProps {
  id: string;
  score: number;
  title: string;
  subject: string;
  grade: string;
  correctCount: number;
  missedCount: number;
  skippedCount: number;
  questionsReview: ReviewQuestion[];
  completedAt: string;
}

export interface User {
  id: string; 
  fullName: string; 
  email: string; 
  grade: string; 
  phone?: string; 
  role: "student" | "admin"; 
  quizData: QuizSummaryProps[]; 
  likedPosts: string[]; 
  viewedPosts: string[]; 
  createdAt: string; 
  updatedAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  date: string;
}
