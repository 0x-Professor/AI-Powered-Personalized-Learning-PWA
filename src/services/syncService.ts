import { openDB, DBSchema } from 'idb';
import { Course, Lesson, User } from '../types';

interface LearningDB extends DBSchema {
  courses: {
    key: string;
    value: Course;
    indexes: { 'by-category': string };
  };
  lessons: {
    key: string;
    value: Lesson;
    indexes: { 'by-course': string };
  };
  userData: {
    key: string;
    value: User;
  };
  syncQueue: {
    key: string;
    value: {
      action: 'update' | 'create' | 'delete';
      collection: string;
      data: any;
      timestamp: number;
    };
  };
}

const DB_NAME = 'learning-app-db';
const DB_VERSION = 1;

export class SyncService {
  private db: Promise<any>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return openDB<LearningDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Courses store
        const courseStore = db.createObjectStore('courses', { keyPath: 'id' });
        courseStore.createIndex('by-category', 'category');

        // Lessons store
        const lessonStore = db.createObjectStore('lessons', { keyPath: 'id' });
        lessonStore.createIndex('by-course', 'courseId');

        // User data store
        db.createObjectStore('userData', { keyPath: 'id' });

        // Sync queue store
        db.createObjectStore('syncQueue', {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    });
  }

  async cacheCourse(course: Course) {
    const db = await this.db;
    await db.put('courses', course);
    
    // Cache lessons separately
    const tx = db.transaction('lessons', 'readwrite');
    for (const lesson of course.lessons) {
      await tx.store.put({ ...lesson, courseId: course.id });
    }
    await tx.done;
  }

  async getCachedCourse(courseId: string): Promise<Course | undefined> {
    const db = await this.db;
    const course = await db.get('courses', courseId);
    
    if (course) {
      // Get cached lessons
      const lessons = await db.getAllFromIndex('lessons', 'by-course', courseId);
      course.lessons = lessons;
    }
    
    return course;
  }

  async cacheUserData(userData: User) {
    const db = await this.db;
    await db.put('userData', userData);
  }

  async getCachedUserData(userId: string): Promise<User | undefined> {
    const db = await this.db;
    return db.get('userData', userId);
  }

  async queueSync(action: 'update' | 'create' | 'delete', collection: string, data: any) {
    const db = await this.db;
    await db.add('syncQueue', {
      action,
      collection,
      data,
      timestamp: Date.now()
    });
  }

  async processSyncQueue() {
    const db = await this.db;
    const queue = await db.getAll('syncQueue');
    
    for (const item of queue) {
      try {
        // Process sync item based on action and collection
        // This would typically involve making API calls when online
        console.log('Processing sync item:', item);
        
        // Remove processed item from queue
        await db.delete('syncQueue', item.id);
      } catch (error) {
        console.error('Error processing sync item:', error);
      }
    }
  }

  async clearCache() {
    const db = await this.db;
    await Promise.all([
      db.clear('courses'),
      db.clear('lessons'),
      db.clear('userData'),
      db.clear('syncQueue')
    ]);
  }
}