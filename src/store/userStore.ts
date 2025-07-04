import { create } from 'zustand';
import { User, LearningPreferences } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<LearningPreferences>) => void;
  addCompletedLesson: (lessonId: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addPoints: (points: number) => void;
  addBadge: (badgeName: string, badgeDescription: string) => void;
  logout: () => void;
}

// Mock data for demonstration purposes
const createDefaultUser = (): User => ({
  id: uuidv4(),
  name: 'Guest User',
  email: 'guest@example.com',
  preferences: {
    interests: ['Programming', 'Web Development'],
    learningStyle: 'visual',
    difficulty: 'beginner',
    dailyGoal: 30
  },
  progress: {
    streakDays: 0,
    lastActive: new Date(),
    completedLessons: [],
    points: 0,
    badges: []
  },
  joinedAt: new Date()
});

export const useUserStore = create<UserState>((set) => ({
  user: createDefaultUser(), // Initialize with default user instead of null
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  updatePreferences: (preferences) => 
    set((state) => ({
      user: state.user ? {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...preferences
        }
      } : createDefaultUser()
    })),
  
  addCompletedLesson: (lessonId) => 
    set((state) => {
      if (!state.user) return { user: createDefaultUser() };
      
      // Don't add duplicate lessons
      if (state.user.progress.completedLessons.includes(lessonId)) {
        return { user: state.user };
      }
      
      return {
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            completedLessons: [...state.user.progress.completedLessons, lessonId]
          }
        }
      };
    }),
  
  incrementStreak: () => 
    set((state) => ({
      user: state.user ? {
        ...state.user,
        progress: {
          ...state.user.progress,
          streakDays: state.user.progress.streakDays + 1,
          lastActive: new Date()
        }
      } : createDefaultUser()
    })),
  
  resetStreak: () => 
    set((state) => ({
      user: state.user ? {
        ...state.user,
        progress: {
          ...state.user.progress,
          streakDays: 0,
          lastActive: new Date()
        }
      } : createDefaultUser()
    })),
  
  addPoints: (points) => 
    set((state) => ({
      user: state.user ? {
        ...state.user,
        progress: {
          ...state.user.progress,
          points: state.user.progress.points + points
        }
      } : createDefaultUser()
    })),
  
  addBadge: (badgeName, badgeDescription) => 
    set((state) => {
      if (!state.user) return { user: createDefaultUser() };
      
      const newBadge = {
        id: uuidv4(),
        name: badgeName,
        description: badgeDescription,
        imageUrl: `/badges/${badgeName.toLowerCase().replace(/\s+/g, '-')}.svg`,
        earnedAt: new Date()
      };
      
      return {
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            badges: [...state.user.progress.badges, newBadge]
          }
        }
      };
    }),
    
  logout: () => set({ user: null })
}));

export default useUserStore;
