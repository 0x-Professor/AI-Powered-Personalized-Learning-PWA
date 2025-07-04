import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  addDoc,
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course, Lesson } from '../types';
import { generateLearningContent, generateQuiz } from '../utils/geminiApi';

const COURSES_COLLECTION = 'courses';
const LESSONS_COLLECTION = 'lessons';

export const getCourses = async (filters?: {
  category?: string;
  difficulty?: string;
  search?: string;
}): Promise<Course[]> => {
  try {
    let q = collection(db, COURSES_COLLECTION);
    
    if (filters) {
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.difficulty) {
        q = query(q, where('difficulty', '==', filters.difficulty));
      }
    }
    
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    
    for (const doc of querySnapshot.docs) {
      const courseData = doc.data();
      const lessonsQuery = collection(db, COURSES_COLLECTION, doc.id, LESSONS_COLLECTION);
      const lessonsSnapshot = await getDocs(lessonsQuery);
      const lessons = lessonsSnapshot.docs.map(lessonDoc => ({
        id: lessonDoc.id,
        ...lessonDoc.data()
      })) as Lesson[];

      courses.push({
        id: doc.id,
        ...courseData,
        lessons
      } as Course);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      return courses.filter(course => 
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courseDoc = await getDoc(doc(db, COURSES_COLLECTION, courseId));
    if (!courseDoc.exists()) return null;

    const courseData = courseDoc.data();
    const lessonsQuery = collection(db, COURSES_COLLECTION, courseId, LESSONS_COLLECTION);
    const lessonsSnapshot = await getDocs(lessonsQuery);
    const lessons = lessonsSnapshot.docs.map(lessonDoc => ({
      id: lessonDoc.id,
      ...lessonDoc.data()
    })) as Lesson[];

    return {
      id: courseDoc.id,
      ...courseData,
      lessons
    } as Course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const getRecommendedCourses = async (userId: string, limit = 3): Promise<Course[]> => {
  try {
    // In a real implementation, you would use a recommendation algorithm
    // For now, return the most recent courses matching the user's interests
    const q = query(
      collection(db, COURSES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    
    for (const doc of querySnapshot.docs) {
      const courseData = doc.data();
      courses.push({
        id: doc.id,
        ...courseData,
        lessons: [] // Load lessons only when needed
      } as Course);
    }
    
    return courses;
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    throw error;
  }
};

export const generateLesson = async (
  courseId: string,
  topic: string,
  description: string
): Promise<Lesson> => {
  try {
    const content = await generateLearningContent(topic, description);
    const quiz = await generateQuiz(topic, 'intermediate');
    
    const lessonData: Lesson = {
      id: '', // Will be set by Firestore
      title: topic,
      description,
      content,
      estimatedDuration: 30, // Default duration
      resources: [],
      quiz: JSON.parse(quiz)
    };

    const lessonRef = await addDoc(
      collection(db, COURSES_COLLECTION, courseId, LESSONS_COLLECTION),
      lessonData
    );

    return {
      ...lessonData,
      id: lessonRef.id
    };
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw error;
  }
};