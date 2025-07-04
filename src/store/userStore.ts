import { create } from 'zustand';
import { User, LearningPreferences } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as authService from '../services/authService';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // User actions
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<LearningPreferences>) => Promise<void>;
  addCompletedLesson: (lessonId: string) => Promise<void>;
  incrementStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  addBadge: (badgeName: string, badgeDescription: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp(email, password, name);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signInWithGoogle();
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),

  updatePreferences: async (preferences) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences }
    };

    await updateDoc(doc(db, 'users', user.id), {
      preferences: updatedUser.preferences
    });

    set({ user: updatedUser });
  },

  addCompletedLesson: async (lessonId) => {
    const { user } = get();
    if (!user) return;

    const completedLessons = [...user.progress.completedLessons, lessonId];
    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        completedLessons
      }
    };

    await updateDoc(doc(db, 'users', user.id), {
      'progress.completedLessons': completedLessons
    });

    set({ user: updatedUser });
  },

  incrementStreak: async () => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        streakDays: user.progress.streakDays + 1,
        lastActive: new Date()
      }
    };

    await updateDoc(doc(db, 'users', user.id), {
      'progress.streakDays': updatedUser.progress.streakDays,
      'progress.lastActive': updatedUser.progress.lastActive.toISOString()
    });

    set({ user: updatedUser });
  },

  resetStreak: async () => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        streakDays: 0,
        lastActive: new Date()
      }
    };

    await updateDoc(doc(db, 'users', user.id), {
      'progress.streakDays': 0,
      'progress.lastActive': updatedUser.progress.lastActive.toISOString()
    });

    set({ user: updatedUser });
  },

  addPoints: async (points) => {
    const { user } = get();
    if (!user) return;

    const newPoints = user.progress.points + points;
    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        points: newPoints
      }
    };

    await updateDoc(doc(db, 'users', user.id), {
      'progress.points': newPoints
    });

    set({ user: updatedUser });
  },

  addBadge: async (badgeName, badgeDescription) => {
    const { user } = get();
    if (!user) return;

    const newBadge = {
      id: crypto.randomUUID(),
      name: badgeName,
      description: badgeDescription,
      imageUrl: `/badges/${badgeName.toLowerCase().replace(/\s+/g, '-')}.svg`,
      earnedAt: new Date()
    };

    const updatedBadges = [...user.progress.badges, newBadge];
    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        badges: updatedBadges
      }
    };

    await updateDoc(doc(db, 'users', user.id), {
      'progress.badges': updatedBadges.map(badge => ({
        ...badge,
        earnedAt: badge.earnedAt.toISOString()
      }))
    });

    set({ user: updatedUser });
  }
}));

export default useUserStore;
