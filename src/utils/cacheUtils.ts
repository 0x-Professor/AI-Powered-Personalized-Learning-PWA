import { SyncService } from '../services/syncService';
import * as courseService from '../services/courseService';
import { Course, User } from '../types';

const syncService = new SyncService();

export async function cacheEssentialContent(user: User) {
  try {
    // Cache user data
    await syncService.cacheUserData(user);

    // Cache in-progress and recommended courses
    const inProgressCourseIds = user.progress.completedLessons
      .map(lessonId => lessonId.split('/')[0]) // Assuming lesson IDs are in format "courseId/lessonId"
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    for (const courseId of inProgressCourseIds) {
      const course = await courseService.getCourseById(courseId);
      if (course) {
        await syncService.cacheCourse(course);
      }
    }

    // Cache recommended courses
    const recommendedCourses = await courseService.getRecommendedCourses(user.id, 3);
    for (const course of recommendedCourses) {
      await syncService.cacheCourse(course);
    }

    // Cache course categories and metadata
    const allCourses = await courseService.getCourses();
    const coursesMetadata = allCourses.map(({ id, title, description, category, difficulty, imageUrl }) => ({
      id,
      title,
      description,
      category,
      difficulty,
      imageUrl
    }));

    const db = await syncService.getDB();
    await db.put('metadata', {
      id: 'coursesMetadata',
      data: coursesMetadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error caching essential content:', error);
    throw error;
  }
}

export async function prefetchCourse(courseId: string): Promise<void> {
  try {
    const course = await courseService.getCourseById(courseId);
    if (course) {
      await syncService.cacheCourse(course);
    }
  } catch (error) {
    console.error('Error prefetching course:', error);
    throw error;
  }
}

export async function cleanupCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  try {
    const db = await syncService.getDB();
    const now = Date.now();

    // Clean up old metadata
    const metadata = await db.get('metadata', 'coursesMetadata');
    if (metadata && now - new Date(metadata.timestamp).getTime() > maxAge) {
      await db.delete('metadata', 'coursesMetadata');
    }

    // Clean up old courses
    const courses = await db.getAll('courses');
    for (const course of courses) {
      if (now - new Date(course.cachedAt).getTime() > maxAge) {
        await db.delete('courses', course.id);
        // Also clean up associated lessons
        const lessonsIndex = await db.getAllFromIndex('lessons', 'by-course', course.id);
        for (const lesson of lessonsIndex) {
          await db.delete('lessons', lesson.id);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
    throw error;
  }
}