import { getMessaging, getToken, onMessage } from '@firebase/messaging';
import { app } from '../config/firebase';
import { SpeechService } from './speechService';

const messaging = getMessaging(app);

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  type?: NotificationType;
  duration?: number;
  speak?: boolean;
  playSound?: boolean;
}

// Event system for notifications
type NotificationListener = (notification: {
  message: string;
  type: NotificationType;
}) => void;

class NotificationManager {
  private listeners: NotificationListener[] = [];
  private speechService: SpeechService;

  constructor() {
    this.speechService = new SpeechService();
  }

  subscribe(listener: NotificationListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(message: string, type: NotificationType) {
    this.listeners.forEach(listener => listener({ message, type }));
  }
}

const manager = new NotificationManager();

export const sendNotification = (
  message: string,
  options: NotificationOptions = {}
) => {
  const {
    type = 'info',
    duration = 5000,
    speak = false,
    playSound = true
  } = options;

  // Show visual notification
  manager.notify(message, type);

  // Play notification sound if enabled
  if (playSound) {
    const audio = new Audio();
    switch (type) {
      case 'success':
        audio.src = '/sounds/success.mp3';
        break;
      case 'error':
        audio.src = '/sounds/error.mp3';
        break;
      case 'warning':
        audio.src = '/sounds/warning.mp3';
        break;
      default:
        audio.src = '/sounds/notification.mp3';
    }
    audio.play().catch(() => {
      // Ignore errors if sound can't be played
    });
  }

  // Speak notification if enabled
  if (speak) {
    const speechService = new SpeechService();
    if (speechService.isSpeechSupported()) {
      speechService.speak(message);
    }
  }

  return {
    dismiss: () => {
      manager.notify('', 'info'); // Clear notification
    }
  };
};

export const sendLearningReminder = async (
  userId: string,
  dailyGoal: number
) => {
  // Check if we have permission to send notifications
  if (Notification.permission === 'granted') {
    const title = 'Learning Reminder';
    const options = {
      body: `Don't forget your daily goal of ${dailyGoal} minutes of learning!`,
      icon: '/icons/notification-icon.png',
      badge: '/icons/badge-icon.png',
      tag: 'learning-reminder',
      requireInteraction: true
    };

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const subscribeToNotifications = (listener: NotificationListener) => {
  return manager.subscribe(listener);
};