"use client";

/**
 * Notification Banner Component
 *
 * @notice Dismissible banner prompting users to enable notifications
 * @dev KISS principle: Simple banner with localStorage persistence
 * @security Client-side only (UI component)
 */

import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddMiniAppButton } from './AddMiniAppButton';

/**
 * Dismissible notification prompt banner
 *
 * UX Features:
 * - localStorage persistence (dismiss once, stays dismissed)
 * - Bottom positioning (mobile thumb-friendly)
 * - Mobile-responsive design
 * - Accessible (ARIA labels)
 * - Smooth entrance animation
 */
export function NotificationBanner() {
  const [dismissed, setDismissed] = useState(true); // Default to hidden

  useEffect(() => {
    // Check if banner was dismissed
    if (typeof window !== 'undefined') {
      const isDismissed = localStorage.getItem('notification-banner-dismissed') === 'true';
      setDismissed(isDismissed);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('notification-banner-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-lg z-50 animate-in slide-in-from-bottom duration-300"
      role="complementary"
      aria-label="Notification prompt"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
            Never miss a competition
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
            Get notified when new challenges launch and competitions end
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <AddMiniAppButton size="sm" variant="default" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              Not now
            </Button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 transition-colors p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Dismiss notification prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
