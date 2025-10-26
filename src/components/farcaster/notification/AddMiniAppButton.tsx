"use client";

/**
 * AddMiniApp Button Component
 *
 * @notice Prompts user to add miniapp and enable notifications
 * @dev KISS principle: Simple button with clear states
 * @security Client-side only (uses Farcaster SDK)
 */

import { useState } from 'react';
import { sdk } from '@/lib/farcaster/sdk';
import { Button } from '@/components/ui/button';
import { Bell, Check, AlertCircle, Loader2 } from 'lucide-react';
import { NotificationSuccessModal } from './NotificationSuccessModal';

interface AddMiniAppButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

/**
 * Button to add miniapp and enable notifications
 *
 * UX Features:
 * - User-friendly error messages
 * - Mobile touch targets (44px min)
 * - Accessible (ARIA attributes)
 * - Success modal confirmation
 */
export function AddMiniAppButton({
  variant = 'default',
  size = 'default',
  className = ''
}: AddMiniAppButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**
   * Convert technical errors to user-friendly messages
   * 🎯 UX: Clear, actionable error messages
   */
  const getUserFriendlyError = (error: Error): string => {
    const message = error.message.toLowerCase();

    if (message.includes('reject') || message.includes('denied') || message.includes('cancel')) {
      return 'You declined the request. Try again when ready.';
    }
    if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
      return 'Connection issue. Please check your internet.';
    }
    if (message.includes('already') || message.includes('exists')) {
      return 'You already enabled notifications!';
    }
    return 'Something went wrong. Please try again.';
  };

  const handleAddMiniApp = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');

      // Call Farcaster SDK to prompt user
      await sdk.actions.addMiniApp();

      setStatus('success');

      // ✅ Show success modal after smooth delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setShowSuccessModal(true);

    } catch (error) {
      console.error('[AddMiniApp] Error:', error);
      setStatus('error');

      // ✅ User-friendly error message
      const friendlyError = getUserFriendlyError(error as Error);
      setErrorMessage(friendlyError);

      // ✅ Reset after user has time to read (8 seconds)
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 8000);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Reset button state when modal closes
    setTimeout(() => setStatus('idle'), 300);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`min-h-[44px] ${className}`} // ✅ Mobile-friendly touch target
        onClick={handleAddMiniApp}
        disabled={status === 'loading' || status === 'success'}
        aria-busy={status === 'loading'}
        aria-live="polite"
      >
        {status === 'idle' && (
          <>
            <Bell className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Enable Notifications</span>
          </>
        )}
        {status === 'loading' && (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            <span>Adding...</span>
          </>
        )}
        {status === 'success' && (
          <>
            <Check className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Notifications Enabled!</span>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="truncate">{errorMessage || 'Try Again'}</span>
          </>
        )}
      </Button>

      {/* Success Modal */}
      <NotificationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
      />
    </>
  );
}
