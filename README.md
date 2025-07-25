# BrainWave - AI-Powered Learning Platform

![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.1-purple?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange?logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Enabled-green?logo=pwa)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-blue?logo=tailwind-css)

BrainWave is a modern, AI-powered learning platform designed to provide a personalized and engaging educational experience. It leverages cutting-edge technologies to offer features like AI-driven course recommendations, interactive quizzes, and voice-based navigation. The application is built as a Progressive Web App (PWA), ensuring offline access and a seamless user experience across all devices.

## Features

- **AI Assistant**: An intelligent assistant to help with course content, answer questions, and provide personalized learning support.
- **Personalized Learning**: Get course recommendations and quizzes tailored to your individual learning style and pace.
- **Offline Access**: As a PWA, BrainWave allows you to access your courses and learning materials even without an internet connection.
- **Voice Commands**: Interact with the platform using voice commands for a hands-free learning experience.
- **Progress Tracking**: Monitor your learning progress, earn badges, and stay motivated.
- **User Authentication**: Secure user authentication and authorization using Firebase.
- **Course Management**: A comprehensive system for managing courses, lessons, and quizzes.
- **Notifications**: Real-time notifications for important events and updates.
- **Responsive Design**: A fully responsive design that works on all devices.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **AI**: Google Gemini
- **Backend**: Firebase (Authentication, Firestore, Messaging)
- **PWA**: Workbox
- **Build Tool**: Vite

## File Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── learning/
│   │   ├── onboarding/
│   │   └── ui/
│   ├── config/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/0x-Professor/AI-Powered-Personalized-Learning-PWA.git
   ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory and add your Firebase configuration details:
    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
4. Start the development server
    ```sh
    npm run dev
    ```

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`. You can create an account, browse courses, and interact with the AI assistant.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
