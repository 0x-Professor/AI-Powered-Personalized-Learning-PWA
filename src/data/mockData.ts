import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'web-dev-basics',
    title: 'Web Development Fundamentals',
    description: 'Learn the essentials of HTML, CSS, and JavaScript to build modern websites.',
    category: 'Programming',
    difficulty: 'beginner',
    estimatedDuration: 240,
    tags: ['HTML', 'CSS', 'JavaScript', 'Web'],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072',
    lessons: [
      {
        id: 'html-intro',
        title: 'Introduction to HTML',
        description: 'Learn the basics of HTML structure and semantic elements',
        estimatedDuration: 30,
        content: `# Introduction to HTML

HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications.

## Basic Structure

Every HTML page has a basic structure that looks like this:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
\`\`\`

## Key Elements

- **<!DOCTYPE html>**: Declares the document type
- **<html>**: Root element of an HTML page
- **<head>**: Contains meta information about the document
- **<title>**: Specifies a title for the document
- **<body>**: Contains the visible page content

## Semantic HTML

Semantic HTML introduces meaning to the web page rather than just presentation. Examples include:

- **<header>**: Represents introductory content
- **<nav>**: Represents a section of navigation links
- **<main>**: Represents the dominant content
- **<article>**: Represents independent, self-contained content
- **<section>**: Represents a standalone section
- **<footer>**: Represents a footer for a document or section

## Practice Exercise

Create a simple HTML page with:
1. A proper document structure
2. A heading and paragraph
3. At least three semantic HTML elements

## Key Takeaways

1. HTML provides the structure for web pages
2. Semantic HTML improves accessibility and SEO
3. Every HTML document should follow the basic structure with doctype, html, head, and body elements`,
        resources: [
          {
            id: 'html-mdn',
            title: 'MDN Web Docs - HTML',
            type: 'article',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
          },
          {
            id: 'html-video',
            title: 'HTML Crash Course For Beginners',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=UB1O30fR-EE'
          }
        ]
      },
      {
        id: 'css-basics',
        title: 'CSS Basics',
        description: 'Learn how to style HTML elements using CSS',
        estimatedDuration: 45,
        content: '',
        resources: [
          {
            id: 'css-mdn',
            title: 'MDN Web Docs - CSS',
            type: 'article',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
          }
        ],
        quiz: {
          id: 'css-quiz',
          questions: [
            {
              id: 'css-q1',
              text: 'Which CSS property is used to change the text color?',
              options: ['text-color', 'color', 'font-color', 'text-style'],
              correctOptionIndex: 1,
              explanation: 'The color property is used to set the color of text.'
            },
            {
              id: 'css-q2',
              text: 'Which CSS selector targets elements with a specific class?',
              options: ['#class', '.class', '*class', '&class'],
              correctOptionIndex: 1,
              explanation: 'The dot (.) selector is used to select elements with a specific class attribute.'
            }
          ],
          passingScore: 70
        }
      }
    ]
  },
  {
    id: 'javascript-basics',
    title: 'JavaScript Programming: Zero to Hero',
    description: 'Master JavaScript fundamentals and advanced concepts for modern web development.',
    category: 'Programming',
    difficulty: 'intermediate',
    estimatedDuration: 360,
    tags: ['JavaScript', 'ES6', 'Programming', 'Web'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070',
    lessons: [
      {
        id: 'js-intro',
        title: 'JavaScript Introduction',
        description: 'An introduction to JavaScript and its role in web development',
        estimatedDuration: 30,
        content: '',
        resources: []
      }
    ]
  },
  {
    id: 'react-fundamentals',
    title: 'React.js Fundamentals',
    description: 'Learn to build interactive UIs with React, the popular JavaScript library.',
    category: 'Programming',
    difficulty: 'intermediate',
    estimatedDuration: 300,
    tags: ['React', 'JavaScript', 'Frontend', 'UI'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070',
    lessons: []
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Use Python to analyze data, create visualizations, and build machine learning models.',
    category: 'Data Science',
    difficulty: 'intermediate',
    estimatedDuration: 420,
    tags: ['Python', 'Data Science', 'Machine Learning', 'Analysis'],
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069',
    lessons: []
  },
  {
    id: 'spanish-beginners',
    title: 'Spanish for Beginners',
    description: 'Start your journey to Spanish fluency with this comprehensive introduction.',
    category: 'Languages',
    difficulty: 'beginner',
    estimatedDuration: 240,
    tags: ['Spanish', 'Language', 'Beginner'],
    imageUrl: 'https://images.unsplash.com/photo-1461855799088-300bd3b8d129?q=80&w=2070',
    lessons: []
  },
  {
    id: 'machine-learning-intro',
    title: 'Introduction to Machine Learning',
    description: 'Understand the core concepts and algorithms behind machine learning.',
    category: 'Data Science',
    difficulty: 'advanced',
    estimatedDuration: 480,
    tags: ['Machine Learning', 'AI', 'Data Science', 'Algorithms'],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2071',
    lessons: []
  }
];
