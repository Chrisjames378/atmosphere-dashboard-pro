/**
 * Web Notifications API Service
 * Handles browser permission requests, native Web Notifications dispatch,
 * and fallback in-app alerts when browser notifications are restricted.
 */

export interface ReminderSettings {
  enabled: boolean;
  dailyEcoAction: boolean;
  dailyBonus: boolean;
  climateGoalProgress: boolean;
  frequencyMinutes: number; // e.g. 1 min test, 60 min, 1440 min (daily)
  lastTriggered?: string;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  dailyEcoAction: true,
  dailyBonus: true,
  climateGoalProgress: true,
  frequencyMinutes: 60,
};

export class NotificationService {
  /**
   * Check if Web Notifications API is supported in the browser
   */
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current permission status ('granted' | 'denied' | 'default')
   */
  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request Web Notification permission from user
   */
  public static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('[NotificationService] Permission request failed:', err);
      return Notification.permission;
    }
  }

  /**
   * Dispatch a Web Notification with custom title, body, and icon
   */
  public static sendNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        silent: false,
        ...options,
      });

      notification.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
        notification.close();
      };

      return true;
    } catch (err) {
      console.warn('[NotificationService] Notification dispatch failed:', err);
      return false;
    }
  }

  /**
   * Send test reminder notification based on selected type
   */
  public static sendEcoActionReminder(): boolean {
    return this.sendNotification('🌿 Time to Log Your Daily Eco-Actions!', {
      body: 'Log your sustainable activities today (recycling, cycling, solar usage) to earn tradeable Carbon Credits in Atmosphere.',
      tag: 'eco-action-reminder',
    });
  }

  public static sendBonusReminder(): boolean {
    return this.sendNotification('🎁 Daily Bonus Carbon Credits Ready!', {
      body: 'Your daily atmosphere sustainability bonus of +25 Carbon Credits is waiting to be claimed.',
      tag: 'daily-bonus-reminder',
    });
  }

  public static sendGoalProgressReminder(): boolean {
    return this.sendNotification('📊 Atmosphere Climate Roadmap Update', {
      body: 'Check your progress on your 7-Day Carbon Reduction Plan and claim rewards for completed milestones.',
      tag: 'climate-goal-reminder',
    });
  }
}
