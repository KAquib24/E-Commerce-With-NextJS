"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { messaging, getToken, onMessage, isMessagingSupported } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface NotificationContextType {
  notificationPermission: NotificationPermission | null;
  fcmToken: string | null;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = async () => {
    if (!messaging) {
      console.warn('Messaging not supported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        
        if (token) {
          setFcmToken(token);
          console.log('FCM Token:', token);
          
          // Store token in your database for the current user
          // await storeFCMToken(token);
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  useEffect(() => {
    // Check initial permission status
    setNotificationPermission(Notification.permission);

    // Initialize messaging if supported
    const initializeMessaging = async () => {
      const supported = await isMessagingSupported();
      if (supported && messaging) {
        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log('Foreground message received: ', payload);
          toast({
            title: payload.notification?.title || 'New Notification',
            description: payload.notification?.body,
            variant: 'default',
          });
        });

        // Auto-request permission if not yet requested
        if (Notification.permission === 'default') {
          // You might want to trigger this on user action instead
          // requestPermission();
        } else if (Notification.permission === 'granted') {
          requestPermission();
        }
      }
    };

    initializeMessaging();
  }, []);

  const value: NotificationContextType = {
    notificationPermission,
    fcmToken,
    requestPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};