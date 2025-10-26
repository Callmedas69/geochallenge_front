"use client";

/**
 * Notification Success Modal
 *
 * @notice Shows confirmation after user enables notifications
 * @dev KISS principle: Simple modal showing what notifications user will receive
 * @security Client-side only (UI component)
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface NotificationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Success confirmation modal
 *
 * Shows user what notifications they'll receive:
 * - New competitions
 * - Competition reminders (24h before end)
 * - Prize wins
 * - Collection milestones
 */
export function NotificationSuccessModal({ isOpen, onClose }: NotificationSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Notifications Enabled!</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-4">
            You&apos;ll receive updates for:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-medium text-sm">New Competitions</p>
              <p className="text-xs text-muted-foreground">
                Be the first to know when new competitions launch
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-medium text-sm">Competition Reminders</p>
              <p className="text-xs text-muted-foreground">
                Get notified 24 hours before competitions end
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-medium text-sm">Prize Wins</p>
              <p className="text-xs text-muted-foreground">
                Instant alerts when you win or claim prizes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="font-medium text-sm">Collection Milestones</p>
              <p className="text-xs text-muted-foreground">
                Celebrate completing rarity sets
              </p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
