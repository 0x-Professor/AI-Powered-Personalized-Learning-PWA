export interface User {
  id: string;
  name: string;
  email: string;
  preferences: LearningPreferences;
  progress: Progress;
  joinedAt: Date;
}

export interface LearningPreferences {
  interests: string[];
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dailyGoal: number; // minutes
}

export interface Progress {
  streakDays: number;
  lastActive: Date;
  completedLessons: string[];
  points: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // minutes
  tags: string[];
  imageUrl: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  estimatedDuration: number; // minutes
  resources: Resource[];
  quiz?: Quiz;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'practice' | 'document';
  url: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AIResponse {
  content: string;
  additionalResources?: Resource[];
  suggestedNextLessons?: string[];
}
