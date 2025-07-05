import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, LearningPreferences } from '../types';

export const signUp = async (email: string, password: string, name: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const newUser = createUserProfile(user, name);
  await saveUserToFirestore(user.uid, newUser);
  return newUser;
};

export const signIn = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return await getUserFromFirestore(user.uid);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  let userProfile = await getUserFromFirestore(user.uid);
  
  if (!userProfile) {
    userProfile = createUserProfile(user, user.displayName || 'User');
    await saveUserToFirestore(user.uid, userProfile);
  }
  
  return userProfile;
};

export const logOut = () => signOut(auth);

const createUserProfile = (user: FirebaseUser, name: string): User => ({
  id: user.uid,
  name,
  email: user.email || '',
  preferences: {
    interests: [],
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

const saveUserToFirestore = async (uid: string, userData: User) => {
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    lastActive: userData.progress.lastActive.toISOString(),
    joinedAt: userData.joinedAt.toISOString()
  });
};

export const getUserFromFirestore = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    ...data,
    progress: {
      ...data.progress,
      lastActive: new Date(data.progress.lastActive),
    },
    joinedAt: new Date(data.joinedAt)
  } as User;
};

export const updateUserPreferences = async (uid: string, preferences: LearningPreferences) => {
  await setDoc(doc(db, 'users', uid), { preferences }, { merge: true });
};