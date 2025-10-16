"use client";
import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

export default function NotificationBell() {
  const { notificationPermission, fcmToken, requestPermission } = useNotification();
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleEnableNotifications = async () => {
    await requestPermission();
    
    if (notificationPermission === 'granted') {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive important updates about your orders.",
      });
    }
  };

  const handleDisableNotifications = () => {
    // In a real app, you'd remove the token from your database
    toast({
      title: "Notifications Disabled",
      description: "You won't receive push notifications anymore.",
    });
  };

  if (notificationPermission === 'denied') {
    return (
      <Button variant="ghost" size="icon" disabled>
        <BellOff className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notificationPermission === 'default' && (
          <DropdownMenuItem onClick={handleEnableNotifications}>
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </DropdownMenuItem>
        )}
        
        {notificationPermission === 'granted' && (
          <>
            <div className="p-2 border-b">
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                {fcmToken ? 'Notifications active' : 'Setting up notifications...'}
              </p>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-sm text-muted-foreground">{notification.body}</span>
                </DropdownMenuItem>
              ))
            )}
            
            <DropdownMenuItem onClick={handleDisableNotifications} className="text-red-600">
              <BellOff className="h-4 w-4 mr-2" />
              Disable Notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}